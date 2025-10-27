import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/133f03e1-973d-44e0-b151-f0c19cae7e33', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.valid) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_auth', 'true');
        fetchData();
      } else {
        toast({
          title: 'Ошибка',
          description: 'Неверный пароль',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось войти',
        variant: 'destructive'
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/af963a7f-06b4-41da-a8ed-362903dc16bb');
      const data = await response.json();

      setOrders(data.orders || []);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/f1b7ce7b-2c2f-4c89-a900-04a965ca2175', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          type: 'order',
          id: orderId,
          status: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Готово',
          description: 'Статус заказа обновлен'
        });
        fetchData();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive'
      });
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return;

    try {
      const response = await fetch('https://functions.poehali.dev/f1b7ce7b-2c2f-4c89-a900-04a965ca2175', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          type: 'order',
          id: orderId
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Готово',
          description: 'Заказ удален'
        });
        setSelectedOrder(null);
        fetchData();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить заказ',
        variant: 'destructive'
      });
    }
  };

  const deleteMessage = async (messageId: number) => {
    if (!confirm('Вы уверены, что хотите удалить это сообщение?')) return;

    try {
      const response = await fetch('https://functions.poehali.dev/f1b7ce7b-2c2f-4c89-a900-04a965ca2175', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          type: 'message',
          id: messageId
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Готово',
          description: 'Сообщение удалено'
        });
        fetchData();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить сообщение',
        variant: 'destructive'
      });
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

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <Icon name="Lock" size={48} className="mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-bold">Админ-панель</h1>
            <p className="text-muted-foreground mt-2">Введите пароль для входа</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isAuthLoading}
              className="text-center"
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!password || isAuthLoading}
            >
              {isAuthLoading ? 'Проверка...' : 'Войти'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => navigate('/')}
            >
              Вернуться на сайт
            </Button>
          </form>
        </Card>
      </div>
    );
  }

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
            <div className="flex gap-2">
              <Button onClick={fetchData} variant="outline" size="sm">
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Обновить
              </Button>
              <Button onClick={handleLogout} variant="ghost" size="sm">
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(message.created_at)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
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
            <DialogTitle className="flex items-center justify-between">
              <span>Заказ #{selectedOrder?.id}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectedOrder && deleteOrder(selectedOrder.id)}
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Удалить
              </Button>
            </DialogTitle>
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
                  <div className="font-medium">{formatDate(selectedOrder.created_at)}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Адрес доставки</div>
                <div className="font-medium">{selectedOrder.address}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-3">Статус заказа</div>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новый</SelectItem>
                    <SelectItem value="processing">В обработке</SelectItem>
                    <SelectItem value="completed">Выполнен</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-3">Товары</div>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 border rounded-lg">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        {item.size && (
                          <div className="text-sm text-muted-foreground">
                            Размер: {item.size}
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          Количество: {item.quantity}
                        </div>
                      </div>
                      <div className="font-semibold">
                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Итого:</span>
                  <span>{selectedOrder.total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
