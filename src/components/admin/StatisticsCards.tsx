import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface StatisticsData {
  page_views: number;
  add_to_cart: number;
  period_start: string;
  period_end: string;
}

interface StatisticsCardsProps {
  data: StatisticsData | null;
  isLoading: boolean;
}

export default function StatisticsCards({ data, isLoading }: StatisticsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Загрузка...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Загрузка...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const conversionRate = data.page_views > 0 
    ? ((data.add_to_cart / data.page_views) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Заходы на сайт</CardTitle>
          <Icon name="Eye" className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.page_views}</div>
          <p className="text-xs text-muted-foreground mt-1">
            За весь период
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Добавления в корзину</CardTitle>
          <Icon name="ShoppingCart" className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.add_to_cart}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Конверсия: {conversionRate}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
