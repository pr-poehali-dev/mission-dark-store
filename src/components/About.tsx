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
              <span className="text-foreground font-semibold">MISSION BY DARK</span> — это не просто одежда. 
              Это философия свободы самовыражения через минимализм и качество.
            </p>

            <p>
              Мы создаём вещи для тех, кто не боится быть собой. Каждая коллекция — это исследование 
              границ между классикой и авангардом, между формой и функцией.
            </p>

            <p>
              Наша миссия — доказать, что настоящий стиль не нуждается в компромиссах. 
              Мы используем только премиальные материалы и работаем с мастерами своего дела.
            </p>

            <div className="grid md:grid-cols-3 gap-8 pt-12">
              <div className="space-y-3 text-center">
                <div className="text-3xl font-bold text-foreground">Качество</div>
                <p className="text-sm">
                  Только лучшие материалы и безупречное исполнение
                </p>
              </div>

              <div className="space-y-3 text-center">
                <div className="text-3xl font-bold text-foreground">Минимализм</div>
                <p className="text-sm">
                  Ничего лишнего, только суть и функциональность
                </p>
              </div>

              <div className="space-y-3 text-center">
                <div className="text-3xl font-bold text-foreground">Индивидуальность</div>
                <p className="text-sm">
                  Каждая вещь подчёркивает уникальность владельца
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
