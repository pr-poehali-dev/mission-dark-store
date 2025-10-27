import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
            MISSION BY DARK
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Авангардная мода для тех, кто не боится выделяться. 
            Минимализм, качество, индивидуальность.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Смотреть коллекцию
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-secondary font-medium"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              О бренде
            </Button>
          </div>

          <div className="pt-12 grid grid-cols-3 gap-8 max-w-xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold">2024</div>
              <div className="text-sm text-muted-foreground">Год основания</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground">Качество</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">∞</div>
              <div className="text-sm text-muted-foreground">Стиль</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
