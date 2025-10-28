import { useState } from 'react';
import { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ProductsManagerProps {
  products: Product[];
  onUpdate: () => void;
}

export default function ProductsManager({ products, onUpdate }: ProductsManagerProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const { toast } = useToast();

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      sizes: product.sizes,
      image: product.image,
      inStock: product.inStock !== false
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Ошибка',
        description: 'Файл слишком большой (макс. 5МБ)',
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    try {
      const response = await fetch('https://functions.poehali.dev/f1b7ce7b-2c2f-4c89-a900-04a965ca2175', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_product',
          id: editingProduct.id,
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Готово',
          description: 'Товар обновлен'
        });
        setEditingProduct(null);
        onUpdate();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить товар',
        variant: 'destructive'
      });
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({});
  };

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">{product.name}</span>
              {editingProduct?.id === product.id ? (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm">
                    <Icon name="Check" size={16} />
                    Сохранить
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    Отмена
                  </Button>
                </div>
              ) : (
                <Button onClick={() => handleEdit(product)} variant="outline" size="sm">
                  <Icon name="Pencil" size={16} />
                  Редактировать
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingProduct?.id === product.id ? (
              <div className="space-y-4">
                <div>
                  <Label>Главное фото</Label>
                  <div className="space-y-2">
                    {formData.image && (
                      <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-md" />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <p className="text-xs text-muted-foreground">Макс. размер: 5МБ. Форматы: JPG, PNG, WebP</p>
                  </div>
                </div>
                <div>
                  <Label>Название</Label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Цена (₽)</Label>
                  <Input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.inStock !== false}
                    onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                  />
                  <Label>В наличии</Label>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
                </div>
                <div className="space-y-2">
                  <div>
                    <Label className="text-muted-foreground">Цена</Label>
                    <p className="text-lg font-semibold">{product.price.toLocaleString('ru-RU')} ₽</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Статус</Label>
                    <p className={product.inStock !== false ? 'text-green-600' : 'text-red-600'}>
                      {product.inStock !== false ? 'В наличии' : 'Нет в наличии'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Размеры</Label>
                    <p>{product.sizes.join(', ')}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Описание</Label>
                    <p className="text-sm line-clamp-3">{product.description}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}