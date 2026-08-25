import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import menuData from "../data/orphanageMenu.json";
import { useSelector } from "react-redux";
import "../css/Sidebar.css";

const Sidebar = () => {
    const user = useSelector((state) => state.userReducer?.data);

    const userPermissions = user?.user_permissions;
    const userRoles = user?.groups;

    const [collapsed, setCollapsed] = useState(false);

    const hasPermission = (
        itemPermissions,
        itemRoles,
        userPermissions,
        userRoles
    ) => {
        const hasRequiredPermission =
            !itemPermissions ||
            itemPermissions.some((permission) =>
                userPermissions?.includes(permission)
            );

        const hasRequiredRole =
            !itemRoles ||
            itemRoles.some((role) =>
                userRoles?.includes(role)
            );

        return hasRequiredPermission || hasRequiredRole;
    };

    /* Remember sidebar state */
    useEffect(() => {
        const savedState = localStorage.getItem(
            "bioRepoSidebarCollapsed"
        );

        if (savedState !== null) {
            setCollapsed(savedState === "true");
        }
    }, []);

    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent("bio-sidebar-state", {
                detail: { collapsed },
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
        <aside
            id="layout-menu"
            className={`layout-menu menu-vertical bio-sidebar ${collapsed ? "bio-sidebar-collapsed" : ""
                }`}
        >

            {/* =====================================================
                BACKGROUND IMAGE
            ===================================================== */}

            <div className="bio-sidebar-background"></div>


            {/* =====================================================
                BLUE / GOLD LIGHT EFFECT
            ===================================================== */}

            <div className="bio-sidebar-glow"></div>


            {/* =====================================================
                BRAND
            ===================================================== */}

            <div className="app-brand demo bio-sidebar-brand">

                <Link
                    aria-label="Navigate to Bio-Repo homepage"
                    to="/"
                    className="app-brand-link bio-brand-link"
                >

                    <span className="app-brand-logo demo bio-brand-logo">

                        <img
                            src="/assets/img/mnhlogo.png"
                            alt="MNH logo"
                            aria-label="MNH logo"
                        />

                    </span>


                    <div className="bio-brand-content">

                        <div className="bio-brand-title">
                            BIO-REPO
                        </div>

                        <div className="bio-brand-subtitle">
                            Sample Repository
                        </div>

                    </div>

                </Link>


                {/* =================================================
                    COLLAPSE BUTTON
                ================================================= */}

                <button
                    type="button"
                    className="bio-sidebar-toggle"
                    onClick={toggleSidebar}
                    aria-label={
                        collapsed
                            ? "Expand sidebar"
                            : "Minimize sidebar"
                    }
                >

                    <i
                        className={
                            collapsed
                                ? "bx bx-chevron-right"
                                : "bx bx-chevron-left"
                        }
                    ></i>

                </button>

            </div>


            {/* =====================================================
                INNER SHADOW
            ===================================================== */}

            <div className="menu-inner-shadow bio-menu-shadow"></div>


            {/* =====================================================
                MENU
            ===================================================== */}

            <ul className="menu-inner bio-menu-inner">

                {menuData.map((section, sectionIndex) => {

                    const visibleItems = section.items.filter(
                        (item) =>
                            hasPermission(
                                item.permission,
                                item.role,
                                userPermissions,
                                userRoles
                            )
                    );

                    if (!visibleItems.length) {
                        return null;
                    }

                    return (
                        <React.Fragment
                            key={`section-${sectionIndex}`}
                        >

                            {section.header && (
                                <li className="menu-header bio-menu-header">

                                    <span className="menu-header-text">
                                        {section.header}
                                    </span>

                                </li>
                            )}


                            {visibleItems.map(
                                (item, itemIndex) => (
                                    <MenuItem
                                        key={
                                            item.id ||
                                            `${sectionIndex}-${itemIndex}`
                                        }
                                        {...item}
                                        collapsed={collapsed}
                                        userPermissions={
                                            userPermissions
                                        }
                                        userRoles={userRoles}
                                    />
                                )
                            )}

                        </React.Fragment>
                    );
                })}

            </ul>


            {/* =====================================================
                SIDEBAR FOOTER
            ===================================================== */}

            <div className="bio-sidebar-footer">

                <div className="bio-footer-status">

                    <span className="bio-status-dot"></span>

                    <span className="bio-footer-text">
                        System Online
                    </span>

                </div>

            </div>

        </aside>
    );
};


/* ================================================================
   MENU ITEM
================================================================ */


const MenuItem = ({
    collapsed,
    userPermissions,
    userRoles,
    ...item
}) => {

    const location = useLocation();

    const [hovered, setHovered] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState(false);

    const itemRef = useRef(null);
    const hoverTimerRef = useRef(null);

    const showHoverPanel = () => {
        clearTimeout(hoverTimerRef.current);
        setHovered(true);
    };

    const hideHoverPanel = () => {
        hoverTimerRef.current = setTimeout(() => {
            setHovered(false);
        }, 120);
    };

    const isActive =
        location.pathname === item.link ||
        location.pathname.startsWith(
            item.link + "/open/"
        );

    const hasSubmenu =
        item.submenu &&
        item.submenu.length > 0;

    const isSubmenuActive =
        hasSubmenu &&
        item.submenu.some(
            (subitem) =>
                location.pathname === subitem.link
        );

    useEffect(() => {
        if (isSubmenuActive) {
            setSubmenuOpen(true);
        }
    }, [isSubmenuActive]);


    const hasPermission = (
        itemPermissions,
        itemRoles
    ) => {

        const hasRequiredPermission =
            !itemPermissions ||
            itemPermissions.some(
                (permission) =>
                    userPermissions?.includes(permission)
            );

        const hasRequiredRole =
            !itemRoles ||
            itemRoles.some(
                (role) =>
                    userRoles?.includes(role)
            );

        return (
            hasRequiredPermission ||
            hasRequiredRole
        );
    };


    const visibleSubmenu =
        hasSubmenu
            ? item.submenu.filter((subitem) =>
                hasPermission(
                    subitem.permission,
                    subitem.role
                )
            )
            : [];


    return (
        <li
            ref={itemRef}
            className={`
                menu-item
                bio-menu-item
                ${isActive || isSubmenuActive
                    ? "active"
                    : ""}
                ${hasSubmenu &&
                submenuOpen
                    ? "open"
                    : ""
                }
                ${collapsed
                    ? "bio-collapsed-item"
                    : ""
                }
                ${hovered
                    ? "bio-item-hovered"
                    : ""
                }
            `}
            onMouseEnter={showHoverPanel}
            onMouseLeave={hideHoverPanel}
        >

            {hasSubmenu ? (
                <button
                    type="button"
                    aria-expanded={submenuOpen}
                    aria-label={`${submenuOpen ? "Collapse" : "Expand"} ${item.text}`}
                    className={`
                        menu-link
                        bio-menu-link
                        menu-toggle
                    `}
                    onClick={() => setSubmenuOpen((previous) => !previous)}
                >

                    <span className="bio-menu-icon-wrapper">

                        <i
                            className={`
                                menu-icon
                                tf-icons
                                ${item.icon}
                            `}
                        ></i>

                    </span>

                    <div className="bio-menu-label">
                        {item.text}
                    </div>

                    {item.available === false && (
                        <div className="badge bio-pro-badge">
                            Pro
                        </div>
                    )}

                </button>
            ) : (
            <NavLink
                aria-label={`Navigate to ${item.text}${!item.available
                    ? " Pro"
                    : ""
                    }`}
                to={item.link}
                className={`
                    menu-link
                    bio-menu-link
                    ${hasSubmenu
                        ? "menu-toggle"
                        : ""
                    }
                `}
                target={
                    item.link?.includes("http")
                        ? "_blank"
                        : undefined
                }
            >

                {/* ICON */}

                <span className="bio-menu-icon-wrapper">

                    <i
                        className={`
                            menu-icon
                            tf-icons
                            ${item.icon}
                        `}
                    ></i>

                </span>


                {/* LABEL */}

                <div className="bio-menu-label">
                    {item.text}
                </div>


                {/* PRO */}

                {item.available === false && (
                    <div className="badge bio-pro-badge">
                        Pro
                    </div>
                )}

            </NavLink>
            )}


            {/* =================================================
                NORMAL EXPANDED SUBMENU
            ================================================= */}

            {!collapsed && hasSubmenu && submenuOpen && (
                <ul className="menu-sub bio-menu-sub">

                    {visibleSubmenu.map(
                        (subitem, index) => (
                            <MenuItem
                                key={
                                    subitem.id ||
                                    `${item.id}-${index}`
                                }
                                {...subitem}
                                collapsed={false}
                                userPermissions={
                                    userPermissions
                                }
                                userRoles={
                                    userRoles
                                }
                            />
                        )
                    )}

                </ul>
            )}


            {/* =================================================
                COLLAPSED FLOATING MENU
            ================================================= */}

            {collapsed &&
                hovered &&
                (hasSubmenu ||
                    item.text) && (

                    <div
                        className="
                            bio-floating-menu
                        "
                    style={{
                        top: itemRef.current?.getBoundingClientRect().top ?? 0,
                    }}
                    onMouseEnter={showHoverPanel}
                    onMouseLeave={hideHoverPanel}
                    >

                        <div className="bio-floating-title">

                            <span className="bio-floating-icon">

                                <i
                                    className={`
                                        tf-icons
                                        ${item.icon}
                                    `}
                                ></i>

                            </span>

                            <span>
                                {item.text}
                            </span>

                        </div>


                        {hasSubmenu &&
                            visibleSubmenu.length >
                            0 && (

                                <div className="bio-floating-submenu">

                                    {visibleSubmenu.map(
                                        (
                                            subitem,
                                            index
                                        ) => (

                                            <Link
                                                key={
                                                    subitem.id ||
                                                    index
                                                }
                                                to={
                                                    subitem.link
                                                }
                                                className={
                                                    location.pathname ===
                                                        subitem.link
                                                        ? "active"
                                                        : ""
                                                }
                                            >

                                                <i
                                                    className={`
                                                        tf-icons
                                                        ${subitem.icon}
                                                    `}
                                                ></i>

                                                <span>
                                                    {
                                                        subitem.text
                                                    }
                                                </span>

                                            </Link>
                                        )
                                    )}

                                </div>
                            )}

                    </div>
                )}

        </li>
    );
};


export default Sidebar;