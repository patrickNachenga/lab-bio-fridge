import React from 'react';

export const DialysisMonitoringPage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4>Dialysis Monitoring</h4>
            </div>
            <div className="card-body">
              <p>Dialysis monitoring view. (No data loaded yet)</p>
              {/* Placeholder for dialysis monitoring list */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Session</th>
                      <th>Time</th>
                      <th>BP</th>
                      <th>Pulse</th>
                      <th>Resp</th>
                      <th>Temp</th>
                      <th>SPO2</th>
                      <th>Blood Flow</th>
                      <th>UF Rate</th>
                      <th>Total Removed ML</th>
                      <th>Remarks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder rows */}
                    <tr>
                      <td colSpan="12">No dialysis monitoring records to display.</td>
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