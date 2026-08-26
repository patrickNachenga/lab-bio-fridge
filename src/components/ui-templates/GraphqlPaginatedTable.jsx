import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import "animate.css";

// ============================================================
// STATUS CODE MAPPING (as provided by the user)
// Maps GraphQL response codes to human-readable messages
// ============================================================
const STATUS_CODE_MAP = {
    8000: { type: "success", message: "Operation completed successfully." },
    8001: { type: "error", message: "Invalid request. Please check your input and try again." },
    8002: { type: "warning", message: "No record found matching your search criteria." },
    8003: { type: "error", message: "Unauthorized access. Please login again." },
    8004: { type: "warning", message: "Duplicate record detected." },
    8005: { type: "error", message: "Operation failed due to a server error." },
    8006: { type: "warning", message: "Data is currently in use and cannot be modified." },
    8007: { type: "error", message: "Bad request. Please verify your input." },
    8008: { type: "error", message: "Method not allowed for this endpoint." },
    8009: { type: "error", message: "Restricted access. Contact your administrator." },
    8010: { type: "warning", message: "Limit reached for this operation." },
    8011: { type: "error", message: "A required value is missing." },
    8012: { type: "info", message: "No changes were made to the record." },
    8013: { type: "error", message: "The requested file was not found." },
    8016: { type: "error", message: "Parent record does not exist." },
    8021: { type: "info", message: "This process has already been completed." },
    8022: { type: "warning", message: "This record is not ready for submission." },
    8023: { type: "error", message: "Process workflow is not defined." },
    8024: { type: "error", message: "No approval action is available for this record." },
    8025: { type: "error", message: "No active financial year found." },
    8026: { type: "error", message: "Submission stage is not defined." },
    8027: { type: "error", message: "Receiving stage is not defined." },
    8028: { type: "warning", message: "This record has already been submitted." },
    8029: { type: "warning", message: "This record has been deleted." },
    8030: { type: "warning", message: "This record has been dropped." },
    8031: { type: "info", message: "This record is currently in progress." },
    8035: { type: "info", message: "This record is in the approval process." },
    8037: { type: "info", message: "This record has already been approved." },
    8038: { type: "warning", message: "The system has not been initialized." },
    8040: { type: "success", message: "Operation completed partially." },
    8042: { type: "warning", message: "This record is already assigned." },
    8044: { type: "warning", message: "Duplicate assignment detected." },
};

const STATUS_BADGE_MAP = {
    success: "bg-label-success",
    error: "bg-label-danger",
    warning: "bg-label-warning",
    info: "bg-label-info",
};

const STATUS_ICON_MAP = {
    success: "bx-check-circle",
    error: "bx-error-circle",
    warning: "bx-error",
    info: "bx-info-circle",
};

// ============================================================
// DEFAULT RESPONSE EXTRACTOR
// Handles the common envelope: { status, code, message, data: { items, totalCount } }
// ============================================================
const defaultResponseExtractor = (response) => {
    // If response has status, code, message structure (GraphQL envelope)
    if (response && typeof response === "object" && "code" in response) {
        const payload = response.data;
        if (payload?.items) {
            return {
                items: payload.items,
                totalCount: payload.totalCount ?? payload.items.length,
                statusCode: response.code,
                statusMessage: response.message,
                statusType: (STATUS_CODE_MAP[response.code] || {}).type || "info",
            };
        }
        if (Array.isArray(payload)) {
            return {
                items: payload,
                totalCount: payload.length,
                statusCode: response.code,
                statusMessage: response.message,
                statusType: (STATUS_CODE_MAP[response.code] || {}).type || "info",
            };
        }
        if (payload === null || payload === undefined) {
            // Non-SUCCESS codes may not have data payload
            return {
                items: [],
                totalCount: 0,
                statusCode: response.code,
                statusMessage: response.message,
                statusType: (STATUS_CODE_MAP[response.code] || {}).type || "info",
            };
        }
        // Fallback – payload is something else, maybe already an array
        return {
            items: Array.isArray(payload) ? payload : [],
            totalCount: Array.isArray(payload) ? payload.length : 0,
            statusCode: response.code,
            statusMessage: response.message,
            statusType: (STATUS_CODE_MAP[response.code] || {}).type || "info",
        };
    }

    // Legacy / plain response
    const payload = response?.data?.items || Array.isArray(response?.data)
        ? response.data
        : (response?.data ?? response);

    if (payload?.items) {
        return {
            items: payload.items,
            totalCount: payload.totalCount ?? payload.items.length,
        };
    }

    if (Array.isArray(payload)) {
        return {
            items: payload,
            totalCount: payload.length,
        };
    }

    return { items: [], totalCount: 0 };
};

// ============================================================
// SKELETON LOADER COMPONENT
// ============================================================
const SkeletonLoader = ({ columns, rows = 8 }) => {
    const skeletonColumns = columns.length;
    return (
        <div className="skeleton-wrap">
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <div
                    key={rowIdx}
                    className="skeleton-row"
                    style={{
                        animationDelay: `${rowIdx * 0.05}s`,
                    }}
                >
                    {Array.from({ length: skeletonColumns }).map((__, colIdx) => (
                        <div
                            key={colIdx}
                            className="skeleton-cell"
                            style={{
                                width: colIdx === 0 ? "60px" : `${70 + Math.random() * 25}%`,
                            }}
                        >
                            <div className="skeleton-bar" />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

// ============================================================
// STATUS BAR COMPONENT
// Displays the GraphQL response code / message at the top of the table
// ============================================================
const StatusBar = ({ statusCode, statusMessage, statusType }) => {
    if (!statusCode && !statusMessage) return null;
    if (statusCode === 8000) return null; // Don't show bar for SUCCESS

    const codeInfo = STATUS_CODE_MAP[statusCode];
    const displayMessage = statusMessage || codeInfo?.message || `Unknown status code ${statusCode}`;
    const badgeClass = STATUS_BADGE_MAP[statusType] || "bg-label-info";
    const iconClass = STATUS_ICON_MAP[statusType] || "bx-info-circle";

    return (
        <div className={`status-bar status-bar--${statusType} animate__animated animate__fadeInDown`}>
            <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className={`badge ${badgeClass} d-flex align-items-center gap-1`}>
                    <i className={`bx ${iconClass}`}></i>
                    Code {statusCode}
                </span>
                <span className="status-bar-message">{displayMessage}</span>
            </div>
        </div>
    );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const GraphqlPaginatedTable = ({
    useQuery,
    queryVariables = {},
    title = "",
    columns,
    buttons,
    onRowSelect,
    isRefresh,
    filters = [],
    filterGroups = [],
    initialPageSize = 10,
    pageSizeOptions = [10, 25, 50, 100],
    hideTitle = false,
    searchPlaceholder = "Search...",
    rowClassName,
    responseExtractor,
    emptyMessage = "No Records Found",
    loadingMessage = "Fetching Records...",
    errorMessage = "Unable to fetch records. Please try again later.",
    showSearch = true,
    showPageSize = true,
    showRecordCount = true,
    statusBar = true,
    // Skeleton configuration
    skeletonRows = 5,
    // Transition animation key – changes trigger a re-animation of rows
    animKey,
}) => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const debounceTimer = useRef(null);
    const prevRefreshRef = useRef(isRefresh);
    const [pageSizeOptionsState] = useState(pageSizeOptions);

    // Animation trigger – forces rows to re-animate on page/search change
    const [transitionKey, setTransitionKey] = useState(0);
    // Track whether data just arrived (for smooth appearance)
    const [dataArrived, setDataArrived] = useState(false);
    const prevLoadingRef = useRef(true);

    // Selected filters state
    const [selectedFilters, setSelectedFilters] = useState(["ALL"]);
    const [selectedFilterGroups, setSelectedFilterGroups] = useState(() => {
        return filterGroups.reduce((acc, group) => {
            acc[group.key || group.group] = group.selected || [];
            return acc;
        }, {});
    });

    // Build the variables for the query
    const variables = useMemo(() => ({
        ...queryVariables,
        pagination: {
            offset: currentPage,
            limit: pageSize,
            search: debouncedSearch || undefined,
        },
    }), [queryVariables, currentPage, pageSize, debouncedSearch]);

    // Execute the RTK Query hook
    const {
        data: response,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useQuery(variables, { skip: false });

    const extractor = responseExtractor || defaultResponseExtractor;
    const extractedResponse = extractor(response);

    // Normalise extracted fields
    const items = extractedResponse.items || [];
    const totalRecords = extractedResponse.totalCount || items.length || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const statusCode = extractedResponse.statusCode;
    const statusMessage = extractedResponse.statusMessage;
    const statusType = extractedResponse.statusType;

    // Reset internal state if the query hook changes (e.g., navigation between different data types)
    useEffect(() => {
        setCurrentPage(0);
        setSearchQuery("");
        setDebouncedSearch("");
        setTransitionKey((k) => k + 1);
    }, [useQuery]);

    // Debounce search
    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 600);
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [searchQuery]);

    // Ensure transition key bumps when debounced search settles
    useEffect(() => { setTransitionKey((k) => k + 1); }, [debouncedSearch]);

    // Handle refresh trigger
    useEffect(() => {
        if (isRefresh !== prevRefreshRef.current) {
            prevRefreshRef.current = isRefresh;
            refetch();
            setTransitionKey((k) => k + 1);
        }
    }, [isRefresh, refetch]);

    // Detect transition from loading to loaded – triggers row fade-in
    useEffect(() => {
        if (prevLoadingRef.current && !isLoading && !isFetching) {
            setDataArrived(true);
        } else {
            setDataArrived(false);
        }
        prevLoadingRef.current = isLoading || isFetching;
    }, [isLoading, isFetching]);

    // When animKey prop changes externally, bump transition
    useEffect(() => {
        if (animKey !== undefined) {
            setTransitionKey((k) => k + 1);
        }
    }, [animKey]);

    // Trigger row animation on page change
    useEffect(() => {
        if (!isLoading && !isFetching) {
            setDataArrived(true);
        }
    }, [currentPage, pageSize]);

    const handlePageClick = useCallback((event) => {
        setCurrentPage(event.selected);
        setTransitionKey((k) => k + 1);
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0); // Reset page immediately on typing
    }, []);

    const handleFilterChange = useCallback((selected) => {
        let values = selected ? selected.map((opt) => opt.value) : [];
        if (values.includes("ALL")) {
            values = ["ALL"];
        } else {
            values = values.filter((v) => v !== "ALL");
        }
        setSelectedFilters(values);
        setCurrentPage(0);
    }, []);

    const handleGroupFilterChange = useCallback((groupKey, selected) => {
        const values = selected ? selected.map((opt) => opt.value) : [];
        setSelectedFilterGroups((prev) => ({ ...prev, [groupKey]: values }));
        setCurrentPage(0);
    }, []);

    const resetAllFilters = useCallback(() => {
        const cleared = {};
        filterGroups.forEach((g) => (cleared[g.key || g.group] = []));
        setSelectedFilterGroups(cleared);
        setSelectedFilters(["ALL"]);
        setSearchQuery("");
        setCurrentPage(0);
    }, [filterGroups]);

    const getGroupKey = (g) => g.group || g.key;

    const renderCellContent = (row, col, rowIndex) => {
        if (col.key === "SN") {
            return pageSize * currentPage + rowIndex + 1;
        }
        if (typeof col.render === "function") {
            return col.render(row, rowIndex, currentPage, pageSize);
        }
        return row[col.key] ?? "N/A";
    };

    // Determine if we should show the full-page skeleton or the inline skeleton
    const showSkeleton = isLoading && items.length === 0;

    return (
        <div className="card graphql-data-table shadow-sm border-0 animate__animated animate__fadeIn">
            <div className="graphql-table-accent" />
            {/* ────── HEADER ────── */}
            {!hideTitle && (title || (buttons && buttons.length > 0)) && (
                <div className="graphql-table-header d-flex justify-content-between align-items-center card-header border-bottom-0 py-3">
                    {title && (
                        <div>
                            <h5 className="mb-0 fw-bold graphql-table-title">
                                <span className="graphql-table-title-icon">
                                    <i className="bx bx-table"></i>
                                </span>
                                {title}
                            </h5>
                            <small className="text-muted d-block mt-1">Live Theatre Service records</small>
                        </div>
                    )}
                    {buttons && buttons.length > 0 && (
                        <div className="d-flex align-items-center gap-2">
                            {buttons.map((button, index) =>
                                button.render ? (
                                    <React.Fragment key={`action_btn_${index}`}>
                                    </React.Fragment>
                                ) : (
                                    <button
                                        key={`action_btn_${index}`}
                                        className={`btn btn-sm ${button.className || "btn-primary"} d-flex align-items-center gap-1`}
                                        onClick={button.onClick}
                                        disabled={button.disabled}
                                        title={button.tooltip || ""}
                                    >
                                        {button.icon && <i className={`bx ${button.icon}`}></i>}
                                        {button.label}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="card-body graphql-table-body">
                {/* ────── STATUS BAR ────── */}
                {statusBar && (
                    <StatusBar
                        statusCode={statusCode}
                        statusMessage={statusMessage}
                        statusType={statusType}
                    />
                )}

                {/* ────── FILTERS SECTION ────── */}
                {(filterGroups.length > 0 || filters.length > 0 || showSearch) && (
                    <div className={`row g-2 mb-3 align-items-end ${dataArrived ? "fade-section-visible" : ""}`}>
                        {/* Group Filters */}
                        {filterGroups.length > 0 && (
                            <div className="col-12">
                                <div className="row g-2">
                                    {filterGroups.map((group) => (
                                        <div key={getGroupKey(group)} className="col-auto">
                                            <div className="input-group input-group-sm">
                                                <span className="input-group-text bg-light text-info fw-semibold">
                                                    <i className="bx bx-filter-alt me-1"></i>
                                                    {group.label}
                                                </span>
                                                <Select
                                                    isMulti
                                                    options={group.options}
                                                    value={group.options.filter((opt) =>
                                                        (selectedFilterGroups[getGroupKey(group)] || []).some(
                                                            (v) => v === opt.value || String(v) === String(opt.value)
                                                        )
                                                    )}
                                                    onChange={(selected) =>
                                                        handleGroupFilterChange(getGroupKey(group), selected)
                                                    }
                                                    placeholder={group.placeholder || `Select ${group.label}`}
                                                    classNamePrefix="react-select"
                                                    styles={{
                                                        menu: (base) => ({ ...base, zIndex: 9999 }),
                                                        control: (base) => ({ ...base, minHeight: "32px", minWidth: "180px" }),
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {filterGroups.length > 0 && (
                                        <div className="col-auto d-flex align-items-center">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={resetAllFilters}
                                                title="Reset All Filters"
                                            >
                                                <i className="bx bx-reset me-1"></i>Reset
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Page Size + Simple Filters + Search */}
                        <div className="col-12">
                            <div className="d-flex flex-wrap align-items-center gap-2">
                                {showPageSize && (
                                    <div style={{ minWidth: "90px" }}>
                                        <Select
                                            options={pageSizeOptionsState.map((s) => ({ value: s, label: `${s}` }))}
                                            value={{ value: pageSize, label: `${pageSize}` }}
                                            onChange={(selected) => {
                                                setPageSize(Number(selected.value));
                                                setCurrentPage(0);
                                            }}
                                            classNamePrefix="react-select"
                                            styles={{
                                                control: (base) => ({ ...base, minHeight: "32px" }),
                                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                            }}
                                            menuPortalTarget={document.body}
                                        />
                                    </div>
                                )}

                                {filters.length > 0 && (
                                    <div style={{ minWidth: "220px" }}>
                                        <Select
                                            isMulti
                                            options={filters}
                                            value={filters.filter((f) => selectedFilters.includes(f.value))}
                                            onChange={handleFilterChange}
                                            placeholder="Filter..."
                                            classNamePrefix="react-select"
                                            styles={{
                                                menu: (base) => ({ ...base, zIndex: 9999 }),
                                                control: (base) => ({ ...base, minHeight: "32px" }),
                                                input: (base) => ({ ...base, minWidth: "180px" }),
                                            }}
                                        />
                                    </div>
                                )}

                                {showSearch && (
                                    <div className="ms-auto graphql-table-search">
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text bg-white">
                                                <i className="bx bx-search text-muted"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={searchPlaceholder}
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                            />
                                            {searchQuery && (
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => setSearchQuery("")}
                                                    type="button"
                                                >
                                                    <i className="bx bx-x"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ────── TABLE / SKELETON / ERROR / EMPTY ────── */}
                <div className="table-responsive graphql-table-wrap">

                    <table className="table table-hover mb-0 align-middle graphql-table">
                        <thead >
                            <tr>
                                {columns.map((col, idx) => (
                                    <th
                                        key={col.key || col.label || idx}
                                        className={col.className || ""}
                                        style={{
                                            whiteSpace: "nowrap",
                                            fontSize: "0.76rem",
                                            fontWeight: 600,
                                            ...(col.style || {}),
                                        }}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {showSkeleton ? (
                                <tr>
                                    <td colSpan={columns.length}>
                                        <SkeletonLoader columns={columns} rows={skeletonRows} />
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                        <td colSpan={columns.length}>
                                            <div className="alert alert-danger m-3 text-center align-items-center justify-content-center" role="alert">
                                            <i className="bx bx-error-circle fs-4 d-block mb-2"></i>
                                                <p className="mb-0">{error?.data?.message || errorMessage}</p><br />
                                            <button
                                                className="btn btn-sm btn-outline-danger mt-2"
                                                onClick={() => refetch()}
                                                    style={{ minWidth: "120px", border: "0.5px solid red" }}
                                            >
                                                <i className="bx bx-refresh me-1"></i>Retry
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                                ) : items.length === 0 && !isFetching ? (
                                <tr>
                                            <td colSpan={columns.length}>
                                        <div className="text-center py-5">
                                            <i className="bx bx-data fs-1 text-muted d-block mb-2"></i>
                                            <p className="text-muted mb-0">{emptyMessage}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                items.map((row, rowIndex) => (
                                    <tr
                                        key={row.uid || row.id || rowIndex}
                                        className={[
                                            typeof rowClassName === "function"
                                                ? rowClassName(row, rowIndex)
                                                : rowClassName || "",
                                            "table-row-enter",
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                        style={{
                                            animationDelay: `${rowIndex * 0.04}s`,
                                            cursor: onRowSelect ? "pointer" : "default",
                                        }}
                                        onClick={() => onRowSelect && onRowSelect(row)}
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className={col.className || ""}
                                                style={col.style || {}}
                                            >
                                                {renderCellContent(row, col, rowIndex)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}

                            {/* Inline fetching indicator when we already have data but refetching */}
                            {isFetching && !isLoading && items.length > 0 && (
                                <tr className="fetching-overlay-row">
                                    <td colSpan={columns.length}>
                                        <div className="fetching-overlay d-flex align-items-center justify-content-center gap-2 py-1">
                                            <div className="fetching-dot" />
                                            <span className="text-muted small">Refreshing...</span>
                                            {Array.from({ length: 3 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="fetching-dot"
                                                    style={{ animationDelay: `${i * 0.2}s` }}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ────── PAGINATION FOOTER ────── */}
                {!isLoading && !isError && items.length > 0 && (
                    <div className="graphql-table-footer d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2 animate__animated animate__fadeInUp animate__faster">
                        {showRecordCount && (
                            <div className="text-muted small">
                                <i className="bx bx-list-ul me-1"></i>
                                Showing{" "}
                                <span className="fw-semibold">{pageSize * currentPage + 1}</span>
                                {" "}to{" "}
                                <span className="fw-semibold">
                                    {Math.min(pageSize * (currentPage + 1), totalRecords)}
                                </span>
                                {" "}of{" "}
                                <span className="fw-semibold">{totalRecords}</span> records
                            </div>
                        )}
                        <ReactPaginate
                            previousLabel={<i className="bx bx-chevron-left"></i>}
                            nextLabel={<i className="bx bx-chevron-right"></i>}
                            breakLabel={"..."}
                            pageCount={Math.max(totalPages, 1)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName="pagination pagination-sm justify-content-center mb-0"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            activeClassName="active"
                            forcePage={currentPage}
                            disabledClassName="disabled"
                        />
                    </div>
                )}
            </div>

            {/* ────────────────────────────────────────────────── */}
            {/*  STYLES                                          */}
            {/* ────────────────────────────────────────────────── */}
            <style>{`
                /* ============================================
                   CARD / LAYOUT
                   ============================================ */
                .graphql-data-table {
                    border-radius: 8px;
                    overflow: hidden;
                }

                .graphql-table-header {
                    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
                    border-bottom: 1px solid #eef2f7 !important;
                }

                .graphql-table-title {
                    align-items: center;
                    color: #111827;
                    display: flex;
                    gap: 10px;
                    letter-spacing: 0;
                }

                .graphql-table-title-icon {
                    align-items: center;
                    background: #eff6ff;
                    border: 1px solid #dbeafe;
                    border-radius: 8px;
                    color: #2563eb;
                    display: inline-flex;
                    height: 34px;
                    justify-content: center;
                    width: 34px;
                }

                .graphql-table-accent {
                    background: linear-gradient(90deg, #2563eb, #14b8a6, #f59e0b);
                    height: 4px;
                }

                .graphql-table-body {
                    background: #ffffff;
                }

                .graphql-table-search {
                    min-width: min(100%, 320px);
                }

                .graphql-table-wrap {
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    overflow: auto;
                    position: relative;
                }

                .graphql-table {
                    border-collapse: separate;
                    border-spacing: 0;
                }

                .graphql-table thead th {
                    background: #dddbf3;
                    border-bottom: 0.05px solid #c6d0f8;
                    color: #000000;
                    font-weight: 800;
                    padding: 12px 14px;
                    letter-spacing: 0;
                    position: sticky;
                    text-transform: uppercase;
                    top: 0;
                    z-index: 2;
                }

                .graphql-table tbody td {
                    border-bottom: 1px solid #eef2f7;
                    color: #1f2937;
                    padding: 13px 14px;
                    vertical-align: middle;
                }

                .graphql-table tbody tr {
                    transition: background-color 0.16s ease, box-shadow 0.16s ease;
                }

                .graphql-table tbody tr:hover {
                    background: #f8fbff;
                    box-shadow: inset 3px 0 0 #2563eb;
                }

                .graphql-table-footer {
                    background: #f8fafc;
                    border: 1px solid #eef2f7;
                    border-radius: 8px;
                    padding: 10px 12px;
                }

                @media (max-width: 576px) {
                    .graphql-table-search {
                        margin-left: 0 !important;
                        min-width: 100%;
                    }
                }

                /* ============================================
                   STATUS BAR
                   ============================================ */
                .status-bar {
                    border-radius: 6px;
                    margin-bottom: 12px;
                    padding: 8px 14px;
                }
                .status-bar--success {
                    background: #ecfdf5;
                    border: 1px solid #a7f3d0;
                }
                .status-bar--error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                }
                .status-bar--warning {
                    background: #fffbeb;
                    border: 1px solid #fde68a;
                }
                .status-bar--info {
                    background: #eff6ff;
                    border: 1px solid #bfdbfe;
                }
                .status-bar-message {
                    color: #374151;
                    font-size: 0.85rem;
                }

                /* ============================================
                   SKELETON LOADING
                   ============================================ */
                .skeleton-wrap {
                    padding: 8px 0;
                }

                .skeleton-row {
                    display: flex;
                    gap: 16px;
                    padding: 10px 0;
                    border-bottom: 1px solid #f3f4f6;
                    animation: skeleton-fadeIn 0.3s ease forwards;
                    opacity: 0;
                }

                .skeleton-row:last-child {
                    border-bottom: none;
                }

                .skeleton-cell {
                    flex: 1;
                    padding: 0 2px;
                }

                .skeleton-bar {
                    height: 14px;
                    border-radius: 6px;
                    background: linear-gradient(
                        90deg,
                        #e5e7eb 25%,
                        #f3f4f6 50%,
                        #e5e7eb 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.4s ease-in-out infinite;
                }

                @keyframes shimmer {
                    0% {
                        background-position: 200% 0;
                    }
                    100% {
                        background-position: -200% 0;
                    }
                }

                @keyframes skeleton-fadeIn {
                    to {
                        opacity: 1;
                    }
                }

                /* ============================================
                   ROW ENTER ANIMATION
                   ============================================ */
                .table-row-enter {
                    animation: rowSlideIn 0.35s ease forwards;
                    opacity: 0;
                    transform: translateY(8px);
                }

                @keyframes rowSlideIn {
                    0% {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    60% {
                        opacity: 1;
                        transform: translateY(-2px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* ============================================
                   FETCHING OVERLAY (inline dots)
                   ============================================ */
                .fetching-overlay-row {
                    background: transparent;
                }

                .fetching-overlay {
                    background: rgba(255, 255, 255, 0.85);
                    border-bottom: 1px solid #e5e7eb;
                }

                .fetching-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #696cff;
                    animation: fetchingBounce 0.6s ease-in-out infinite alternate;
                }

                @keyframes fetchingBounce {
                    0% {
                        opacity: 0.3;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1.2);
                    }
                }

                /* ============================================
                   FILTER FADE-IN
                   ============================================ */
                .fade-section-visible {
                    animation: sectionFade 0.3s ease both;
                }

                @keyframes sectionFade {
                    from {
                        opacity: 0;
                        transform: translateY(6px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

// ============================================================
// PROP TYPES
// ============================================================
GraphqlPaginatedTable.propTypes = {
    useQuery: PropTypes.func.isRequired,
    queryVariables: PropTypes.object,
    title: PropTypes.string,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            className: PropTypes.string,
            style: PropTypes.object,
            render: PropTypes.func,
        })
    ).isRequired,
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            onClick: PropTypes.func,
            className: PropTypes.string,
            icon: PropTypes.string,
            render: PropTypes.func,
            disabled: PropTypes.bool,
            tooltip: PropTypes.string,
        })
    ),
    onRowSelect: PropTypes.func,
    isRefresh: PropTypes.number,
    filters: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    filterGroups: PropTypes.arrayOf(
        PropTypes.shape({
            group: PropTypes.string,
            key: PropTypes.string,
            label: PropTypes.string.isRequired,
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                    label: PropTypes.string.isRequired,
                })
            ).isRequired,
            selected: PropTypes.arrayOf(PropTypes.string),
            placeholder: PropTypes.string,
        })
    ),
    initialPageSize: PropTypes.number,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
    hideTitle: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    responseExtractor: PropTypes.func,
    emptyMessage: PropTypes.string,
    loadingMessage: PropTypes.string,
    errorMessage: PropTypes.string,
    showSearch: PropTypes.bool,
    showPageSize: PropTypes.bool,
    showRecordCount: PropTypes.bool,
    statusBar: PropTypes.bool,
    skeletonRows: PropTypes.number,
    animKey: PropTypes.number,
};

export default GraphqlPaginatedTable;
