import Icon from '@/components/ui/icon';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-wider">MISSION BY DARK</h3>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Навигация</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="#home" className="hover:text-foreground transition-colors">
                Главная
              </a>
              <a href="#catalog" className="hover:text-foreground transition-colors">
                Каталог
              </a>
              <a href="#about" className="hover:text-foreground transition-colors">
                О бренде
              </a>
              <a href="#contact" className="hover:text-foreground transition-colors">
                Контакты
              </a>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Информация</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Доставка и оплата
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Возврат товара
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Политика конфиденциальности
              </a>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Социальные сети</h4>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/missionbydark_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
              >
                <Icon name="Instagram" size={18} />
              </a>
              <a
                href="https://t.me/MissionByDark"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
              >
                <Icon name="Send" size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@missionbydark_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 MISSION BY DARK. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}