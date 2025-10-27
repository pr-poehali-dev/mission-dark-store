import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Catalog from '@/components/Catalog';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import Checkout from '@/components/Checkout';
import { Product, CartItem } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'WINDBREAKER BASE IN BLACK «КАКУЛЕШИКОРЕША»',
    price: 4500,
    image: 'https://cdn.poehali.dev/files/035cfbfa-1525-469b-9300-55c518933125.png',
    images: [
      'https://cdn.poehali.dev/files/035cfbfa-1525-469b-9300-55c518933125.png',
      'https://cdn.poehali.dev/files/81640857-ba19-41eb-80ea-01f20aab9eb9.png'
    ],
    category: 'Куртки',
    description: 'Легкая ветровка из технологичной ткани с защитой от ветра и влаги. Минималистичный дизайн в фирменном стиле Mission By Dark. Состав: 50% нейлон, 50% полиэстер. Изделие может отличаться от фото.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '2',
    name: 'BOMBER JACKET BASE IN BLACK «КАКУЛЕШИКОРЕША»',
    price: 4900,
    image: 'https://cdn.poehali.dev/files/bea965ae-1e12-4730-9ab9-89520e1c8e35.png',
    images: [
      'https://cdn.poehali.dev/files/bea965ae-1e12-4730-9ab9-89520e1c8e35.png',
      'https://cdn.poehali.dev/files/feaa756c-1975-4396-b416-be9ffd539572.png'
    ],
    category: 'Куртки',
    description: 'Классический бомбер с современной интерпретацией. Плотная ткань, эргономичный крой. Состав: 50% нейлон, 50% полиэстер. Изделие может отличаться от фото.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
];



export default function Index() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
    toast({
      title: 'Заказ успешно оформлен!',
      description: 'Мы свяжемся с вами в ближайшее время',
    });
  };

  return (
    <div className="min-h-screen">
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartOpen={() => setIsCartOpen(true)}
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
        onCheckout={handleCheckout}
      />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        total={cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
        onSuccess={handleCheckoutSuccess}
      />


    </div>
  );
}