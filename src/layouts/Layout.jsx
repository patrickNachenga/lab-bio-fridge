import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({
  children,
  isService = false,
  activeService = null,
}) => {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem("bioRepoSidebarCollapsed");
    return window.matchMedia("(max-width: 768px)").matches || savedState === "true";
  });


  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleViewportChange = (event) => {
      if (event.matches) setSidebarCollapsed(true);
    };
    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);


  const toggleSidebar = () => {

    setSidebarCollapsed((previous) => {

      const next = !previous;

      localStorage.setItem("bioRepoSidebarCollapsed", String(next));

      return next;

    });

  };


  return (
    <div
      className={`
                bio-app-layout
                ${sidebarCollapsed
          ? "bio-sidebar-is-collapsed"
          : ""
        }
            `}
    >

      {/* ==================================================
                SIDEBAR
            ================================================== */}

      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />


      {/* ==================================================
                MAIN APPLICATION
            ================================================== */}

      <div className="bio-main-area">

        <Navbar
          isService={isService}
          activeService={activeService}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />


        <main className="bio-content-area">

          <div className="bio-content-container">

              {children}

            </div>

            <Footer />

        </main>

      </div>

    </div>
  );
};

export default Layout;
