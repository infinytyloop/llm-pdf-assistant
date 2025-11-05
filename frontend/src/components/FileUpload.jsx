import { useState } from 'react';
import axios from 'axios';

export default function FileUpload({ onUploadSuccess, onPdfBlob }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    if (file.type === 'application/pdf' && typeof onPdfBlob === 'function') {
      onUploadSuccess(file);
    }

    else if (file.type =='application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      onUploadSuccess(file);
    }

    else if (file.type =='application/msword') {
      onUploadSuccess(file);
    }

    else {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(
          'http://localhost:8000/upload/', 
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        onUploadSuccess(response.data.content);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload failed. Check console for details.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="file" 
          accept=".pdf,.docx,.doc" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button 
          type="submit" 
          disabled={isUploading || !file}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isUploading ? 'Processing...' : 'Upload Notes'}
        </button>
      </form>
    </div>
  );
}