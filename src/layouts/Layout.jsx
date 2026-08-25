import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({
  children,
  isService = false,
  activeService = null,
}) => {

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(() => {
      return (
        localStorage.getItem(
          "bioRepoSidebarCollapsed"
        ) === "true"
      );
    });


  useEffect(() => {

    const handleSidebarState = (event) => {

      setSidebarCollapsed(
        event.detail?.collapsed ?? false
      );
    };


    window.addEventListener(
      "bio-sidebar-state",
      handleSidebarState
    );


    return () => {

      window.removeEventListener(
        "bio-sidebar-state",
        handleSidebarState
      );

    };

  }, []);

  const [collapsed, setCollapsed] = useState(() => {
    return (
      localStorage.getItem(
        "bioRepoSidebarCollapsed"
      ) === "true"
    );
  });


  useEffect(() => {

    window.dispatchEvent(
      new CustomEvent("bio-sidebar-state", {
        detail: {
          collapsed,
        },
      })
    );

  }, [collapsed]);


  const toggleSidebar = () => {

    setCollapsed((previous) => {

      const next = !previous;

      localStorage.setItem(
        "bioRepoSidebarCollapsed",
        next
      );

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

      <Sidebar
        isService={isService}
        activeService={activeService}
      />


      {/* ==================================================
                MAIN APPLICATION
            ================================================== */}

      <div className="bio-main-area">

        <Navbar
          isService={isService}
          activeService={activeService}
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