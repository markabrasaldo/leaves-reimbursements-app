import { NextResponse } from 'next/server';

const leaveTypes = [
  {
    id: 'vacation',
    name: 'Vacation',
    color: 'bg-blue-100',
    description: 'Time off for rest, travel, or personal activities',
    icon: 'Umbrella'
  },
  {
    id: 'sick',
    name: 'Sick Leave',
    color: 'bg-red-100',
    description: 'Time off due to illness or medical appointments',
    icon: 'Stethoscope'
  },
  {
    id: 'personal',
    name: 'Personal Leave',
    color: 'bg-green-100',
    description: 'Time off for personal matters or emergencies',
    icon: 'User'
  }
];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return NextResponse.json(leaveTypes);
}
