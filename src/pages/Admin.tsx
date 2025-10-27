import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

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

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, messagesRes] = await Promise.all([
        fetch('https://functions.poehali.dev/af963a7f-06b4-41da-a8ed-362903dc16bb'),
        fetch('https://functions.poehali.dev/343577d6-59ef-45d3-bce4-055ee0a6d640')
      ]);

      const ordersData = await ordersRes.json();
      const messagesData = await messagesRes.json();

      setOrders(ordersData.orders || []);
      setMessages(messagesData.messages || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <h1 className="text-2xl font-bold">Админ-панель</h1>
            </div>
            <Button onClick={fetchData} variant="outline" size="sm">
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Обновить
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="orders">
              Заказы ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="messages">
              Сообщения ({messages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
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
                            onClick={() => setSelectedOrder(order)}
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
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <div className="grid gap-4">
              {isLoading ? (
                <Card className="p-8 text-center text-muted-foreground">
                  Загрузка...
                </Card>
              ) : messages.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  Сообщений пока нет
                </Card>
              ) : (
                messages.map((message) => (
                  <Card key={message.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{message.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {message.email}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Заказ #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Клиент</div>
                  <div className="font-medium">{selectedOrder.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Телефон</div>
                  <div className="font-medium">{selectedOrder.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Email</div>
                  <div className="font-medium">{selectedOrder.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Дата</div>
                  <div className="font-medium">
                    {formatDate(selectedOrder.created_at)}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Адрес доставки</div>
                <div className="font-medium">{selectedOrder.address}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-3">Товары</div>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 border border-border rounded"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Размер: {item.size} × {item.quantity} шт.
                        </div>
                      </div>
                      <div className="font-semibold">
                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-lg font-semibold">Итого:</div>
                <div className="text-2xl font-bold">
                  {selectedOrder.total.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}