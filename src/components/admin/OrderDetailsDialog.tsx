import { Button } from '@/components/ui/button';
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
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: number;
  name: string;
  phone: string;
  email: string;
  telegram?: string;
  address: string;
  items: any[];
  total: number;
  status: string;
  created_at: string;
}

interface OrderDetailsDialogProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: number, newStatus: string) => void;
  onDelete: (orderId: number) => void;
}

export default function OrderDetailsDialog({
  order,
  onClose,
  onUpdateStatus,
  onDelete
}: OrderDetailsDialogProps) {
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyOrderData = () => {
    if (!order) return;
    
    const itemsList = order.items.map((item, idx) => 
      `${idx + 1}. ${item.name}${item.size ? ` (${item.size})` : ''} - ${item.quantity} шт. - ${(item.price * item.quantity).toLocaleString('ru-RU')} ₽`
    ).join('\n');
    
    const orderText = `Заказ #${order.id}

Клиент: ${order.name}
Телефон: ${order.phone}
Email: ${order.email}${order.telegram ? `\nTelegram: @${order.telegram}` : ''}

Адрес доставки:
${order.address}

Товары:
${itemsList}

Итого: ${order.total.toLocaleString('ru-RU')} ₽

Дата: ${formatDate(order.created_at)}
Статус: ${order.status === 'new' ? 'Новый' : order.status === 'processing' ? 'В обработке' : 'Выполнен'}`;
    
    navigator.clipboard.writeText(orderText).then(() => {
      toast({
        title: 'Скопировано',
        description: 'Данные заказа скопированы в буфер обмена'
      });
    }).catch(() => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось скопировать данные',
        variant: 'destructive'
      });
    });
  };

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Заказ #{order?.id}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyOrderData}
              >
                <Icon name="Copy" size={16} className="mr-2" />
                Скопировать
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => order && onDelete(order.id)}
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Удалить
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {order && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Клиент</div>
                  <div className="font-medium">{order.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Телефон</div>
                  <div className="font-medium">{order.phone}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Email</div>
                  <div className="font-medium break-all">{order.email}</div>
                </div>
                {order.telegram && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Telegram</div>
                    <div className="font-medium">@{order.telegram}</div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Дата</div>
                <div className="font-medium">{formatDate(order.created_at)}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Адрес доставки</div>
              <div className="font-medium">{order.address}</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-3">Статус заказа</div>
              <Select
                value={order.status}
                onValueChange={(value) => onUpdateStatus(order.id, value)}
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
                {order.items.map((item, index) => (
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
                <span>{order.total.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}