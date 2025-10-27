import { useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';

interface CatalogProps {
  products: Product[];
  onAddToCart: (product: Product, size: string) => void;
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
}

export default function Catalog({
  products,
  onAddToCart,
  favorites,
  onToggleFavorite,
}: CatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section id="catalog" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Коллекция</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Уникальные вещи, созданные для тех, кто ценит качество и стиль
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : ''
              }
            >
              {category === 'all' ? 'Всё' : category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.includes(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
