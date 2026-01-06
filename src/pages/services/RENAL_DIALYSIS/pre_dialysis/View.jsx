import React from "react";

export const PreDialysisPage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4>Pre-Dialysis</h4>
            </div>
            <div className="card-body">
              <p>Pre-dialysis management view. (No data loaded yet)</p>
              {/* Placeholder for pre-dialysis list */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Visit</th>
                      <th>Weight</th>
                      <th>Height</th>
                      <th>Standing BP</th>
                      <th>Resting BP</th>
                      <th>Pulse</th>
                      <th>Respiration</th>
                      <th>Temperature</th>
                      <th>SPO2</th>
                      <th>Time On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder rows */}
                    <tr>
                      <td colSpan="11">No pre-dialysis records to display.</td>
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
