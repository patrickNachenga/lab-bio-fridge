import defaultMenu from "./defaultMenu.json";
import orphanageMenu from "./orphanageMenu.json";


// Add new services here without touching Sidebar.js
const servicesConfig = [
    {
        id: "orphanage-management",
        name: "Orphanage Management",
        link: "/orphanage",
        menu: "orphanageMenu",
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
