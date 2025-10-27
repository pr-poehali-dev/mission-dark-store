import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
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
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string) => void;
  onToggleFavorite: (productId: string) => void;
  isFavorite: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}: ProductCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');

  const handleAddToCart = () => {
    if (selectedSize) {
      onAddToCart(product, selectedSize);
      setIsOpen(false);
      setSelectedSize('');
    }
  };

  return (
    <>
      <Card className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/80 backdrop-blur hover:bg-background"
            onClick={() => onToggleFavorite(product.id)}
          >
            <Icon
              name={isFavorite ? 'Heart' : 'Heart'}
              size={20}
              className={isFavorite ? 'fill-accent text-accent' : ''}
            />
          </Button>

          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setIsOpen(true)}
            >
              Добавить в корзину
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">
            {product.category}
          </div>
          <h3 className="font-medium">{product.name}</h3>
          <div className="text-lg font-semibold">{product.price.toLocaleString('ru-RU')} ₽</div>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="aspect-[3/4] relative overflow-hidden rounded bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-sm text-muted-foreground">{product.description}</p>

            <div className="space-y-2">
              <label className="text-sm font-medium">Размер</label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите размер" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-2xl font-semibold">
                {product.price.toLocaleString('ru-RU')} ₽
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Добавить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
