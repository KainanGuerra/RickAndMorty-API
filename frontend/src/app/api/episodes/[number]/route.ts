import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { backendUrl, SESSION_COOKIE } from '@/lib/session';

export async function GET(
  request: NextRequest,
  { params }: { params: { number: string } },
) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const search = request.nextUrl.search;
  const backendResponse = await fetch(
    backendUrl(`/api/v1/episodes/${params.number}/characters${search}`),
    { headers: { Authorization: `Bearer ${token}` } },
  );

  const data = await backendResponse.json();
  return NextResponse.json(data, { status: backendResponse.status });
}
