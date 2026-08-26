import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

const GLOBAL_MODAL_ROOT_ID = "global-modal-root";

export const GlobalModalHost = () => {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    let root = document.getElementById(GLOBAL_MODAL_ROOT_ID);
    if (!root) {
      root = document.createElement("div");
      root.id = GLOBAL_MODAL_ROOT_ID;
      document.body.prepend(root);
    }

    return undefined;
  }, []);

  return null;
};

const getGlobalModalRoot = () => {
  if (typeof document === "undefined") return null;

  let root = document.getElementById(GLOBAL_MODAL_ROOT_ID);
  if (!root) {
    root = document.createElement("div");
    root.id = GLOBAL_MODAL_ROOT_ID;
    document.body.prepend(root);
  }

  return root;
};

const GlobalModal = ({
  isOpen,
  children,
  className = "",
  backdropClassName = "",
  zIndex = 10000,
}) => {
  const root = useMemo(() => getGlobalModalRoot(), []);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !root) return null;

  return createPortal(
    <div
      className={`global-modal-backdrop ${backdropClassName}`}
      style={{ zIndex }}
    >
      <div className={`global-modal-layer ${className}`}>{children}</div>
      <style>{`
        .global-modal-backdrop {
          align-items: center;
          background: rgba(15, 23, 42, 0.64);
          display: flex;
          inset: 0;
          justify-content: center;
          overflow-y: auto;
          padding: 24px 12px;
          position: fixed;
        }

        .global-modal-layer {
          position: relative;
          width: 100%;
          z-index: 1;
        }
      `}</style>
    </div>,
    root
  );
};

export default GlobalModal;
