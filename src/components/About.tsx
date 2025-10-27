export default function About() {
  return (
    <section id="about" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-center">
            О бренде
          </h2>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              <span className="text-foreground font-semibold">MISSION BY DARK</span> — это не просто дизайнерская одежда. 
              Это новая страничка истории.
            </p>

            <p>
              Наша цель - показать всем, что большие бренды бывают не только на западе.
            </p>

            <p>
              Каждая ниточка - это часть нашей с вами работы.
            </p>

            <p className="text-lg font-medium text-foreground">
              Вместе мы способны на всё!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}