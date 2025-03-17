'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { CardItem, RedirectParams } from 'types';

export function InfoCard({
  cardButton,
  cardButtonText,
  cardTitle,
  cardValue,
  cardIcon,
  cardIconColor,
  cardSubText,
  className,
  redirectTo
}: CardItem) {
  const Icon = cardIcon ? Icons[cardIcon] : Icons.logo;
  const router = useRouter();

  const handleOnClick = (redirectParams: RedirectParams) => {
    if (redirectParams) {
      router.push(
        `/dashboard/${redirectParams.page}?status=${redirectParams.status}`
      );
    }
  };

  return (
    <Card
      key={cardTitle}
      className={className}
      onClick={() => handleOnClick(redirectTo as RedirectParams)}
    >
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
