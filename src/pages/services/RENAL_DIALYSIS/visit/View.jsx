import React from 'react';

export const VisitPage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4>Visits</h4>
            </div>
            <div className="card-body">
              <p>Visit management view. (No data loaded yet)</p>
              {/* Placeholder for visit list */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Visit Date</th>
                      <th>Ward</th>
                      <th>Diagnosis</th>
                      <th>Attending Doctor</th>
                      <th>Discharged</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder rows */}
                    <tr>
                      <td colSpan="7">No visits to display.</td>
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