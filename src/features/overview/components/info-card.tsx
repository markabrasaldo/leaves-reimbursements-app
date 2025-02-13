import { Icons } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CardItem } from 'types';

export function InfoCard({
  cardTitle,
  cardValue,
  cardIcon,
  cardSubText
}: CardItem) {
  const Icon = cardIcon ? Icons[cardIcon] : Icons.logo;

  return (
    <Card key={cardTitle}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{cardTitle}</CardTitle>
        {cardIcon && <Icon />}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{cardValue}</div>
        <p className='text-xs text-muted-foreground'>{cardSubText}</p>
      </CardContent>
    </Card>
  );
}
