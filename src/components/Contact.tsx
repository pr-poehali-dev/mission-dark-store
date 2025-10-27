import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12 text-center">
            Контакты
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Свяжитесь с нами</h3>
                <p className="text-muted-foreground">
                  Готовы ответить на все ваши вопросы о наших коллекциях, 
                  доставке и возможности индивидуального заказа.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <a
                  href="https://www.instagram.com/missionbydark_"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Icon name="Instagram" size={20} />
                  </Button>
                </a>
                <a
                  href="https://t.me/MissionByDark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Icon name="Send" size={20} />
                  </Button>
                </a>
                <a
                  href="https://www.tiktok.com/@missionbydark_"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="icon" className="rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                  </Button>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <Input placeholder="Ваше имя" />
              <Input type="email" placeholder="Email" />
              <Textarea placeholder="Сообщение" rows={6} />
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Отправить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}