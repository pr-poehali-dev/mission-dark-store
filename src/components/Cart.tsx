import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { CartItem } from '@/types/product';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, size: string, quantity: number) => void;
  onRemoveItem: (id: string, size: string) => void;
  onCheckout: () => void;
}

export default function Cart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl">Корзина</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <Icon name="ShoppingBag" size={64} className="text-muted-foreground" />
            <p className="text-muted-foreground">Корзина пуста</p>
          </div>
        ) : (
          <div className="flex flex-col h-full pt-6">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 pb-4 border-b border-border"
                >
                  <div className="w-24 h-32 flex-shrink-0 rounded overflow-hidden bg-secondary">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Размер: {item.size}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id, item.size)}
                        className="h-8 w-8"
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-border rounded">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.size, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Icon name="Minus" size={14} />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.size, item.quantity + 1)
                          }
                        >
                          <Icon name="Plus" size={14} />
                        </Button>
                      </div>

                      <div className="font-semibold">
                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <Separator />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Итого:</span>
                <span>{total.toLocaleString('ru-RU')} ₽</span>
              </div>

              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                onClick={onCheckout}
              >
                Оформить заказ
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}