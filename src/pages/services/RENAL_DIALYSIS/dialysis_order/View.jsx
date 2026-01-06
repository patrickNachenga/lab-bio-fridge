import React from 'react';

export const DialysisOrderPage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4>Dialysis Order</h4>
            </div>
            <div className="card-body">
              <p>Dialysis order management view. (No data loaded yet)</p>
              {/* Placeholder for dialysis order list */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Visit</th>
                      <th>Dialysate Na</th>
                      <th>Dialysate K</th>
                      <th>Bicarbonate</th>
                      <th>Hours of Dialysis</th>
                      <th>Target Weight Loss</th>
                      <th>Heparin Units</th>
                      <th>LMWH Used</th>
                      <th>EPO Given</th>
                      <th>Iron Given</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder rows */}
                    <tr>
                      <td colSpan="11">No dialysis orders to display.</td>
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