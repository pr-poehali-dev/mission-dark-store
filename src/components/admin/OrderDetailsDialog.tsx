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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Заказ #{order?.id}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => order && onDelete(order.id)}
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Удалить
            </Button>
          </DialogTitle>
        </DialogHeader>

        {order && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Клиент</div>
                <div className="font-medium">{order.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Телефон</div>
                <div className="font-medium">{order.phone}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Email</div>
                <div className="font-medium">{order.email}</div>
              </div>
              {order.telegram && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Telegram</div>
                  <div className="font-medium">@{order.telegram}</div>
                </div>
              )}
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