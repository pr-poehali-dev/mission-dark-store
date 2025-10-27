import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
}

export default function AdminHeader({ onRefresh, onLogout }: AdminHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <h1 className="text-2xl font-bold">Админ-панель</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={onRefresh} variant="outline" size="sm">
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Обновить
            </Button>
            <Button onClick={onLogout} variant="ghost" size="sm">
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
