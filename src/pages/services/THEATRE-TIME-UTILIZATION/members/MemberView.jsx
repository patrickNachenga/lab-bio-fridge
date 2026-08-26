import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadCumb from "../../../../layouts/BreadCumb";
import TheatreGraphqlPaginatedTable from "../../../../components/ui-templates/TheatreGraphqlPaginatedTable";
import {
  useGetTheatreMembersQuery,
  useGetTheatreMemberRolesQuery,
  useGetTheatreRolesQuery,
  useImportTheatreMembersFromExcelMutation,
  useLazyDownloadTheatreMemberTemplateQuery,
} from "../../../../features/theatre/theatreGraphqlApi";
import MemberModal from "./MemberModal";
import LookupImportModal from "../lookups/LookupImportModal";

const fullName = (member) =>
  [member.firstName, member.middleName, member.lastName].filter(Boolean).join(" ") || "N/A";

const MemberView = () => {
  const navigate = useNavigate();

  const [selectedMember, setSelectedMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [importTheatreMembers] = useImportTheatreMembersFromExcelMutation();
  const [downloadMemberTemplate] = useLazyDownloadTheatreMemberTemplateQuery();

  const { data: rolesResponse } = useGetTheatreRolesQuery({ limit: 500 });
  const { data: memberRolesResponse } = useGetTheatreMemberRolesQuery({ limit: 500 });
  const roles = useMemo(() => rolesResponse?.data?.items || [], [rolesResponse]);
  const memberRoles = useMemo(() => memberRolesResponse?.data?.items || [], [memberRolesResponse]);

  const openModal = (member = null) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const getRolesForMember = (memberUid) => {
    const roleUids = memberRoles.filter((mapping) => mapping.memberUid === memberUid).map((mapping) => mapping.roleUid);
    return roles.filter((role) => roleUids.includes(role.uid));
  };

  return (
    <>
      <BreadCumb pageList={["Theatre Performance Monitor", "Members"]} />

      <style>
        {`
        .mnh-dropdown-header {
        background: linear-gradient(135deg, #e53935 5%, #1976d2 50%, #ffd700  100%);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        overflow: hidden;
        color: #fff;
        }

        `}
      </style>

      <div className="card mb-4 shadow-sm animate__animated animate__fadeInDown animate__faster">
        <div className="card-body mnh-dropdown-header ">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h4 className="mb-1 fw-bold text-white">
                <i className="bx bx-group me-2 "></i>Theatre Members
              </h4>
              <p className="text-secondary mb-0 text-white">Register theatre team members and assign their theatre roles.</p>
            </div>
            <div className="d-flex gap-3">
              <button className="btn btn-sm btn-outline-info" style={{ minWidth: "120px", border: "0.5px solid white" }} type="button" onClick={() => setImportModalOpen(true)}>
                <i className="bx bx-upload me-2"></i>Import Excel
              </button>
              <button className="btn btn-sm btn-primary" style={{ minWidth: "100px", border: "0.5px solid white" }} type="button" onClick={() => openModal()}>
              <i className="bx bx-plus me-2"></i>Add Member
            </button>
            </div>




          </div>
        </div>
      </div>

      <TheatreGraphqlPaginatedTable
        key="members"
        useQuery={useGetTheatreMembersQuery}
        title="Theatre Members"
        isRefresh={refreshKey}
        searchPlaceholder="Search members..."
        columns={[
          { key: "SN", label: "SN", style: { width: "70px" }, className: "text-center" },
          {
            key: "member",
            label: "Member",
            style: { width: "260px" },
            render: (row) => (
              <div className="d-flex align-items-center">
                {row.photo ? (
                  <img
                    src={row.photo}
                    alt={fullName(row)}
                    className="rounded-circle me-3"
                    style={{ width: "42px", height: "42px", objectFit: "cover" }}
                  />
                ) : (
                  <span className="avatar-initial rounded-circle bg-label-primary me-3 d-inline-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
                    {fullName(row).charAt(0)}
                  </span>
                )}
                <div>
                  <div className="fw-semibold text-dark">{fullName(row)}</div>
                <small className="text-muted">{row.userUid || "N/A"}</small>
                </div>
              </div>
            ),
          },
          {
            key: "pfNumber",
            label: "PF / Phone",
            style: { width: "180px" },
            render: (row) => (
              <div>
                <span className="badge bg-label-secondary">{row.pfNumber || "N/A"}</span>
              </div>
            ),
          },
          {
            key: "roles",
            label: "Roles",
            render: (row) => {
              const assignedRoles = getRolesForMember(row.uid);
              if (assignedRoles.length === 0) return <span className="text-muted">No roles assigned</span>;
              return (
                <div className="d-flex flex-wrap gap-1">
                  {assignedRoles.map((role) => (
                    <span className="badge bg-label-primary" key={role.uid}>{role.name}</span>
                  ))}
                </div>
              );
            },
          },
          {
            key: "actions",
            label: "Actions",
            className: "text-center",
            style: { width: "150px" },
            render: (row) => (
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary border-0"
                  type="button"
                  title="Open"
                  onClick={() => navigate(`/theatre-time-utilization/members/${row.uid}`)}
                >
                  <i className="bx bx-show"></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary border-0"
                  type="button"
                  title="Edit"
                  onClick={() => openModal(row)}
                >
                  <i className="bx bx-edit"></i>
                </button>
              </div>
            ),
          },
        ]}
      />

      {modalOpen && (
        <MemberModal
          member={selectedMember}
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
          onClose={() => {
            setModalOpen(false);
            setSelectedMember(null);
          }}
        />
      )}

      {importModalOpen && (
        <LookupImportModal
          meta={{ title: "Theatre Members" }}
          importMutation={importTheatreMembers}
          downloadTemplateQuery={downloadMemberTemplate}
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
          onClose={() => setImportModalOpen(false)}
        />
      )}
    </>
  );
};

export default MemberView;
