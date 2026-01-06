import eApprovalMenu from "./eApprovalMenu.json";
import ictAssetsMenu from "./ictAssetsMenu.json";
import oxygenMenu from "./oxygeServiceMenu.json";
import defaultMenu from "./defaultMenu.json";
import analyticsMenu from "./analyticsMenu.json";
import maoniMenu from "./maoniMenu.json";
import externalReferralMenu from "./externalReferralMenu.json";
import renalDialysisMenu from "./renalDialysisMenu.json";
import chemotherapyMenu from "./chemotherapyMenu.json";
import orphanageMenu from "./orphanageMenu.json";

import trainingMenu from "./trainingMenu.json";

// Add new services here without touching Sidebar.js
const servicesConfig = [
    {
        id: "e-approval",
        name: "E-Approval",
        link: "/mnh-connect",
        menu: eApprovalMenu,
        permissions: "view_approval_module"

    },
    {
        id: "ict-assets",
        name: "ICT Assets",
        link: "/ict-assets",
        menu: ictAssetsMenu,
        permissions: "view_ict_asset_module"
    },
    {
        id: "oxygen-management",
        name: "Oxygen Management",
        link: "/oxygen-management",
        menu: oxygenMenu,
        permissions: "view_oxygen_management_module"
    },
    {
        id: "hospital-analytics",
        name: "Hospital Analytics",
        link: "/analytics",
        menu: analyticsMenu,
        permissions: "view_hospital_analytics_module"
    },
    {
        id: "mnh-maoni",
        name: "MNH Maoni",
        link: "/mnh-maoni",
        menu: maoniMenu,
        permissions: "view_mnh_maoni_module"
    },
    {
        id: "external-referral",
        name: "External Referral",
        link: "/external-referral",
        menu: externalReferralMenu,
        permissions: "view_external_referral_module"
    },
    {
        id: "training",
        name: "Training Management",
        link: "/training",
        menu: trainingMenu,
        permissions: "view_training_module"
    },
    {
        id: "renal-dialysis",
        name: "Renal Dialysis",
        link: "/renal-dialysis",
        menu: renalDialysisMenu,
        // permissions: "view_renal_dialysis_service"
        permissions: "view_approval_module"
    },
    {
        id: "chemotherapy",
        name: "Chemotherapy",
        link: "/chemotherapy",
        menu: chemotherapyMenu,
        // permissions: "view_chemotherapy_service"
        permissions: "view_approval_module"
    },
    {
        id: "orphanage-management",
        name: "Orphanage Management",
        link: "/orphanage",
        menu: [],
        permissions: "view_orphanage_management_module"
    },
    {
        id: "default-menu",
        name: "MNH Connect",
        link: "/default",
        menu: defaultMenu,
        permissions: null
    }
];

export default servicesConfig;
