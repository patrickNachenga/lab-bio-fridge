import React from "react";
import ContentLoader from "react-content-loader";

const AnnouncementsBoardShimmer = () => (
  <div className="card animate__animated animate__fadeInUp animate__faster">
    <div className="card-body">
      <ContentLoader
        speed={1.2}
        width="100%"
        height={640}
        backgroundColor="#f3f3f3"
        foregroundColor="#e0e0e0"
        style={{ width: "100%" }}
      >
        {/* Header */}
        <rect x="2%" y="20" rx="8" ry="8" width="50%" height="28" />
        <rect x="2%" y="60" rx="6" ry="6" width="65%" height="18" />
        {/* Filters */}
        <rect x="2%" y="100" rx="10" ry="10" width="96%" height="70" />
        {/* Section title */}
        <rect x="2%" y="190" rx="6" ry="6" width="25%" height="20" />
        <rect x="78%" y="190" rx="6" ry="6" width="18%" height="20" />

        {/* Cards row */}
        <rect x="2%" y="220" rx="14" ry="14" width="47%" height="140" />
        <rect x="51%" y="220" rx="14" ry="14" width="47%" height="140" />

        {/* Section title */}
        <rect x="2%" y="380" rx="6" ry="6" width="28%" height="20" />
        <rect x="78%" y="380" rx="6" ry="6" width="18%" height="20" />

        {/* Cards row */}
        <rect x="2%" y="410" rx="14" ry="14" width="30%" height="160" />
        <rect x="35%" y="410" rx="14" ry="14" width="30%" height="160" />
        <rect x="68%" y="410" rx="14" ry="14" width="30%" height="160" />
      </ContentLoader>
    </div>
  </div>
);

export default AnnouncementsBoardShimmer;
