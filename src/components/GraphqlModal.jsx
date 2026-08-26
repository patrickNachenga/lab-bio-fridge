import { useEffect } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import GlobalModal from "./GlobalModal";

const sizeClassMap = {
  sm: "graphql-modal-sm",
  md: "graphql-modal-md",
  lg: "graphql-modal-lg",
  xl: "graphql-modal-xl",
  full: "graphql-modal-full",
};

const GraphqlModal = ({
  isOpen,
  title,
  subtitle,
  icon,
  children,
  footer,
  onClose,
  size = "lg",
  closeOnEscape = true,
  isSubmitting = false,
}) => {
  useEffect(() => { 
    if (!isOpen || !closeOnEscape) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEscape, isOpen, onClose]);

  return (
    <GlobalModal isOpen={isOpen} backdropClassName="graphql-modal-backdrop">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            aria-modal="true"
            className={`graphql-modal-shell ${sizeClassMap[size] || sizeClassMap.lg}`}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="graphql-modal-accent" />
            <header className="graphql-modal-header">
              <div className="graphql-modal-title-wrap">
                {icon && <span className="graphql-modal-icon">{icon}</span>}
                <div>
                  <h5 className="graphql-modal-title">{title}</h5>
                  {subtitle && <p className="graphql-modal-subtitle">{subtitle}</p>}
                </div>
              </div>
              <button
                type="button"
                className="graphql-modal-close text-danger"
                onClick={onClose}
                disabled={isSubmitting}
                aria-label="Close"
                title="Close"
              >
                <X size={18} />
              </button>
            </header>

            <div className="graphql-modal-body">{children}</div>

            {footer && <footer className="graphql-modal-footer">{footer}</footer>}

            <style>{`
              .graphql-modal-shell {
                background: #ffffff;
                border: 1px solid rgba(99, 102, 241, 0.14);
                border-radius: 8px;
                box-shadow: 0 22px 70px rgba(15, 23, 42, 0.22);
                margin: 0 auto;
                max-height: calc(100vh - 48px);
                overflow: hidden;
                position: relative;
                width: min(100%, 760px);
              }

              .graphql-modal-sm { width: min(100%, 460px); }
              .graphql-modal-md { width: min(100%, 620px); }
              .graphql-modal-lg { width: min(100%, 820px); }
              .graphql-modal-xl { width: min(100%, 1080px); }
              .graphql-modal-full { width: min(100%, 1320px); }

              .graphql-modal-accent {
                background: linear-gradient(90deg, #2563eb, #14b8a6, #f59e0b);
                height: 4px;
              }

              .graphql-modal-header {
                align-items: flex-start;
                border-bottom: 1px solid #eef2f7;
                display: flex;
                gap: 16px;
                justify-content: space-between;
                padding: 18px 22px;
              }

              .graphql-modal-title-wrap {
                align-items: center;
                display: flex;
                gap: 12px;
                min-width: 0;
              }

              .graphql-modal-icon {
                align-items: center;
                background: #eff6ff;
                border-radius: 8px;
                color: #2563eb;
                display: inline-flex;
                flex: 0 0 auto;
                height: 40px;
                justify-content: center;
                width: 40px;
              }

              .graphql-modal-title {
                color: #111827;
                font-size: 1.05rem;
                font-weight: 700;
                letter-spacing: 0;
                line-height: 1.25;
                margin: 0;
              }

              .graphql-modal-subtitle {
                color: #64748b;
                font-size: 0.875rem;
                margin: 3px 0 0;
              }

              .graphql-modal-close {
                align-items: center;
                background: #12293f;
                border: 1px solid #e2e8f0;
                color: #ffffff;
                cursor: pointer;
                border-radius: 8px;
                color: #475569;
                display: inline-flex;
                height: 34px;
                justify-content: center;
                padding: 0;
                transition: all 0.16s ease;
                width: 34px;
              }

              .graphql-modal-close:hover:not(:disabled) {
                background: #fee2e2;
                border-color: #fecaca;
                color: #dc2626;
              }

              .graphql-modal-body {
                max-height: calc(100vh - 190px);
                overflow-y: auto;
                padding: 22px;
              }

              .graphql-modal-footer {
                align-items: center;
                background: #f8fafc;
                border-top: 1px solid #eef2f7;
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                padding: 16px 22px;
              }

              @media (max-width: 576px) {
                .graphql-modal-shell {
                  max-height: calc(100vh - 20px);
                }

                .graphql-modal-header,
                .graphql-modal-body,
                .graphql-modal-footer {
                  padding-left: 16px;
                  padding-right: 16px;
                }
              }
            `}</style>
          </motion.section>
        )}
      </AnimatePresence>
    </GlobalModal>
  );
};

GraphqlModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  onClose: PropTypes.func,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "full"]),
  closeOnEscape: PropTypes.bool,
  isSubmitting: PropTypes.bool,
};

export default GraphqlModal;
