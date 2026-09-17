import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Below this width the sidebar is a floating overlay (hidden until
// toggled) instead of an always-visible rail that pushes the content.
const OVERLAY_BREAKPOINT = "(max-width: 1199.98px)";

const Layout = ({
  children,
  isService = false,
  activeService = null,
}) => {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem("bioRepoSidebarCollapsed");
    return window.matchMedia(OVERLAY_BREAKPOINT).matches || savedState === "true";
  });

  const [isOverlayViewport, setIsOverlayViewport] = useState(
    () => window.matchMedia(OVERLAY_BREAKPOINT).matches
  );


  useEffect(() => {
    const mediaQuery = window.matchMedia(OVERLAY_BREAKPOINT);
    const handleViewportChange = (event) => {
      setIsOverlayViewport(event.matches);
      if (event.matches) setSidebarCollapsed(true);
    };
    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);


  // Lock page scroll while the sidebar floats over the content on
  // phone/tablet so the page behind it doesn't scroll along with it.
  useEffect(() => {
    if (isOverlayViewport && !sidebarCollapsed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOverlayViewport, sidebarCollapsed]);


  const toggleSidebar = () => {

    setSidebarCollapsed((previous) => {

      const next = !previous;

      localStorage.setItem("bioRepoSidebarCollapsed", String(next));

      return next;

    });

  };


  // Used after navigating to a page via the floating sidebar — closes
  // the overlay without touching the user's saved desktop preference.
  const closeOverlaySidebar = () => {
    if (window.matchMedia(OVERLAY_BREAKPOINT).matches) {
      setSidebarCollapsed(true);
    }
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
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onNavigate={closeOverlaySidebar}
      />


      {/* ==================================================
                BACKDROP (phone/tablet floating sidebar only)
            ================================================== */}

      {isOverlayViewport && !sidebarCollapsed && (
        <div
          className="bio-sidebar-backdrop"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}


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
