import React, { useState } from "react";
import BreadCumb from "../../../../layouts/BreadCumb";
import TheatreGraphqlPaginatedTable from "../../../../components/ui-templates/TheatreGraphqlPaginatedTable";
import { useGetInternalSourcesQuery } from "../../../../features/theatre/theatreGraphqlApi";
import InternalSourceModal from "./InternalSourceModal";

const InternalSourceView = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const openModal = (item = null) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    return (
        <>
            <BreadCumb pageList={["Theatre Performance Monitor", "Internal Sources"]} />
            <div className="card mb-4 shadow-sm animate__animated animate__fadeInDown animate__faster">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <h4 className="mb-1 fw-bold"><i className="bx bx-buildings me-2"></i>Internal Sources</h4>
                            <p className="text-secondary mb-0">Maintain internal departments or units contributing to theatre workflow.</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => openModal()}><i className="bx bx-plus me-2"></i>Add Source</button>
                    </div>
                </div>
            </div>

            <TheatreGraphqlPaginatedTable
                key="internal-sources"
                useQuery={useGetInternalSourcesQuery}
                title="Internal Source Entities"
                isRefresh={refreshKey}
                columns={[
                    { key: "SN", label: "SN", style: { width: "70px" }, className: "text-center" },
                    { key: "name", label: "Source Name", render: (row) => <span className="fw-semibold">{row.name}</span> },
                    { key: "code", label: "Code", render: (row) => <span className="badge bg-label-info">{row.code || "N/A"}</span> },
                    {
                        key: "actions",
                        label: "Actions",
                        className: "text-center",
                        render: (row) => (
                            <button className="btn btn-sm btn-outline-secondary border-0" onClick={() => openModal(row)}><i className="bx bx-edit"></i></button>
                        )
                    }
                ]}
            />

            {modalOpen && (
                <InternalSourceModal
                    item={selectedItem}
                    onSuccess={() => setRefreshKey(prev => prev + 1)}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    );
};
export default InternalSourceView;