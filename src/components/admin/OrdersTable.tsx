import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  items: any[];
  total: number;
  status: string;
  created_at: string;
}

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onSelectOrder: (order: Order) => void;
}

export default function OrdersTable({ orders, isLoading, onSelectOrder }: OrdersTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      new: 'default',
      processing: 'secondary',
      completed: 'secondary',
    };

    const labels: Record<string, string> = {
      new: 'Новый',
      processing: 'В обработке',
      completed: 'Выполнен',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden">
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">
          Загрузка...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          Заказов пока нет
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell className="text-sm">
                  {formatDate(order.created_at)}
                </TableCell>
                <TableCell>
                  <div>{order.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.email}
                  </div>
                </TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell className="font-semibold">
                  {order.total.toLocaleString('ru-RU')} ₽
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectOrder(order)}
                  >
                    Подробнее
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
