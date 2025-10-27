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

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icon name="Mail" size={20} className="mt-1 text-accent" />
                  <div>
                    <div className="font-medium">Email</div>
                    <a
                      href="mailto:info@missionbydark.com"
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      info@missionbydark.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="Phone" size={20} className="mt-1 text-accent" />
                  <div>
                    <div className="font-medium">Телефон</div>
                    <a
                      href="tel:+79991234567"
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      +7 (999) 123-45-67
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="MapPin" size={20} className="mt-1 text-accent" />
                  <div>
                    <div className="font-medium">Адрес</div>
                    <p className="text-muted-foreground">
                      Москва, ул. Примерная, 1
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Icon name="Instagram" size={20} />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Icon name="Facebook" size={20} />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Icon name="Twitter" size={20} />
                </Button>
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
