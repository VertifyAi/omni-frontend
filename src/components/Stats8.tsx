// import { ArrowRight } from "lucide-react";

interface Stats8Props {
  heading?: string;
  description?: string;
  link?: {
    text: string;
    url: string;
  };
  stats?: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

const Stats8 = ({
  heading = "Por Que As Empresas Confiam em Nossa IA?",
  description = "Dados reais de empresas que transformaram seu atendimento e aumentaram significativamente suas vendas com automação inteligente.",
  // link = {
  //   text: "Leia o relatório completo de impacto",
  //   url: "https://www.shadcnblocks.com",
  // },
  stats = [
    {
      id: "stat-1",
      value: "67%",
      label: "dos leads são perdidos fora do horário comercial. Nossa IA trabalha 24/7 para você não perder nenhum.",
    },
    {
      id: "stat-2",
      value: "340%",
      label: "de aumento médio em conversões após implementar nossa solução de IA no primeiro trimestre.",
    },
    {
      id: "stat-3",
      value: "R$ 850k",
      label: "é a receita extra média gerada por nossos clientes no primeiro ano de uso da plataforma.",
    },
    {
      id: "stat-4",
      value: "3 seg",
      label: "tempo médio de resposta da nossa IA, enquanto humanos levam em média 12 minutos.",
    }
  ],
}: Stats8Props) => {
  return (
    <section className="py-24 bg-gradient-to-b from-white-soft to-white-warm flex justify-center">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {heading}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className="elevated-1 p-8 rounded-2xl text-center hover:elevated-2 transition-all duration-300 group"
            >
              <div className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-cool-teal bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <p className="text-muted-foreground leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {/* Testimonial Integrado */}
        {/* <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto p-8 bg-white/70 backdrop-blur-sm rounded-3xl border border-white-warm shadow-white-soft">
            <p className="text-lg text-muted-foreground italic mb-4">
              &ldquo;Implementamos a Vera em 3 lojas e em 60 dias tivemos R$ 240.000 a mais em vendas. 
              O ROI foi de 1.200% no primeiro trimestre.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#E97939] to-[#8A39DB] rounded-full flex items-center justify-center text-white font-bold text-sm">
                MR
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Maria Rodriguez</p>
                <p className="text-sm text-muted-foreground">Diretora Comercial, GrupoVarejo</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export { Stats8 };
