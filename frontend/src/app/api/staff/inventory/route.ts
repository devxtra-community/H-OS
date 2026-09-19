import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/src/lib/server/auth';
import { inventoryService } from '@/src/lib/server/services/inventory.service';

export async function GET() {
  const items = await inventoryService.getItems();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const item = await inventoryService.createItem(body, user.sub);
  return NextResponse.json(item, { status: 201 });
}
