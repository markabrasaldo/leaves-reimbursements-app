import { NextRequest, NextResponse } from 'next/server';
import { leaves } from '@/constants/mock-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { organizationCode: string } }
) {
  const { organizationCode } = params;
  try {
    const response = await fetch(`/${organizationCode}/leaves`);

    if (!response.ok) {
      throw new Error('Failed to fetch leave requests');
    }

    const data = await response.json();
    console.log('hatdogs');

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(leaves);

    // return NextResponse.json(
    //   { error: 'Failed to fetch leave requests' },
    //   { status: 500 }
    // );
  }
}
