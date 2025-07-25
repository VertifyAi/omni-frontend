// import { ArrowRight } from "lucide-react";

import { Button } from "./ui/button";

interface Stats8Props {
  heading?: string;
  description?: string;
  link?: {
    text: string;
    url: string;
  };
  stats?: Array<{
    id: string;
    // value: string;
    label: string;
  }>;
}

const Stats8 = ({
  heading = "Seus clientes estão no WhatsApp, Instagram, Facebook… mas sua equipe se perde entre abas, mensagens não respondidas e históricos desconectados?",
  // description = "Dados reais de empresas que transformaram seu atendimento e aumentaram significativamente suas vendas com automação inteligente.",
  // link = {
  //   text: "Leia o relatório completo de impacto",
  //   url: "https://www.shadcnblocks.com",
  // },
  stats = [
    {
      id: "stat-1",
      // value: "67%",
      label: "Vendas perdidas por respostas tardias",
    },
    {
      id: "stat-2",
      // value: "340%",
      label: "Clientes frustrados repetindo problemas",
    },
    {
      id: "stat-3",
      // value: "R$ 850k",
      label: "Talentos desperdiçados com tarefas operacionais",
    },
    {
      id: "stat-4",
      // value: "3 seg",
      label: "Custos crescentes e processos ineficientes",
    }
  ],
}: Stats8Props) => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white-soft to-white-warm flex justify-center">
      <div className="container px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent px-2 sm:px-0">
            {heading}
          </h2>
          {/* <p className="text-base sm:text-lg text-muted-foreground leading-relaxed px-2 sm:px-0">{description}</p> */}
        </div>
        
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className="elevated-1 p-6 sm:p-8 rounded-2xl text-center hover:elevated-2 transition-all duration-300 group"
            >
              {/* <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-cool-teal bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300"> */}
                {/* {stat.value} */}
              {/* </div> */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </div>

                    {/* CTA Button - AÇÃO */}
                    <div className="mb-6 sm:mb-8 px-4 sm:px-0 text-center mt-12 sm:mt-16">
              <Button
                asChild
                size="lg"
                className="gradient-brand text-white hover:from-primary/90 hover:to-cool-teal/90 px-6 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg border-0 w-full sm:w-auto"
              >
                <a href="/sign-up">Acesse gratuitamente por 30 dias</a>
              </Button>
              <p className="text-xs sm:text-sm text-muted-foreground mt-3 px-2 sm:px-0">
                🔒 Teste sem compromisso • Cancele a qualquer momento • Suporte em português
              </p>
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
