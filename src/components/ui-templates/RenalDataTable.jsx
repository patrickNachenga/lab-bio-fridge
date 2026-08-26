import React, { useMemo, useState } from "react";

const RenalDataTable = ({
  title,
  subtitle,
  data = [],
  columns = [],
  actions,
  pageSize = 8,
  searchPlaceholder = "Search...",
  emptyText = "No records found",
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter((row) => JSON.stringify(row).toLowerCase().includes(query));
  }, [data, search]);

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <div className="renal-data-table">
      <div className="renal-table-header">
        <div>
          {title && <h5 className="fw-bold mb-1">{title}</h5>}
          {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <div className="input-group input-group-sm renal-table-search">
            <span className="input-group-text">
              <i className="bx bx-search"></i>
            </span>
            <input
              className="form-control"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          {actions}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key || column.label} className={column.className} style={column.style}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-muted py-4">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={row.uid || row.id || rowIndex}>
                  {columns.map((column) => (
                    <td key={column.key || column.label} className={column.className} style={column.style}>
                      {column.key === "SN"
                        ? (page - 1) * pageSize + rowIndex + 1
                        : column.render
                        ? column.render(row, rowIndex)
                        : row[column.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="renal-table-footer">
        <span className="text-muted small">
          Showing {rows.length ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </span>
        <div className="btn-group btn-group-sm">
          <button className="btn btn-outline-secondary" disabled={page === 1} onClick={() => goToPage(page - 1)}>
            <i className="bx bx-chevron-left"></i>
          </button>
          <button className="btn btn-light disabled">{page} / {totalPages}</button>
          <button className="btn btn-outline-secondary" disabled={page === totalPages} onClick={() => goToPage(page + 1)}>
            <i className="bx bx-chevron-right"></i>
          </button>
        </div>
      </div>

      <style>{`
        .renal-data-table {
          background: #ffffff;
          border: 1px solid #dbe3ee;
          border-radius: 12px;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
          overflow: hidden;
        }

        .renal-table-header,
        .renal-table-footer {
          align-items: center;
          background: #f8fafc;
          display: flex;
          gap: 12px;
          justify-content: space-between;
          padding: 14px 16px;
        }

        .renal-table-header {
          border-bottom: 1px solid #dbe3ee;
        }

        .renal-table-footer {
          border-top: 1px solid #dbe3ee;
        }

        .renal-table-search {
          min-width: 260px;
        }

        thead th {
          background: #f8fafc;
          color: #475569;
          font-size: 0.78rem;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
};

export default RenalDataTable;
