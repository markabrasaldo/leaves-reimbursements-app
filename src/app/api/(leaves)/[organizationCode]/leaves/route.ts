import { NextResponse } from 'next/server';
import { mockLeaveListResponse } from '../../data';

export async function GET() {
  return NextResponse.json(mockLeaveListResponse);
}
