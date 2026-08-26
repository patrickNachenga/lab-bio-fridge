import React, { useState } from "react";
import "./PDFViewer.css"; // Optional: for styling

const PDFViewer = ({ fileUrl, fileName = "document.pdf" }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pdf-viewer-container" style={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      <div className="pdf-viewer-header">
        <span className="pdf-title">{fileName}</span>
        <div className="pdf-actions">
          <button onClick={handleDownload} className="download-btn">
            📥 Download
          </button>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="open-new-btn"
          >
            ↗ Open in New Tab
          </a>
        </div>
      </div>

      <div className="pdf-iframe-container" >
        {isLoading && (
          <div className="pdf-loading">
            <div className="spinner"></div>
            <p>Loading PDF...</p>
          </div>
        )}

        <iframe
          src={`${fileUrl}#view=FitH`}
          title={`PDF Viewer - ${fileName}`}
          className="pdf-iframe"
          onLoad={() => setIsLoading(false)}
          allow="fullscreen" 
        />
      </div>

      <div className="pdf-viewer-footer">
        <p>
          Having trouble viewing?{" "}
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Open in browser
          </a>
        </p>
      </div>
    </div>
  );
};

export default PDFViewer;
