// PDFViewer.jsx
import { useState, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

export default function PdfViewer({ file, onTextHighlighted }) {
  const [numPages, setNumPages] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const pdfContainerRef = useRef(null);
  const [pageDimensions, setPageDimensions] = useState({ width: 800, height: 0 });

  function handleDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (
      selection.toString().trim() !== '' &&
      pdfContainerRef.current?.contains(selection.anchorNode)
    ) {
      setSelectedText(selection.toString());
      console.log('Selected text:', selection.toString());
      onTextHighlighted(selection.toString());
    }
  };
  // Calculate page height based on width
  const updatePageDimensions = (width) => {
    // Adjust height based on aspect ratio (typical PDF aspect ratio is 1.414)
    setPageDimensions({
      width: width,
      height: width * 1.414
    });
  };

  return (
    <div 
      className="pdf-viewer-container"
      style={{
        width: '100%',
        height: '80vh',
        overflow: 'auto',
        border: '1px solid #ddd',
        borderRadius: '4px',
        position: 'relative'
      }}
      ref={pdfContainerRef}
    >
      <div 
        className="pdf-content-wrapper"
        onMouseUp={handleTextSelection}
        style={{ width: pageDimensions.width }}
      >
        <Document
          file={file}
          onLoadSuccess={handleDocumentLoadSuccess}
          onLoadError={console.error}
          onLoadProgress={({ loaded, total }) => console.log(`Loading: ${(loaded / total * 100).toFixed(0)}%`)}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <div 
              key={`page-container-${i + 1}`}
              className="pdf-page-container"
              style={{ 
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
            >
              <Page
                key={`page_${i + 1}`}
                pageNumber={i + 1}
                width={pageDimensions.width}
                onLoadSuccess={(page) => {
                  // Optional: Adjust width based on actual page size
                  const { width, height } = page.getViewport({ scale: 1 });
                  updatePageDimensions(pageDimensions.width);
                }}
                renderAnnotationLayer={false}
                renderTextLayer={true}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}