'use client';

import { useEffect, useState, useRef } from 'react';
import { uploadPatientDocument } from '../../../../features/patient/api/uploadDocument';
import { getPatientDocuments } from '../../../../features/patient/api/getDocument';
import { deletePatientDocument } from '../../../../features/patient/api/deleteDocument';

import {
  FileText,
  Upload,
  Trash2,
  Image,
  File,
  Download
} from 'lucide-react';

type DocumentType = {
  file_url: string;
  file_key: string;
  file_name: string;
};

function getFileIcon(fileName: string) {

  const extension = fileName.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') {
    return <FileText className="w-6 h-6 text-red-500" />;
  }

  if (['png', 'jpg', 'jpeg', 'webp'].includes(extension || '')) {
    return <Image className="w-6 h-6 text-blue-500" />;
  }

  return <File className="w-6 h-6 text-gray-500" />;
}

export default function DocumentsPage() {

  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {

    async function loadDocuments() {

      const data = await getPatientDocuments();

      setDocuments(data);

    }

    loadDocuments();

  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {

    const file = e.target.files?.[0];
    if (!file) return;

    try {

      setUploading(true);

      const result = await uploadPatientDocument(file);

      setDocuments(prev => [
        {
          file_url: result.fileUrl,
          file_key: result.key,
          file_name: file.name
        },
        ...prev
      ]);

    } catch (err) {

      console.error("Upload failed", err);

    } finally {

      setUploading(false);

    }
  }

  async function handleDelete(index: number, key: string) {

    await deletePatientDocument(key);

    setDocuments(prev =>
      prev.filter((_, i) => i !== index)
    );
  }

  return (

    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Documents
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Your medical documents and files
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
        >
          <Upload className="w-4 h-4" />

          {uploading ? "Uploading..." : "Upload"}

        </button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleUpload}
        />

      </div>

      {/* Empty State */}

      {documents.length === 0 && (

        <div className="bg-white rounded-2xl p-10 border text-center text-slate-500">
          No documents uploaded yet
        </div>

      )}

      {/* Document Grid */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {documents.map((doc, index) => (

          <div
            key={doc.file_key}
            className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition group"
          >

            <div className="flex items-start justify-between mb-4">

              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100">
                {getFileIcon(doc.file_name)}
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">

                <a
                  href={doc.file_url}
                  target="_blank"
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                </a>

                <button
                  onClick={() => handleDelete(index, doc.file_key)}
                  className="p-2 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>

              </div>

            </div>

            <a
              href={doc.file_url}
              target="_blank"
              className="block"
            >

              <h3 className="font-semibold text-slate-900 text-sm truncate">
                {doc.file_name}
              </h3>

            </a>

          </div>

        ))}

      </div>

    </div>

  );
}