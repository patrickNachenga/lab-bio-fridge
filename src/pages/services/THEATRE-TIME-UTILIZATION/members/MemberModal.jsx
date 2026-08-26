import React, { useEffect, useMemo, useState } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { Users } from "lucide-react";
import GraphqlModal from "../../../../components/GraphqlModal";
import showToast from "../../../../helpers/ToastHelper";
import FormikSelect from "../../../../components/ui-templates/form-components/FormikSelect";
import { useRegisterTheatreMembersMutation } from "../../../../features/theatre/theatreGraphqlApi";

const memberValidationSchema = Yup.object().shape({
  userUid: Yup.string().required("User is required"),
});

const FieldError = ({ name }) => (
  <ErrorMessage name={name}>
    {(msg) => <div className="invalid-feedback d-block">{msg}</div>}
  </ErrorMessage>
);

const getFullName = (user) =>
  [user?.first_name ?? user?.firstName, user?.middle_name ?? user?.middleName, user?.last_name ?? user?.lastName]
    .filter(Boolean)
    .join(" ");

const getInitialUser = (member) => {
  if (!member) return null;
  return {
    value: member.userUid,
    label: [member.firstName, member.middleName, member.lastName].filter(Boolean).join(" "),
    guid: member.userUid,
    first_name: member.firstName,
    middle_name: member.middleName,
    last_name: member.lastName,
    pf_number: member.pfNumber,
    phone_number: member.phoneNumber,
    phone: member.phoneNumber,
    photo: member.photo,
  };
};

const UserPreview = ({ user }) => {
  if (!user) {
    return (
      <div className="alert alert-info mb-0" role="alert">
        Search and select a user to preview their theatre member details.
      </div>
    );
  }

  const fullName = getFullName(user) || user.label || "Selected User";
  const photo = user.photo || user.image || "";

  return (
    <div className="border rounded p-3 bg-light">
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <div className="avatar avatar-xl">
          {photo ? (
            <img
              src={photo}
              alt={fullName}
              className="rounded-circle"
              style={{ width: "72px", height: "72px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle bg-label-primary d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "72px", height: "72px", fontSize: "22px" }}
            >
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-grow-1">
          <h6 className="mb-1 fw-bold">{fullName}</h6>
          <div className="d-flex flex-wrap gap-2">
            <span className="badge bg-label-secondary">PF: {user.pf_number || user.pfNumber || "N/A"}</span>
            <span className="badge bg-label-info">Phone: {user.phone_number || user.phone || user.mobile || "N/A"}</span>
          </div>
          <small className="text-muted d-block mt-1">{user.email || user.user_uid || user.guid || ""}</small>
        </div>
      </div>
    </div>
  );
};

const MemberModal = ({ member, onSuccess, onClose }) => {
  const [selectedUser, setSelectedUser] = useState(() => getInitialUser(member));
  const [registerTheatreMembers] = useRegisterTheatreMembersMutation();

  const initialValues = useMemo(
    () => ({
      userUid: member?.userUid || "",
    }),
    [member]
  );

  useEffect(() => {
    setSelectedUser(getInitialUser(member));
  }, [member]);

  const closeModal = () => {
    setSelectedUser(null);
    if (onClose) onClose();
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const user = selectedUser || getInitialUser(member);
      const payload = {
        uid: member?.uid,
        userUid: values.userUid,
        firstName: user?.first_name || user?.firstName || "",
        middleName: user?.middle_name || user?.middleName || "",
        lastName: user?.last_name || user?.lastName || "",
        pfNumber: user?.pf_number || user?.pfNumber || "",
      };

      const result = await registerTheatreMembers([payload]).unwrap();
      if (result?.status === false) {
        throw new Error(result?.message || "GraphQL request failed");
      }
      showToast("Member saved successfully", "success", "Complete");
      resetForm();
      if (onSuccess) onSuccess();
      closeModal();
    } catch (error) {
      console.error("Error saving member:", error);
      showToast(error?.message || "Failed to save member", "error", "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={memberValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue }) => (
        <GraphqlModal
          isOpen
          title={member?.uid ? "Update Member" : "Add Member"}
          subtitle="Register theatre members through the GraphQL endpoint."
          icon={<Users size={20} />}
          onClose={closeModal}
          isSubmitting={isSubmitting}
          footer={
            <>
              <button type="button" className="btn btn-outline-secondary" onClick={closeModal} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" form="memberForm" className="btn btn-primary" disabled={isSubmitting}>
                <i className="bx bx-check me-1"></i>
                {isSubmitting ? "Saving..." : "Confirm Save"}
              </button>
            </>
          }
        >
          <Form id="memberForm" style={{ minHeight: "300px" }}
          >
            <FormikSelect
              name="userUid"
              label="Select User"
              url="/user/setup"
              isFullPath={true}
              containerClass="col-md-12 mb-3"
              filters={{ page: 1, page_size: 20, paginated: true }}
              mapOption={(item) => ({
                value: item.guid,
                label: `${item.first_name || ""} ${item.middle_name || ""} ${item.last_name || ""}`.trim(),
                guid: item.guid,
                first_name: item.first_name,
                middle_name: item.middle_name,
                last_name: item.last_name,
                pf_number: item.pf_number,
                phone_number: item.phone_number,
                phone: item.phone,
                mobile: item.mobile,
                email: item.email,
                photo: item.photo,
              })}
              formatOptionLabel={(user) => (
                <div className="d-flex align-items-center">
                  <div className="avatar avatar-sm me-3">
                    {user.photo ? (
                      <img src={user.photo} alt={user.label} className="rounded-circle" style={{ width: "34px", height: "34px", objectFit: "cover" }} />
                    ) : (
                      <span className="avatar-initial rounded-circle bg-label-primary">
                        {(user.label || "?").charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="fw-semibold">{user.label}</div>
                    <small className="text-muted">PF: {user.pf_number || "N/A"}</small>
                  </div>
                </div>
              )}
              placeholder="Search users..."
              minChars={3}
              debounceMs={500}
              onSelectObject={(user) => {
                setSelectedUser(user);
                setFieldValue("userUid", user?.value || "");
              }}
            />
            <FieldError name="userUid" />

            <UserPreview user={selectedUser || getInitialUser(member)} />
          </Form>
        </GraphqlModal>
      )}
    </Formik>
  );
};

export default MemberModal;
