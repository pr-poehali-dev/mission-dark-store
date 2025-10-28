import { useState, useEffect } from 'react';
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





export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch('https://functions.poehali.dev/c6e2bd06-d47b-4b91-844f-57e0cfe14b09', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'page_view',
            event_data: { page: window.location.pathname }
          })
        });
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };
    
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/af963a7f-06b4-41da-a8ed-362903dc16bb');
        const data = await response.json();
        
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    
    trackPageView();
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product, size: string) => {
    const trackAddToCart = async () => {
      try {
        await fetch('https://functions.poehali.dev/c6e2bd06-d47b-4b91-844f-57e0cfe14b09', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'add_to_cart',
            event_data: { product_id: product.id, product_name: product.name }
          })
        });
      } catch (error) {
        console.error('Failed to track add to cart:', error);
      }
    };
    
    trackAddToCart();
    
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
        products={products.filter(p => p.inStock !== false)}
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