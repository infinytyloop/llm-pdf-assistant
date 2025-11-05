'use client';
import { useState } from 'react';
import { pdfjs } from 'react-pdf';
import FileUpload from '@/components/FileUpload';
import PdfViewer from '@/components/PdfViewer';
import ChatUI from '@/components/ChatUI';
import DocxHandler from '@/components/DocxHandler'; // Import DocxHandler

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function Home() {
  const [noteContent, setNoteContent] = useState('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [docxFile, setDocxFile] = useState(null); // new state for docx file
  const [highlightedText, setHighlightedText] = useState('');


  const handleTextHighlighted = (text) => {
    setHighlightedText(text);
  };

  const onPdfBlob = (blob) => {
    console.log('PDF Blob received:', blob);
    if (blob) {
      // Check if blob is valid before creating URL
      console.log('Blob type:', blob.type); // Add this line to check the blob type
      const url = URL.createObjectURL(blob);
      console.log('Blob URL created:', url);
      setPdfBlobUrl(url);
      setDocxFile(null); // Clear any existing DOCX
    } else {
      console.error('Invalid blob received');
    }
  };

  const onDocxFile = (file) => {
    setDocxFile(file);
    setPdfBlobUrl(null); // Clear any existing PDF
    setNoteContent(''); // Clear any existing content
  };

  const onUploadSuccess = (content) => {
    if (content instanceof Blob && content.type === 'application/pdf') {
      // Assuming it's a PDF blob
      onPdfBlob(content);
      setNoteContent(''); // Clear any existing content
      setDocxFile(null); // Clear any existing DOCX
    } else if (content instanceof File && (content.name.endsWith('.docx') || content.name.endsWith('.doc'))) {
      // Assuming it's a DOCX file
      onDocxFile(content);
      setNoteContent(''); // Clear any existing content
      setPdfBlobUrl(null); // Clear any existing PDF
    }
     else {
      setNoteContent(content);
      setPdfBlobUrl(null); // Clear any existing PDF
      setDocxFile(null); // Clear any existing DOCX
    }
  };

  return (
    <main className="p-4 w-full grid grid-cols-12 gap-4">
      <h1 className="col-span-full text-3xl font-bold mb-6 text-center">Platform</h1>
      
      {/* Left side - spans 2 columns */}
      <div className="col-span-2 sticky top-32 h-fit">
        <FileUpload onUploadSuccess={onUploadSuccess} onPdfBlob={onPdfBlob} />
      </div>
      
      {/* Center document area - spans 8 columns */}
      <div className="col-span-6">
        {pdfBlobUrl ? (
          <div className="p-4 bg-black rounded shadow">
            <h2 className="text-xl font-semibold mb-4">PDF Preview</h2>
            <PdfViewer file={pdfBlobUrl} onTextHighlighted={handleTextHighlighted} />
          </div>
        ) : docxFile ? (
          <div className="p-4 bg-black rounded shadow">
            <h2 className="text-xl font-semibold mb-4">DOCX Preview</h2>
            <DocxHandler file={docxFile} onTextHighlighted={handleTextHighlighted} />
          </div>
        ) : null}
      </div>
      
      {/* Right side - spans 2 columns */}
      <div className="col-span-4 sticky top-32 h-fit">
        <ChatUI highlightedText={highlightedText} />
      </div>
    </main>
);}