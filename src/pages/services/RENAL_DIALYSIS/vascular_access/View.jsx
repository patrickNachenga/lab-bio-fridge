import React from "react";

export const VascularAccessPage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4>Vascular Access</h4>
            </div>
            <div className="card-body">
              <p>Vascular access management view. (No data loaded yet)</p>
              {/* Placeholder for vascular access list */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Visit</th>
                      <th>Access Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder rows */}
                    <tr>
                      <td colSpan="3">No vascular accesses to display.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
