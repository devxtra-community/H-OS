import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/src/lib/server/auth';
import { patientService } from '@/src/lib/server/services/patient.service';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const docs = await patientService.getPatientDocuments(user.sub);
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { fileUrl, fileKey, fileName } = await req.json();
  const doc = await patientService.savePatientDocument(
    user.sub,
    fileUrl,
    fileKey,
    fileName
  );
  return NextResponse.json(doc, { status: 201 });
}
