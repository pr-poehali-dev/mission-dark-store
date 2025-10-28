import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import OrdersTable from '@/components/admin/OrdersTable';
import MessagesList from '@/components/admin/MessagesList';
import OrderDetailsDialog from '@/components/admin/OrderDetailsDialog';
import ProductsManager from '@/components/admin/ProductsManager';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      setProducts(data.products || []);
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

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    fetchData();
  };

  const testTelegram = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/634f3cea-2066-436e-b092-ae749813c514');
      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Успешно',
          description: 'Тестовое сообщение отправлено в Telegram'
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить сообщение',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Проверьте настройки бота и chat ID',
        variant: 'destructive'
      });
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onRefresh={fetchData} onLogout={handleLogout} onTestTelegram={testTelegram} />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="orders">
              Заказы ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="messages">
              Сообщения ({messages.length})
            </TabsTrigger>
            <TabsTrigger value="products">
              Товары ({products.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <OrdersTable
              orders={orders}
              isLoading={isLoading}
              onSelectOrder={setSelectedOrder}
            />
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <MessagesList
              messages={messages}
              isLoading={isLoading}
              onDeleteMessage={deleteMessage}
            />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <ProductsManager
              products={products}
              onUpdate={fetchData}
            />
          </TabsContent>
        </Tabs>
      </div>

      <OrderDetailsDialog
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={updateOrderStatus}
        onDelete={deleteOrder}
      />
    </div>
  );
}