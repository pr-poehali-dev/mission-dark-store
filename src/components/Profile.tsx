import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Order, Product } from '@/types/product';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  favorites: string[];
  allProducts: Product[];
  onToggleFavorite: (productId: string) => void;
}

export default function Profile({
  isOpen,
  onClose,
  orders,
  favorites,
  allProducts,
  onToggleFavorite,
}: ProfileProps) {
  const favoriteProducts = allProducts.filter((p) => favorites.includes(p.id));

  const getStatusBadge = (status: Order['status']) => {
    const variants = {
      processing: { label: 'В обработке', variant: 'secondary' as const },
      shipped: { label: 'Отправлен', variant: 'default' as const },
      delivered: { label: 'Доставлен', variant: 'outline' as const },
    };
    return variants[status];
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">Личный кабинет</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="orders" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">История заказов</TabsTrigger>
            <TabsTrigger value="favorites">Избранное</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4 mt-4">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Icon name="Package" size={64} className="text-muted-foreground" />
                <p className="text-muted-foreground">Нет заказов</p>
              </div>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">Заказ #{order.id}</div>
                      <div className="text-sm text-muted-foreground">{order.date}</div>
                    </div>
                    <Badge variant={getStatusBadge(order.status).variant}>
                      {getStatusBadge(order.status).label}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={`${item.id}-${item.size}`}
                        className="flex gap-3 text-sm"
                      >
                        <div className="w-12 h-16 rounded overflow-hidden bg-secondary flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-muted-foreground">
                            {item.size} × {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>Итого:</span>
                    <span>{order.total.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4 mt-4">
            {favoriteProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Icon name="Heart" size={64} className="text-muted-foreground" />
                <p className="text-muted-foreground">Нет избранных товаров</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {favoriteProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden group">
                    <div className="relative aspect-[3/4] bg-secondary">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => onToggleFavorite(product.id)}
                        className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur rounded-full hover:bg-background transition-colors"
                      >
                        <Icon
                          name="Heart"
                          size={16}
                          className="fill-accent text-accent"
                        />
                      </button>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="font-medium text-sm line-clamp-1">
                        {product.name}
                      </div>
                      <div className="font-semibold">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
