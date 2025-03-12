'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { CardItem } from 'types';

export function InfoCard({
  cardButton,
  cardButtonText,
  cardTitle,
  cardValue,
  cardIcon,
  cardIconColor,
  cardSubText,
  className
}: CardItem) {
  const Icon = cardIcon ? Icons[cardIcon] : Icons.logo;
  const router = useRouter();

  return (
    <Card key={cardTitle} className={className}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{cardTitle}</CardTitle>
        {cardIcon && <Icon className={`text-[${cardIconColor}]`} />}
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between'>
          <div>
            <div className='text-2xl font-bold'>{cardValue}</div>
            <p className='text-xs text-muted-foreground'>{cardSubText}</p>
          </div>

          {cardButton && (
            <Button
              onClick={() => router.push('/dashboard/leave')}
              variant='outline'
              size='sm'
              className='shrink-0'
            >
              {cardButtonText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
