import React from 'react';

export const DialysisSessionPage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4>Dialysis Session</h4>
            </div>
            <div className="card-body">
              <p>Dialysis session management view. (No data loaded yet)</p>
              {/* Placeholder for dialysis session list */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Visit</th>
                      <th>Machine Type</th>
                      <th>Dialyzer Type</th>
                      <th>Started By</th>
                      <th>Closed By</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder rows */}
                    <tr>
                      <td colSpan="8">No dialysis sessions to display.</td>
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