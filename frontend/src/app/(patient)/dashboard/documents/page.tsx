'use client';

import { useEffect, useState } from 'react';
import { uploadPatientDocument } from '../../../../features/patient/api/uploadDocument';
import { getPatientDocuments } from '../../../../features/patient/api/getDocument';
import { deletePatientDocument } from '../../../../features/patient/api/deleteDocument';
import { FileText, Upload, Trash2 } from 'lucide-react';

type DocumentType = {
  file_url: string;
  file_key: string;
  file_name: string;
};

export default function DocumentsPage() {


  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [uploading, setUploading] = useState(false);

  function getFileName(url: string) {
  return url.split('/').pop();
}
  // load documents
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
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Documents
        </h1>

        <p className="text-slate-500">
          Upload and manage your medical documents
        </p>
      </div>

      {/* Upload Section */}

      <div className="bg-white rounded-2xl p-6 shadow border">

        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 cursor-pointer hover:bg-slate-50">

          <Upload size={30} className="mb-2 text-slate-500" />

          <p className="text-slate-700 font-medium">
            {uploading ? "Uploading..." : "Click to upload document"}
          </p>

          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
          />

        </label>

      </div>

      {/* Document List */}

      <div className="bg-white rounded-2xl p-6 shadow border">

        <h2 className="font-semibold mb-4 text-lg">
          Uploaded Documents
        </h2>

        {documents.length === 0 && (
          <p className="text-slate-500">
            No documents uploaded yet.
          </p>
        )}

        <div className="space-y-3">

          {documents.map((doc, index) => (

            <div
              key={doc.file_key}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50"
            >

              <a
                href={doc.file_url}
                target="_blank"
                className="flex items-center gap-3"
              >

                <FileText size={18} className="text-blue-600" />
<span className="text-sm font-medium">
  {getFileName(doc.file_name)}
</span>

              </a>

              <button
                onClick={() => handleDelete(index, doc.file_key)}
                className="text-red-500 flex items-center gap-1 text-sm"
              >

                <Trash2 size={16} />

                Delete

              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}