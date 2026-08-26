import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadCumb from "../../../../layouts/BreadCumb";
import TheatreGraphqlPaginatedTable from "../../../../components/ui-templates/TheatreGraphqlPaginatedTable";
import {
  useGetTheatreMemberRolesQuery,
  useGetTheatreRolesQuery,
} from "../../../../features/theatre/theatreGraphqlApi";
import RoleModal from "./RoleModal";

const extractItems = (response) => response?.data?.items || [];

const RoleView = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: memberRoleResponse } = useGetTheatreMemberRolesQuery({ limit: 500 });
  const memberRoles = useMemo(() => extractItems(memberRoleResponse), [memberRoleResponse]);

  const openModal = (role = null) => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  return (
    <>
      <BreadCumb pageList={["Theatre Performance Monitor", "Roles"]} />

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
        <div className="card-body mnh-dropdown-header">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h4 className="mb-1 fw-bold text-white">
                <i className="bx bx-shield me-2"></i>Theatre Team Roles
              </h4>
              <p className="text-secondary mb-0 text-white">Define theatre roles used for member assignment and form filtering.</p>
            </div>
            <button className="btn btn-sm btn-primary" type="button" onClick={() => openModal()}>
              <i className="bx bx-plus me-2"></i>Add Member Role
            </button>
          </div>
        </div>
      </div>

      <TheatreGraphqlPaginatedTable
        key="roles"
        useQuery={useGetTheatreRolesQuery}
        title="Theatre Roles"
        isRefresh={refreshKey}
        searchPlaceholder="Search roles..."
        columns={[
          { key: "SN", label: "SN", style: { width: "70px" }, className: "text-center" },
          {
            key: "name",
            label: "Role",
            style: { width: "220px" },
            render: (row) => (
              <div onClick={() => navigate(`/theatre-time-utilization/roles/${row.uid}`)} style={{ cursor: "pointer" }}>
                <span className="fw-semibold text-dark">{row.name}</span>
                {/* <small className="text-muted d-block">{row.uid}</small> */}
              </div>
            ),
          },
          {
            key: "description",
            label: "Description",
            render: (row) => <span className="text-muted text-wrap">{row.description || "-"}</span>,
          },
          {
            key: "members",
            label: "Members",
            className: "text-center",
            style: { width: "120px" },
            render: (row) => (
              <span className="badge bg-label-primary">
                {memberRoles.filter((mapping) => mapping.role_uid === row.uid).length}
              </span>
            ),
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
                  onClick={() => navigate(`/theatre-time-utilization/roles/${row.uid}`)}
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
        <RoleModal
          role={selectedRole}
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
          onClose={() => {
            setModalOpen(false);
            setSelectedRole(null);
          }}
        />
      )}
    </>
  );
};

export default RoleView;
