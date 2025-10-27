import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Catalog from '@/components/Catalog';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import Profile from '@/components/Profile';
import { Product, CartItem, Order } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Minimalist Black Coat',
    price: 24900,
    image: 'https://cdn.poehali.dev/projects/8069f5ba-26f8-4d37-8aae-6274fa4d9ce1/files/7100c060-2894-4d2f-8470-934e84b6f65f.jpg',
    category: 'Верхняя одежда',
    description: 'Классическое пальто из премиального шерстяного материала с минималистичным дизайном',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '2',
    name: 'Oversized Hoodie',
    price: 12900,
    image: 'https://cdn.poehali.dev/projects/8069f5ba-26f8-4d37-8aae-6274fa4d9ce1/files/1db16ed7-9533-48d4-b7fe-4e77d0721b1d.jpg',
    category: 'Толстовки',
    description: 'Оверсайз худи из плотного хлопка с графичными элементами',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: '3',
    name: 'Cargo Pants',
    price: 15900,
    image: 'https://cdn.poehali.dev/projects/8069f5ba-26f8-4d37-8aae-6274fa4d9ce1/files/dbff6786-56a8-4167-8719-de998cbec1f4.jpg',
    category: 'Брюки',
    description: 'Технологичные карго из водоотталкивающей ткани с функциональными карманами',
    sizes: ['28', '30', '32', '34', '36'],
  },
  {
    id: '4',
    name: 'Technical Jacket',
    price: 32900,
    image: 'https://cdn.poehali.dev/projects/8069f5ba-26f8-4d37-8aae-6274fa4d9ce1/files/7100c060-2894-4d2f-8470-934e84b6f65f.jpg',
    category: 'Верхняя одежда',
    description: 'Футуристичная куртка с техническими деталями и водонепроницаемой мембраной',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '5',
    name: 'Basic Tee',
    price: 5900,
    image: 'https://cdn.poehali.dev/projects/8069f5ba-26f8-4d37-8aae-6274fa4d9ce1/files/1db16ed7-9533-48d4-b7fe-4e77d0721b1d.jpg',
    category: 'Футболки',
    description: 'Базовая футболка из органического хлопка премиум качества',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: '6',
    name: 'Wide Pants',
    price: 17900,
    image: 'https://cdn.poehali.dev/projects/8069f5ba-26f8-4d37-8aae-6274fa4d9ce1/files/dbff6786-56a8-4167-8719-de998cbec1f4.jpg',
    category: 'Брюки',
    description: 'Широкие брюки свободного кроя из натуральной шерсти',
    sizes: ['28', '30', '32', '34', '36'],
  },
];

const mockOrders: Order[] = [
  {
    id: '001234',
    date: '15.10.2024',
    items: [
      {
        ...mockProducts[0],
        quantity: 1,
        size: 'M',
      },
    ],
    total: 24900,
    status: 'delivered',
  },
  {
    id: '001235',
    date: '20.10.2024',
    items: [
      {
        ...mockProducts[1],
        quantity: 2,
        size: 'L',
      },
    ],
    total: 25800,
    status: 'shipped',
  },
];

export default function Index() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = (product: Product, size: string) => {
    const existingItem = cartItems.find(
      (item) => item.id === product.id && item.size === size
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1, size }]);
    }

    toast({
      title: 'Добавлено в корзину',
      description: `${product.name} (${size})`,
    });
  };

  const handleUpdateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id, size);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string, size: string) => {
    setCartItems(cartItems.filter((item) => !(item.id === id && item.size === size)));
    toast({
      title: 'Удалено из корзины',
      variant: 'destructive',
    });
  };

  const handleToggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartOpen={() => setIsCartOpen(true)}
        onProfileOpen={() => setIsProfileOpen(true)}
      />

      <Hero />

      <Catalog
        products={mockProducts}
        onAddToCart={handleAddToCart}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      <About />

      <Contact />

      <Footer />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <Profile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        orders={mockOrders}
        favorites={favorites}
        allProducts={mockProducts}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}
