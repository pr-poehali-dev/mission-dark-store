import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/f1b7ce7b-2c2f-4c89-a900-04a965ca2175', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', password })
      });

      const data = await response.json();

      if (data.valid) {
        sessionStorage.setItem('admin_auth', 'true');
        onLoginSuccess();
      } else {
        toast({
          title: 'Ошибка',
          description: 'Неверный пароль',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось войти',
        variant: 'destructive'
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Icon name="Lock" size={48} className="mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold">Админ-панель</h1>
          <p className="text-muted-foreground mt-2">Введите пароль для входа</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isAuthLoading}
            className="text-center"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={!password || isAuthLoading}
          >
            {isAuthLoading ? 'Проверка...' : 'Войти'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => navigate('/')}
          >
            Вернуться на сайт
          </Button>
        </form>
      </Card>
    </div>
  );
}
