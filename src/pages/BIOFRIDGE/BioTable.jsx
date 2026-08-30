import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_FILTERS = ["active", "warning", "critical", "pending", "completed", "maintenance", "open", "resolved", "stored"];

function textFromNode(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join(" ");
  if (node.props) return textFromNode(node.props.children);
  return "";
}

export default function BioTable({ children, placeholder = "Search this table...", pageSize = 10, filters = DEFAULT_FILTERS }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const table = React.Children.only(children);
  const sections = React.Children.toArray(table.props.children);
  const body = sections.find((section) => section.type === "tbody");
  const rows = body ? React.Children.toArray(body.props.children).filter((row) => row && row.type === "tr") : [];

  const visibleRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return rows.filter((row) => {
      const rowText = textFromNode(row).toLowerCase();
      const matchesQuery = !normalizedQuery || rowText.includes(normalizedQuery);
      const matchesFilter = filter === "all" || rowText.includes(filter.toLowerCase());
      return matchesQuery && matchesFilter;
    });
  }, [rows, query, filter]);

  useEffect(() => setPage(1), [query, filter]);

  const pageCount = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = visibleRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const nextTableSections = sections.map((section) => {
    if (section !== body) return section;
    return React.cloneElement(section, {}, pageRows);
  });
  const nextTable = React.cloneElement(table, {}, nextTableSections);
  const availableFilters = filters.filter((item) => rows.some((row) => textFromNode(row).toLowerCase().includes(item.toLowerCase())));
  const firstResult = visibleRows.length ? (currentPage - 1) * pageSize + 1 : 0;
  const lastResult = Math.min(currentPage * pageSize, visibleRows.length);

  return (
    <div className="bio-table-shell">
      <div className="bio-table-tools">
        <label className="bio-table-search">
          <i className="bx bx-search" />
          <input aria-label="Search table" placeholder={placeholder} value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="bio-table-filter" aria-label="Filter table">
          <i className="bx bx-filter-alt" />
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All records</option>
            {availableFilters.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}
          </select>
        </div>
        <span className="bio-table-count">{visibleRows.length} record{visibleRows.length === 1 ? "" : "s"}</span>
      </div>
      <div className="bio-table-wrap">{nextTable}</div>
      <div className="bio-table-footer">
        <span>Showing {firstResult}-{lastResult} of {visibleRows.length}</span>
        <div className="bio-table-pagination">
          <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><i className="bx bx-chevron-left" /></button>
          <strong>{currentPage}</strong><span>of {pageCount}</span>
          <button type="button" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}><i className="bx bx-chevron-right" /></button>
        </div>
      </div>
    </div>
  );
}
