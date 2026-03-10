import { pool } from '../../db';

export async function savePatientDocument(
  patientId: string,
  fileUrl: string,
  fileKey: string,
  fileName: string
) {
  const result = await pool.query(
    `
    INSERT INTO patient_documents (patient_id, file_url, file_key, file_name)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [patientId, fileUrl, fileKey, fileName]
  );

  return result.rows[0];
}

export async function getPatientDocuments(patientId: string) {
  const result = await pool.query(
    `
    SELECT file_url, file_key, file_name
    FROM patient_documents
    WHERE patient_id=$1
    ORDER BY created_at DESC
    `,
    [patientId]
  );

  return result.rows;
}

export async function deletePatientDocument(
  patientId: string,
  fileKey: string
) {
  await pool.query(
    `
    DELETE FROM patient_documents
    WHERE patient_id=$1 AND file_key=$2
    `,
    [patientId, fileKey]
  );
}
