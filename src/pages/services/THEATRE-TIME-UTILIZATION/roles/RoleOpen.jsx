import React, { useMemo, useState } from "react";
import { Form, Formik } from "formik";
import { useParams } from "react-router-dom";
import BreadCumb from "../../../../layouts/BreadCumb";
import PaginatedTable from "../../../../components/ui-templates/PaginatedTable";
import FormikSelect from "../../../../components/ui-templates/form-components/FormikSelect";
import showToast from "../../../../helpers/ToastHelper";
import {
  useGetTheatreMembersQuery,
  useGetTheatreMemberRolesQuery,
  useGetTheatreRolesQuery,
  useRegisterTheatreMemberRolesMutation,
} from "../../../../features/theatre/theatreGraphqlApi";
import RoleModal from "./RoleModal";

const fullName = (member) =>
  [member?.firstName, member?.middleName, member?.lastName].filter(Boolean).join(" ") || "N/A";

const RoleOpen = () => {
  const { uid } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { data: rolesResponse } = useGetTheatreRolesQuery({ limit: 500 });
  const { data: membersResponse } = useGetTheatreMembersQuery({ limit: 500 });
  const { data: mappingsResponse, refetch } = useGetTheatreMemberRolesQuery({ limit: 1000 });
  const [registerTheatreMemberRoles] = useRegisterTheatreMemberRolesMutation();

  const roles = useMemo(() => rolesResponse?.data?.items || [], [rolesResponse]);
  const members = useMemo(() => membersResponse?.data?.items || [], [membersResponse]);
  const mappings = useMemo(() => mappingsResponse?.data?.items || [], [mappingsResponse]);
  const role = useMemo(() => roles.find((item) => item.uid === uid), [roles, uid]);
  const assignedMappings = useMemo(
    () =>
      mappings
        .filter((mapping) => mapping.roleUid === uid)
        .map((mapping) => ({
          ...mapping,
          member: members.find((memberItem) => memberItem.uid === mapping.memberUid),
        })),
    [mappings, members, uid]
  );

  const availableMembers = members.filter(
    (member) => !assignedMappings.some((mapping) => mapping.memberUid === member.uid)
  );

  const openEditModal = () => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  const handleAssignMember = async (values, { resetForm, setSubmitting }) => {
    try {
      if (!values.memberUid) {
        showToast("Please select a member", "warning", "Validation Failed");
        return;
      }
      const result = await registerTheatreMemberRoles([{ memberUid: values.memberUid, roleUid: uid }]).unwrap();
      if (result?.status === false) {
        throw new Error(result?.message || "GraphQL request failed");
      }
      showToast("Member assigned successfully", "success", "Complete");
      resetForm();
      setRefreshKey((prev) => prev + 1);
      refetch();
    } catch (error) {
      console.error("Error assigning member:", error);
      showToast(error?.message || "Failed to assign member", "error", "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!role) {
    return (
      <>
        <BreadCumb pageList={["Theatre Performance Monitor", "Roles", "Open"]} />
        <div className="alert alert-info">Role not found.</div>
      </>
    );
  }

  return (
    <>
      <BreadCumb pageList={["Theatre Performance Monitor", "Roles", "Open"]} />

      <div className="card mb-4 animate__animated animate__fadeInDown animate__faster">
        <div className="card-header shadow-sm d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">
            <i className="bx bx-shield me-2"></i>Role Details
          </h5>
          <button type="button" className="btn btn-primary btn-sm" onClick={openEditModal}>
            <i className="bx bx-edit-alt me-1"></i>Edit
          </button>
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <small className="text-muted d-block">Name</small>
              <span className="fw-semibold">{role.name}</span>
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">Members</small>
              <span className="badge bg-label-primary">{assignedMappings.length}</span>
            </div>
            <div className="col-12">
              <small className="text-muted d-block">Description</small>
              <span>{role.description || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Assign Member</h5>
        </div>
        <div className="card-body">
          <Formik initialValues={{ memberUid: "" }} onSubmit={handleAssignMember}>
            {({ isSubmitting }) => (
              <Form>
                <div className="row align-items-end">
                  <FormikSelect
                    name="memberUid"
                    label="Member"
                    staticOptions={availableMembers}
                    mapOption={(memberItem) => ({
                      value: memberItem.uid,
                      label: fullName(memberItem),
                      ...memberItem,
                    })}
                    formatOptionLabel={(memberItem) => (
                      <div>
                        <div className="fw-semibold">{memberItem.label}</div>
                        <small className="text-muted">PF: {memberItem.pfNumber || "N/A"}</small>
                      </div>
                    )}
                    containerClass="col-md-10 mb-3"
                    placeholder="Select member..."
                    minChars={0}
                  />
                  <div className="col-md-2 mb-3">
                    <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
                      <i className="bx bx-plus me-1"></i>Add
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <PaginatedTable
        data={assignedMappings}
        title="Assigned Members"
        isRefresh={refreshKey}
        searchPlaceholder="Search members..."
        columns={[
          { key: "SN", label: "SN", style: { width: "70px" }, className: "text-center" },
          {
            key: "member",
            label: "Member",
            render: (row) => (
              <div>
                <span className="fw-semibold text-dark">{fullName(row.member)}</span>
                <small className="text-muted d-block">PF: {row.member?.pfNumber || "N/A"}</small>
              </div>
            ),
          },
          {
            key: "userUid",
            label: "User UID",
            render: (row) => row.member?.userUid || "N/A",
          },
        ]}
      />

      {modalOpen && (
        <RoleModal
          role={selectedRole}
          onSuccess={() => {
            setRefreshKey((prev) => prev + 1);
          }}
          onClose={() => {
            setModalOpen(false);
            setSelectedRole(null);
          }}
        />
      )}
    </>
  );
};

export default RoleOpen;
