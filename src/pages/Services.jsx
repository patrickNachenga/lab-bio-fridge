import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import servicesList from "../data/servicesList.json";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Grid,
    List,
    X,
    Filter,
    ChevronRight,
    Sparkles,
} from "lucide-react";

export const Services = () => {
    const user = useSelector((state) => state.userReducer?.data);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filteredServices, setFilteredServices] = useState(servicesList);
    const [activeCategory, setActiveCategory] = useState("all");
    const [isGridView, setIsGridView] = useState(true);
    const [hoveredCard, setHoveredCard] = useState(null);
    const searchRef = useRef(null);

    const categories = [
        "all",
        // ...new Set(
        //   servicesList.map((s) => s.category || "general").filter(Boolean)
        // ),
    ];

    useEffect(() => {
        const filtered = servicesList.filter((service) => {
            const matchesSearch =
                service.text.toLowerCase().includes(search.toLowerCase()) ||
                (service.description &&
                    service.description.toLowerCase().includes(search.toLowerCase()));

            const matchesCategory =
                activeCategory === "all" || service.category === activeCategory;

            return matchesSearch && matchesCategory;
        });
        setFilteredServices(filtered);
    }, [search, activeCategory]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 15,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 15,
            },
        },
    };

    const handleServiceClick = async (service) => {
        const target =
            service.link ||
            service.path ||
            service.route ||
            `/dashboard/${encodeURIComponent(
                (service.text || "").toLowerCase().trim().replace(/\s+/g, "-")
            )}`;

        if (/^https?:\/\//i.test(target)) {
            window.open(target, "_blank");
            return;
        }

        try {
            const response = await fetch(target, { method: "HEAD" });
            if (response.ok) {
                navigate(target);
            }
        } catch (error) {
            // Silent fail for now
        }
    };

    return (
        <>
            <style>
                {`
          .services-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #0a1428 0%, #1a3a52 50%, #0f2744 100%);
            padding: 24px 20px;
            background-color: #0a1428;
          }

          .main-content {
            max-width: 1400px;
            margin: 0 auto;
          }

          .hero-section {
            text-align: center;
            margin-bottom: 28px;
            position: relative;
            padding: 24px 20px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            border: 1px solid rgba(77, 184, 255, 0.1);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          }

          .title-wrapper {
            display: inline-block;
            position: relative;
            margin-bottom: 12px;
          }

          .main-title {
            font-size: 2rem;
            font-weight: 800;
            color: white;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            letter-spacing: -0.3px;
            position: relative;
            padding: 0 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            justify-content: center;
            margin: 0;
            line-height: 1.2;
          }

          .title-sparkle {
            color: #4db8ff;
            filter: drop-shadow(0 0 8px rgba(77, 184, 255, 0.6));
            animation: pulse-glow 2.5s ease-in-out infinite;
            font-size: 1.8rem;
          }

          @keyframes pulse-glow {
            0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 8px rgba(77, 184, 255, 0.6)); }
            50% { opacity: 1; filter: drop-shadow(0 0 16px rgba(77, 184, 255, 0.9)); }
          }

          .title-border {
            position: absolute;
            top: -1px;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, 
              transparent, 
              #4db8ff, 
              #00d4ff, 
              #4db8ff, 
              transparent
            );
            border-radius: 1px;
          }

          .subtitle {
            color: rgba(255, 255, 255, 0.85);
            font-size: 0.95rem;
            font-weight: 400;
            max-width: 700px;
            margin: 12px auto 0;
            line-height: 1.5;
            text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
            letter-spacing: 0.2px;
          }

          .controls-container {
            max-width: 1100px; 
            margin: 0 auto 24px;
            padding: 18px;
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(12px);
            border-radius: 14px;
            border: 1px solid rgba(77, 184, 255, 0.12);
            box-shadow: 
              0 8px 20px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
          }

          .search-container {
            position: relative;
            margin-bottom: 14px;
          }

          .search-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
          }

          .search-input {
            flex: 1;
            padding: 11px 16px 11px 40px;
            background: rgba(255, 255, 255, 0.05);
            border: 1.5px solid rgba(255, 255, 255, 0.15);
            border-radius: 10px;
            color: white;
            font-size: 13px;
            outline: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 500;
            letter-spacing: 0.2px;
          }

          .search-input:focus {
            border-color: rgba(77, 184, 255, 0.7);
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 
              0 0 0 3px rgba(77, 184, 255, 0.1),
              0 6px 20px rgba(77, 184, 255, 0.15);
          }

          .search-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }

          .search-icon {
            position: absolute;
            left: 14px;
            color: rgba(77, 184, 255, 0.7);
            z-index: 2;
            width: 16px;
            height: 16px;
          }

          .clear-btn {
            position: absolute;
            right: 14px;
            background: rgba(255, 255, 255, 0.08);
            border: none;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 30px;
            min-height: 30px;
          }

          .clear-btn:hover {
            background: rgba(77, 184, 255, 0.2);
            color: #4db8ff;
            transform: rotate(90deg);
          }

          .filter-section {
            display: flex;
            gap: 12px;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
          }

          .categories-scroll {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding: 2px 0;
            flex: 1;
            min-width: 0;
          }

          .category-btn {
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            color: rgba(255, 255, 255, 0.8);
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            white-space: nowrap;
            min-height: 34px;
            display: flex;
            align-items: center;
            gap: 5px;
          }

          .category-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(77, 184, 255, 0.4);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(77, 184, 255, 0.1);
          }

          .category-btn.active {
            background: linear-gradient(135deg, #4db8ff, #00d4ff);
            border-color: rgba(77, 184, 255, 0.6);
            color: white;
            box-shadow: 0 6px 18px rgba(77, 184, 255, 0.25);
            font-weight: 700;
          }

          .view-toggle {
            display: flex;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 3px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            gap: 3px;
          }

          .view-btn {
            padding: 8px 14px;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            min-height: 32px;
            justify-content: center;
          }

          .view-btn:hover {
            background: rgba(255, 255, 255, 0.08);
            color: rgba(77, 184, 255, 0.85);
          }

          .view-btn.active {
            background: rgba(77, 184, 255, 0.15);
            color: #4db8ff;
            border: 1px solid rgba(77, 184, 255, 0.3);
            box-shadow: 0 3px 10px rgba(77, 184, 255, 0.15);
          }

          .results-info {
            text-align: center;
            color: rgba(255, 255, 255, 0.9);
            font-size: 13px;
            font-weight: 500;
            margin: 18px auto;
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            border: 1px solid rgba(77, 184, 255, 0.12);
            max-width: 500px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            letter-spacing: 0.2px;
          }

          .results-info strong {
            color: #4db8ff;
            font-weight: 700;
          }

          /* Compact Grid Container */
          .services-grid-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 10px;
          }

          .compact-grid {
            display: grid;
            gap: 12px;
          }

          .grid-view {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }

          .list-view {
            grid-template-columns: 1fr;
            max-width: 900px;
            margin: 0 auto;
          }

          /* Small Grid Box Styling */
          .compact-service-card {
            background: rgba(255, 255, 255, 0.06) !important;
            border: 1.5px solid rgba(77, 184, 255, 0.15);
            border-radius: 12px;
            padding: 16px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 
              0 6px 18px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            gap: 12px;
            min-height: 80px;
            backdrop-filter: blur(8px);
          }

          .compact-service-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(77, 184, 255, 0.08) 0%, transparent 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }

          .compact-service-card:hover {
            background: rgba(77, 184, 255, 0.1) !important;
            border-color: rgba(77, 184, 255, 0.35) !important;
            transform: translateY(-4px) scale(1.01);
            box-shadow: 
              0 10px 30px rgba(77, 184, 255, 0.15),
              0 0 20px rgba(77, 184, 255, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }

          .compact-service-card:hover::before {
            opacity: 1;
          }

          /* Bending Icon Effect */
          .compact-icon-container {
            flex-shrink: 0;
            width: 48px;
            height: 48px;
            border-radius: 10px;
            background: rgba(77, 184, 255, 0.12);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1.5px solid rgba(77, 184, 255, 0.25);
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            position: relative;
            overflow: hidden;
          }

          /* Bending effect on hover */
          .compact-service-card:hover .compact-icon-container {
            background: rgba(77, 184, 255, 0.2);
            border-color: rgba(77, 184, 255, 0.5);
            transform: 
              translateY(-2px) 
              rotate(6deg) 
              scale(1.1);
            box-shadow: 
              0 6px 16px rgba(77, 184, 255, 0.25),
              inset 0 0 10px rgba(255, 255, 255, 0.1);
          }

          /* Icon shimmer effect */
          .compact-service-card:hover .compact-icon-container::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
              45deg,
              transparent,
              rgba(255, 255, 255, 0.12),
              transparent
            );
            transform: rotate(45deg);
            animation: iconShimmer 2s infinite;
          }

          @keyframes iconShimmer {
            0% {
              transform: translateX(-100%) translateY(-100%) rotate(45deg);
            }
            100% {
              transform: translateX(100%) translateY(100%) rotate(45deg);
            }
          }

          .compact-icon {
            font-size: 22px;
            color: #4db8ff;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            position: relative;
            z-index: 1;
          }

          .compact-service-card:hover .compact-icon {
            color: #00d4ff;
            text-shadow: 0 0 12px rgba(77, 184, 255, 0.4);
            transform: scale(1.12);
          }

          .compact-card-content {
            flex: 1;
            min-width: 0;
            position: relative;
            z-index: 1;
          }

          .compact-card-title {
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 4px;
            color: rgba(255, 255, 255, 0.95);
            transition: all 0.3s ease;
            line-height: 1.3;
            letter-spacing: 0.1px;
          }

          .compact-service-card:hover .compact-card-title {
            color: #4db8ff;
          }

          .compact-card-description {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.65);
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            transition: color 0.3s ease;
          }

          .compact-service-card:hover .compact-card-description {
            color: rgba(255, 255, 255, 0.8) !important;
          }

          .compact-card-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #00d4ff, #4db8ff);
            color: #001a33;
            font-size: 9px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 16px;
            box-shadow: 0 3px 12px rgba(77, 184, 255, 0.3);
            letter-spacing: 0.4px;
            z-index: 2;
          }

          .compact-card-arrow {
            opacity: 0;
            color: rgba(77, 184, 255, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            flex-shrink: 0;
            width: 18px;
            height: 18px;
            position: relative;
            z-index: 1;
          }

          .compact-service-card:hover .compact-card-arrow {
            opacity: 1;
            transform: translateX(4px);
            color: #4db8ff;
          }

          /* List View Specific */
          .list-view .compact-service-card {
            padding: 14px;
            gap: 14px;
            min-height: 75px;
          }

          .list-view .compact-icon-container {
            width: 44px;
            height: 44px;
          }

          .list-view .compact-icon {
            font-size: 20px;
          }

          .list-view .compact-card-title {
            font-size: 14px;
          }

          .list-view .compact-card-description {
            font-size: 12px;
            -webkit-line-clamp: 1;
          }

          /* Empty State */
          .empty-state {
            text-align: center;
            padding: 50px 25px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            border-radius: 16px;
            border: 1px solid rgba(77, 184, 255, 0.12);
            max-width: 550px;
            margin: 28px auto;
            box-shadow: 
              0 12px 36px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
          }

          .empty-icon {
            font-size: 60px;
            margin-bottom: 18px;
            color: #4db8ff;
            filter: drop-shadow(0 0 16px rgba(77, 184, 255, 0.3));
            opacity: 0.9;
          }

          .empty-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 10px;
            color: rgba(255, 255, 255, 0.95);
            text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
          }

          .empty-message {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.75);
            margin-bottom: 22px;
            line-height: 1.5;
            max-width: 450px;
            margin-left: auto;
            margin-right: auto;
            letter-spacing: 0.2px;
          }

          .reset-btn {
            background: linear-gradient(135deg, #4db8ff, #00d4ff);
            color: #001a33;
            border: none;
            padding: 11px 32px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 8px 24px rgba(77, 184, 255, 0.25);
            min-height: 42px;
            letter-spacing: 0.2px;
          }

          .reset-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 45px rgba(77, 184, 255, 0.4);
            background: linear-gradient(135deg, #00d4ff, #4db8ff);
          }

          /* Responsive */
          @media (max-width: 1200px) {
            .grid-view {
              grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            }
          }

          @media (max-width: 768px) {
            .services-container {
              padding: 25px 15px;
            }

            .main-content {
              max-width: 100%;
            }

            .hero-section {
              margin-bottom: 35px;
              padding: 45px 20px 35px;
              border-radius: 24px;
            }

            .title-sparkle {
              width: 20px;
              height: 20px;
            }

            .main-title {
              font-size: 2.4rem;
              flex-direction: column;
              gap: 12px;
              padding: 0 15px;
            }

            .subtitle {
              font-size: 1rem;
              padding: 12px 15px;
              margin: 15px auto 0;
            }

            .controls-container {
              padding: 22px;
              margin: 0 auto 30px;
              border-radius: 20px;
            }

            .filter-section {
              flex-direction: column;
              gap: 15px;
            }

            .categories-scroll {
              width: 100%;
              justify-content: flex-start;
            }

            .view-toggle {
              width: 100%;
              justify-content: center;
            }

            .grid-view {
              grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
              gap: 14px;
            }

            .compact-service-card {
              padding: 16px;
              gap: 12px;
              min-height: 82px;
              border-radius: 16px;
            }

            .compact-icon-container {
              width: 48px;
              height: 48px;
              border-radius: 12px;
            }

            .compact-icon {
              font-size: 22px;
            }

            .compact-card-title {
              font-size: 14px;
              margin-bottom: 4px;
            }

            .compact-card-description {
              font-size: 12px;
            }

            .results-info {
              margin: 25px auto;
              padding: 14px 20px;
              font-size: 13px;
            }

            .empty-state {
              padding: 50px 20px;
              margin: 30px auto;
              border-radius: 20px;
            }

            .empty-icon {
              font-size: 64px;
              margin-bottom: 20px;
            }

            .empty-title {
              font-size: 22px;
              margin-bottom: 12px;
            }

            .empty-message {
              font-size: 14px;
              margin-bottom: 25px;
            }

            .reset-btn {
              padding: 12px 32px;
              font-size: 14px;
              min-height: 44px;
            }
          }

          @media (max-width: 480px) {
            .services-container {
              padding: 20px 12px;
            }

            .hero-section {
              margin-bottom: 30px;
              padding: 35px 15px 30px;
            }

            .title-sparkle {
              width: 18px;
              height: 18px;
            }

            .main-title {
              font-size: 2rem;
              padding: 0 10px;
              gap: 10px;
            }

            .grid-view {
              grid-template-columns: 1fr;
              gap: 12px;
            }

            .compact-service-card {
              padding: 14px;
              min-height: 78px;
              gap: 12px;
            }

            .compact-icon-container {
              width: 44px;
              height: 44px;
            }

            .compact-icon {
              font-size: 20px;
            }

            .compact-card-title {
              font-size: 14px;
            }

            .compact-card-description {
              font-size: 11px;
            }

            .search-input {
              padding: 14px 18px 14px 45px;
              font-size: 14px;
              border-radius: 14px;
            }

            .search-icon {
              left: 15px;
              font-size: 18px;
            }

            .clear-btn {
              right: 15px;
              width: 34px;
              height: 34px;
            }

            .reset-btn {
              padding: 12px 28px;
              font-size: 14px;
              min-height: 44px;
            }

            .category-btn {
              padding: 10px 16px;
              font-size: 12px;
              min-height: 38px;
            }

            .view-btn {
              padding: 10px 16px;
              font-size: 12px;
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .compact-service-card {
            animation: fadeInUp 0.4s ease-out forwards;
            opacity: 0;
          }

          .compact-service-card:nth-child(1) { animation-delay: 0.1s; }
          .compact-service-card:nth-child(2) { animation-delay: 0.15s; }
          .compact-service-card:nth-child(3) { animation-delay: 0.2s; }
          .compact-service-card:nth-child(4) { animation-delay: 0.25s; }
          .compact-service-card:nth-child(5) { animation-delay: 0.3s; }
          .compact-service-card:nth-child(6) { animation-delay: 0.35s; }
          .compact-service-card:nth-child(7) { animation-delay: 0.4s; }
          .compact-service-card:nth-child(8) { animation-delay: 0.45s; }
          .compact-service-card:nth-child(9) { animation-delay: 0.5s; }
          .compact-service-card:nth-child(10) { animation-delay: 0.55s; }
        `}
            </style>

            <div className="services-container">
                <div className="main-content">
                    {/* Hero Section */}
                    <div className="hero-section">
                        <div className="title-wrapper">
                            <div className="title-border"></div>
                            <h2 className="main-title">
                                <Sparkles className="title-sparkle" size={28} />
                                ORPHANAGE MANAGEMENT SYSTEM
                                <Sparkles className="title-sparkle" size={28} />
                            </h2>
                        </div>

                        <p className="subtitle">
                            A comprehensive system for managing orphanage facilities, children, staff, and healthcare records.
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="controls-container">
                        <div className="search-container">
                            <div className="search-input-wrapper">
                                <Search className="search-icon" size={20} />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    className="search-input"
                                    placeholder="Search orphanage services ..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button className="clear-btn" onClick={() => setSearch("")}>
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="filter-section">
                            <div className="categories-scroll">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        className={`category-btn ${activeCategory === category ? "active" : ""
                                            }`}
                                        onClick={() => setActiveCategory(category)}
                                    >
                                        {category === "all" ? "All Services" : category}
                                    </button>
                                ))}
                            </div>

                            <div className="view-toggle">
                                <button
                                    className={`view-btn ${isGridView ? "active" : ""}`}
                                    onClick={() => setIsGridView(true)}
                                >
                                    <Grid size={16} />
                                    Grid
                                </button>
                                <button
                                    className={`view-btn ${!isGridView ? "active" : ""}`}
                                    onClick={() => setIsGridView(false)}
                                >
                                    <List size={16} />
                                    List
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Info */}
                    <div className="results-info">
                        Showing <strong>{filteredServices.length}</strong> of{" "}
                        <strong>{servicesList.length}</strong> services
                        {search && ` • Search: "${search}"`}
                    </div>

                    {/* Compact Services Grid */}
                    <AnimatePresence>
                        {filteredServices.length > 0 ? (
                            <motion.div
                                key={isGridView ? "grid" : "list"}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="services-grid-container"
                            >
                                <div
                                    className={`compact-grid ${isGridView ? "grid-view" : "list-view"
                                        }`}
                                >
                                    {filteredServices.map((service, idx) => (
                                        <motion.div
                                            key={service.id || idx}
                                            variants={cardVariants}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div
                                                className="compact-service-card"
                                                onClick={() => handleServiceClick(service)}
                                                onMouseEnter={() => setHoveredCard(idx)}
                                                onMouseLeave={() => setHoveredCard(null)}
                                            >
                                                {service.isNew && (
                                                    <div className="compact-card-badge">NEW</div>
                                                )}

                                                <div className="compact-icon-container">
                                                    <i className={`${service.icon} compact-icon`}></i>
                                                </div>

                                                <div className="compact-card-content">
                                                    <div className="compact-card-title">
                                                        {service.text}
                                                    </div>
                                                    {service.description && (
                                                        <div className="compact-card-description">
                                                            {service.description}
                                                        </div>
                                                    )}
                                                </div>

                                                <ChevronRight
                                                    className="compact-card-arrow"
                                                    size={18}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="empty-state"
                            >
                                <Search className="empty-icon" size={70} />
                                <h3 className="empty-title">No Services Found</h3>
                                <p className="empty-message">
                                    {search
                                        ? `No services match "${search}"`
                                        : "No services available"}
                                    {activeCategory !== "all" &&
                                        ` in the ${activeCategory} category`}
                                </p>
                                <button
                                    className="reset-btn"
                                    onClick={() => {
                                        setSearch("");
                                        setActiveCategory("all");
                                        if (searchRef.current) searchRef.current.focus();
                                    }}
                                >
                                    Show All Services
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};
