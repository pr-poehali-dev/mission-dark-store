import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface MessagesListProps {
  messages: ContactMessage[];
  isLoading: boolean;
  onDeleteMessage: (messageId: number) => void;
}

export default function MessagesList({ messages, isLoading, onDeleteMessage }: MessagesListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        Загрузка...
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        Сообщений пока нет
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {messages.map((message) => (
        <Card key={message.id} className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold">{message.name}</h3>
              <p className="text-sm text-muted-foreground">
                {message.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {formatDate(message.created_at)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteMessage(message.id)}
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          </div>
          <p className="text-sm">{message.message}</p>
        </Card>
      ))}
    </div>
  );
}
