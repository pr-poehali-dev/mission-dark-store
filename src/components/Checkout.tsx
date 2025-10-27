import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CartItem } from '@/types/product';
import Icon from '@/components/ui/icon';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onSuccess: () => void;
}

export default function Checkout({ isOpen, onClose, items, total, onSuccess }: CheckoutProps) {
  const [step, setStep] = useState<'info' | 'delivery' | 'payment' | 'success'>('info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    deliveryMethod: 'courier',
    paymentMethod: 'card',
  });

  const deliveryPrice = 0;
  const finalTotal = total;

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep = () => {
    if (step === 'info') {
      return formData.name && formData.email && formData.phone;
    }
    if (step === 'delivery') {
      return formData.city && formData.address;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (step === 'info') setStep('delivery');
    else if (step === 'delivery') setStep('payment');
    else if (step === 'payment') {
      const orderData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: `${formData.city}, ${formData.address}`,
        items: items,
        total: finalTotal
      };

      try {
        const response = await fetch('https://functions.poehali.dev/ae5e4f87-c31c-4abe-a06d-7f2cd6f34000', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        });

        if (response.ok) {
          setStep('success');
          setTimeout(() => {
            onSuccess();
            onClose();
            setStep('info');
            setFormData({
              name: '',
              email: '',
              phone: '',
              city: '',
              address: '',
              deliveryMethod: 'courier',
              paymentMethod: 'card',
            });
          }, 3000);
        }
      } catch (error) {
        console.error('Order submission failed:', error);
      }
    }
  };

  const handleBack = () => {
    if (step === 'delivery') setStep('info');
    else if (step === 'payment') setStep('delivery');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Оформление заказа</DialogTitle>
        </DialogHeader>

        {step === 'success' ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <Icon name="Check" size={32} className="text-accent" />
            </div>
            <h3 className="text-2xl font-semibold">Заказ оформлен!</h3>
            <p className="text-muted-foreground text-center">
              Мы отправили подтверждение на {formData.email}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step === 'info' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}
              >
                1
              </div>
              <div className="w-12 h-0.5 bg-border" />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step === 'delivery' || step === 'payment'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary'
                }`}
              >
                2
              </div>
              <div className="w-12 h-0.5 bg-border" />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}
              >
                3
              </div>
            </div>

            {step === 'info' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Контактная информация</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Имя и фамилия</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Иван Иванов"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="ivan@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>
            )}

            {step === 'delivery' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Доставка</h3>

                <div className="p-4 border border-border rounded bg-secondary/20">
                  <div className="flex items-center gap-2">
                    <Icon name="Truck" size={20} className="text-accent" />
                    <div>
                      <div className="font-medium">Курьерская доставка</div>
                      <div className="text-sm text-muted-foreground">Бесплатно</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Город</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Москва"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Адрес</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="ул. Примерная, д. 1, кв. 10"
                  />
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Оплата</h3>

                <div className="space-y-2">
                  <Label>Способ оплаты</Label>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <div className="flex items-center space-x-2 border border-border rounded p-3">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="font-medium">Банковская карта</div>
                        <div className="text-sm text-muted-foreground">Visa, Mastercard, МИР</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border border-border rounded p-3">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="font-medium">Наличные при получении</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Ваш заказ</h4>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={`${item.id}-${item.size}`}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {item.name} ({item.size}) × {item.quantity}
                        </span>
                        <span>{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Доставка</span>
                    <span>{deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice} ₽`}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Итого</span>
                    <span>{finalTotal.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {step !== 'info' && (
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Назад
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!validateStep()}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {step === 'payment' ? 'Оформить заказ' : 'Далее'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}