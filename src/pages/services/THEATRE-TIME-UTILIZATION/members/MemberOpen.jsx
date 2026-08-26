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
import MemberModal from "./MemberModal";

const fullName = (member) =>
  [member?.firstName, member?.middleName, member?.lastName].filter(Boolean).join(" ") || "N/A";

const MemberOpen = () => {
  const { uid } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { data: membersResponse } = useGetTheatreMembersQuery({ limit: 500 });
  const { data: rolesResponse } = useGetTheatreRolesQuery({ limit: 500 });
  const { data: mappingsResponse, refetch } = useGetTheatreMemberRolesQuery({ limit: 1000 });
  const [registerTheatreMemberRoles] = useRegisterTheatreMemberRolesMutation();

  const members = useMemo(() => membersResponse?.data?.items || [], [membersResponse]);
  const roles = useMemo(() => rolesResponse?.data?.items || [], [rolesResponse]);
  const mappings = useMemo(() => mappingsResponse?.data?.items || [], [mappingsResponse]);
  const member = useMemo(() => members.find((item) => item.uid === uid), [members, uid]);
  const assignedMappings = useMemo(
    () =>
      mappings
        .filter((mapping) => mapping.memberUid === uid)
        .map((mapping) => ({
          ...mapping,
          role: roles.find((role) => role.uid === mapping.roleUid),
        })),
    [mappings, roles, uid]
  );

  const availableRoles = roles.filter(
    (role) => !assignedMappings.some((mapping) => mapping.roleUid === role.uid)
  );

  const openEditModal = () => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleAssignRole = async (values, { resetForm, setSubmitting }) => {
    try {
      if (!values.roleUid) {
        showToast("Please select a role", "warning", "Validation Failed");
        return;
      }
      const result = await registerTheatreMemberRoles([{ memberUid: uid, roleUid: values.roleUid }]).unwrap();
      if (result?.status === false) {
        throw new Error(result?.message || "GraphQL request failed");
      }
      showToast("Role assigned successfully", "success", "Complete");
      resetForm();
      setRefreshKey((prev) => prev + 1);
      refetch();
    } catch (error) {
      console.error("Error assigning role:", error);
      showToast(error?.message || "Failed to assign role", "error", "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!member) {
    return (
      <>
        <BreadCumb pageList={["Theatre Performance Monitor", "Members", "Open"]} />
        <div className="alert alert-info">Member not found.</div>
      </>
    );
  }

  return (
    <>
      <BreadCumb pageList={["Theatre Performance Monitor", "Members", "Open"]} />

      <div className="card mb-4 animate__animated animate__fadeInDown animate__faster">
        <div className="card-header shadow-sm d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">
            <i className="bx bx-group me-2"></i>Member Details
          </h5>
          <button type="button" className="btn btn-primary btn-sm" onClick={openEditModal}>
            <i className="bx bx-edit-alt me-1"></i>Edit
          </button>
        </div>

        <div className="card-body">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="rounded-circle bg-label-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: "82px", height: "82px", fontSize: "28px" }}>
              {fullName(member).charAt(0)}
            </div>
            <div>
              <h5 className="mb-1 fw-bold">{fullName(member)}</h5>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-label-secondary">PF: {member.pfNumber || "N/A"}</span>
                <span className="badge bg-label-info">User: {member.userUid || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Assign Theatre Role</h5>
        </div>
        <div className="card-body">
          <Formik initialValues={{ roleUid: "" }} onSubmit={handleAssignRole}>
            {({ isSubmitting }) => (
              <Form>
                <div className="row align-items-end">
                  <FormikSelect
                    name="roleUid"
                    label="Role"
                    staticOptions={availableRoles}
                    mapOption={(role) => ({ value: role.uid, label: role.name, ...role })}
                    containerClass="col-md-10 mb-3"
                    placeholder="Select role..."
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
        title="Assigned Roles"
        isRefresh={refreshKey}
        searchPlaceholder="Search roles..."
        columns={[
          { key: "SN", label: "SN", style: { width: "70px" }, className: "text-center" },
          {
            key: "role",
            label: "Role",
            render: (row) => (
              <div>
                <span className="fw-semibold text-dark">{row.role?.name || "Unknown role"}</span>
                <small className="text-muted d-block">{row.role?.description || "-"}</small>
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
    </>
  );
};

export default MemberOpen;
