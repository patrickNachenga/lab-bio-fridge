import { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PAGE_GAP_PX = 12;

/**
 * Canvas-based PDF preview (PDF.js). Avoids the browser PDF toolbar (Drive / print / download).
 * All pages are stacked vertically so users can scroll through the document; toolbar shows the page nearest the viewport center.
 */
export default function SecuredPdfViewer({ src, className = "" }) {
  const scrollRef = useRef(null);
  const innerRef = useRef(null);
  const pdfRef = useRef(null);
  const renderGenRef = useRef(0);
  const renderTasksRef = useRef([]);

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.15);
  const [docLoading, setDocLoading] = useState(true);
  const [pagesRendering, setPagesRendering] = useState(false);
  const [error, setError] = useState(null);

  const scrollToPage = useCallback((page, behavior = "smooth") => {
    const el = document.getElementById(`secured-pdf-page-${page}`);
    el?.scrollIntoView({ behavior, block: "start", inline: "nearest" });
  }, []);

  const updatePageFromScroll = useCallback(() => {
    const root = scrollRef.current;
    if (!root || numPages < 1) return;
    const rootRect = root.getBoundingClientRect();
    const midY = rootRect.top + rootRect.height / 2;
    let bestPage = 1;
    let bestDist = Infinity;
    for (let p = 1; p <= numPages; p++) {
      const el = document.getElementById(`secured-pdf-page-${p}`);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom < rootRect.top || r.top > rootRect.bottom) continue;
      const elMid = r.top + r.height / 2;
      const dist = Math.abs(elMid - midY);
      if (dist < bestDist) {
        bestDist = dist;
        bestPage = p;
      }
    }
    setPageNumber((prev) => (prev === bestPage ? prev : bestPage));
  }, [numPages]);

  // Load PDF document when src changes
  useEffect(() => {
    if (!src) return undefined;

    let cancelled = false;
    setNumPages(0);
    setPageNumber(1);
    setError(null);
    setDocLoading(true);
    if (innerRef.current) innerRef.current.innerHTML = "";

    if (pdfRef.current) {
      try {
        pdfRef.current.destroy?.();
      } catch {
        /* ignore */
      }
      pdfRef.current = null;
    }

    const run = async () => {
      try {
        const task = pdfjsLib.getDocument({
          url: src,
          withCredentials: false,
        });
        const pdf = await task.promise;
        if (cancelled) {
          await pdf.destroy?.();
          return;
        }
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
      } catch (e) {
        if (!cancelled) {
          const msg =
            e?.name === "PasswordException"
              ? "This PDF is password-protected and cannot be previewed here."
              : e?.message || "Could not load PDF preview.";
          setError(msg);
          setDocLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [src]);

  // Render all pages when document + scale are ready
  useEffect(() => {
    if (!src || numPages < 1) return undefined;

    const pdf = pdfRef.current;
    if (!pdf) return undefined;

    const gen = ++renderGenRef.current;
    const inner = innerRef.current;
    if (!inner) return undefined;

    renderTasksRef.current.forEach((t) => {
      try {
        t.cancel();
      } catch {
        /* ignore */
      }
    });
    renderTasksRef.current = [];

    let cancelled = false;

    const run = async () => {
      setPagesRendering(true);
      inner.innerHTML = "";

      try {
        for (let i = 1; i <= numPages; i++) {
          if (cancelled || gen !== renderGenRef.current) return;

          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.display = "block";
          canvas.style.margin = "0 auto";
          canvas.style.maxWidth = "100%";
          canvas.style.height = "auto";

          const renderTask = page.render({
            canvasContext: ctx,
            viewport,
          });
          renderTasksRef.current.push(renderTask);

          try {
            await renderTask.promise;
          } catch (e) {
            if (e?.name === "RenderingCancelledException") return;
            throw e;
          }

          if (cancelled || gen !== renderGenRef.current) return;

          const wrap = document.createElement("div");
          wrap.id = `secured-pdf-page-${i}`;
          wrap.dataset.page = String(i);
          wrap.style.paddingBottom = `${PAGE_GAP_PX}px`;
          wrap.appendChild(canvas);
          inner.appendChild(wrap);
        }

        if (cancelled || gen !== renderGenRef.current) return;

        setDocLoading(false);
        setPagesRendering(false);

        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
          setPageNumber(1);
        });
      } catch (e) {
        if (!cancelled && gen === renderGenRef.current) {
          setError(e?.message || "Could not render PDF preview.");
          setDocLoading(false);
          setPagesRendering(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
      renderTasksRef.current.forEach((t) => {
        try {
          t.cancel();
        } catch {
          /* ignore */
        }
      });
      renderTasksRef.current = [];
    };
  }, [src, numPages, scale]);

  // Sync toolbar page label while user scrolls
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || docLoading || pagesRendering || numPages < 1) return undefined;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updatePageFromScroll);
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    updatePageFromScroll();

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("scroll", onScroll);
    };
  }, [docLoading, pagesRendering, numPages, updatePageFromScroll]);

  useEffect(() => {
    return () => {
      renderTasksRef.current.forEach((t) => {
        try {
          t.cancel();
        } catch {
          /* ignore */
        }
      });
      renderTasksRef.current = [];
      if (pdfRef.current) {
        pdfRef.current.destroy?.();
        pdfRef.current = null;
      }
      if (innerRef.current) innerRef.current.innerHTML = "";
    };
  }, []);

  if (error) {
    return (
      <div className={`alert alert-warning mb-0 ${className}`} role="alert">
        <i className="bx bx-error-circle me-2" />
        {error}
      </div>
    );
  }

  const showSpinner = docLoading || pagesRendering;

  return (
    <div className={className}>
      <div
        className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2 px-1 py-2 rounded border bg-light"
        style={{ userSelect: "none" }}
      >
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={showSpinner || pageNumber <= 1}
            onClick={() => {
              const p = Math.max(1, pageNumber - 1);
              scrollToPage(p);
            }}
            aria-label="Previous page"
          >
            <i className="bx bx-chevron-left" />
          </button>
          <span className="small text-muted tabular-nums">
            Page {showSpinner ? "…" : `${pageNumber} / ${Math.max(numPages, 1)}`}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={showSpinner || pageNumber >= numPages}
            onClick={() => {
              const p = Math.min(numPages, pageNumber + 1);
              scrollToPage(p);
            }}
            aria-label="Next page"
          >
            <i className="bx bx-chevron-right" />
          </button>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={showSpinner || scale <= 0.6}
            onClick={() => setScale((s) => Math.round((s - 0.15) * 100) / 100)}
            aria-label="Zoom out"
          >
            <i className="bx bx-minus" />
          </button>
          <span className="small text-muted tabular-nums" style={{ minWidth: "3rem", textAlign: "center" }}>
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={showSpinner || scale >= 2.5}
            onClick={() => setScale((s) => Math.round((s + 0.15) * 100) / 100)}
            aria-label="Zoom in"
          >
            <i className="bx bx-plus" />
          </button>
        </div>
      </div>
      {showSpinner && (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <div className="spinner-border text-primary mb-2" role="status">
            <span className="visually-hidden">Loading PDF…</span>
          </div>
          <small className="text-muted">Rendering secure preview…</small>
        </div>
      )}
      <div
        ref={scrollRef}
        className="text-center overflow-auto"
        style={{
          minHeight: showSpinner ? 0 : "55vh",
          maxHeight: "65vh",
          background: "#525659",
          borderRadius: "0.375rem",
        }}
      >
        <div ref={innerRef} className="py-2" style={{ minHeight: "100%" }} />
      </div>
    </div>
  );
}
