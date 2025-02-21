import { NextResponse } from 'next/server';

const reimbusrsementTypes = [
  {
    id: '75ca5949-fe2f-4200-aa88-af9e277d7482',
    organization_code: 'tech-corp-t5315',
    code: 'travel-37d77',
    name: 'Travel',
    description: 'Covers transportation and lodging.'
  },
  {
    id: '336b9e2d-0214-488d-8d9e-1d83283dc005',
    organization_code: 'tech-corp-t5315',
    code: 'food-0637a',
    name: 'Food',
    description: 'Covers Food.'
  }
];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return NextResponse.json(reimbusrsementTypes);
}
