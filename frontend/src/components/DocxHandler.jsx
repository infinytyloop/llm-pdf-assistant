import React, { useState, useEffect, useRef } from 'react';
import mammoth from 'mammoth';

export default function DocxHandler({ file, onTextHighlighted }) {
  const [docxContent, setDocxContent] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const docxContainerRef = useRef(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const arrayBuffer = event.target.result;
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer }, { convertImage: mammoth.images.imgElement(function(image) {
          return {};}) })
          .then(function(result) {
            setDocxContent(result.value);
          })
          .catch(function(error) {
            console.error('Error converting DOCX to HTML:', error);
          });
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (
      selection.toString().trim() !== '' &&
      docxContainerRef.current?.contains(selection.anchorNode)
    ) {
      setSelectedText(selection.toString());
      console.log('Selected text:', selection.toString());
      onTextHighlighted(selection.toString());
    }
  };

  return (
    <div
      className="docx-viewer-container"
      style={{
        width: '100%',
        height: '80vh',
        overflow: 'auto',
        border: '1px solid #ddd',
        borderRadius: '4px',
        position: 'relative'
      }}
      ref={docxContainerRef}
    >
      <div
        className="docx-content-wrapper"
        onMouseUp={handleTextSelection}
      >
        {docxContent ? (
          <div dangerouslySetInnerHTML={{ __html: docxContent }} />
        ) : (
            <p>Loading DOCX content...</p>
        )}
        </div>
    </div>
    );
}
