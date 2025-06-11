import {
    BatteryCharging,
    GitPullRequest,
    Layers,
    RadioTower,
    SquareKanban,
    WandSparkles,
  } from "lucide-react";
  
  interface Reason {
    title: string;
    description: string;
    icon: React.ReactNode;
  }
  
  interface Feature43Props {
    heading?: string;
    reasons?: Reason[];
  }
  
  const Feature43 = ({
    heading = "Tecnologia, eficiência e resultados: o que nos torna únicos?",
    reasons = [
      {
        title: "Atendimento Omnichannel",
        description:
          "Esteja presente onde seus clientes estão. Conecte-se via WhatsApp, e-mail, chat, Instagram, Messenger e muito mais, oferecendo um atendimento fluido e integrado.",
        icon: <GitPullRequest className="size-6" />,
      },
      {
        title: "Agente de Inteligência Artificial",
        description:
          "Automação inteligente em triagem, suporte e vendas. A Vera entende, responde e direciona atendimentos em tempo real, reduzindo chamados em espera e aumentando a eficiência da sua equipe.",
        icon: <SquareKanban className="size-6" />,
      },
      {
        title: "Implantação Rápida e Simples",
        description:
          "Comece a usar em minutos com integração intuitiva. Sem burocracia e sem complicações.",
        icon: <RadioTower className="size-6" />,
      },
      {
        title: "Suporte Especializado à Disposição",
        description:
          "Acompanhamento próximo e suporte humanizado. Nossa equipe está disponível para ajudar você a extrair o máximo da plataforma e manter sua operação sem interrupções.",
        icon: <WandSparkles className="size-6" />,
      },
      {
        title: "Escalabilidade para Crescer com Você",
        description:
          "Atenda qualquer volume de clientes sem perder qualidade. A Vera se adapta ao seu negócio, seja você um empreendedor individual ou uma grande operação.",
        icon: <Layers className="size-6" />,
      },
      {
        title: "Segurança e Privacidade em Cada Atendimento",
        description:
          "Proteção total dos seus dados. Seus atendimentos e informações são armazenados com criptografia avançada, garantindo conformidade com as melhores práticas do mercado.",
        icon: <BatteryCharging className="size-6" />,
      },
    ],
  }: Feature43Props) => {
    return (
      <section className="py-24 bg-gradient-to-b from-white-warm to-background flex justify-center">
        <div className="container px-4">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {heading}
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, i) => (
              <div 
                key={i} 
                className="elevated-1 p-8 rounded-2xl hover:elevated-2 transition-all duration-300 group"
              >
                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cool-blue-subtle to-cool-teal-subtle group-hover:scale-110 transition-transform duration-300">
                  <div className="text-primary">
                    {reason.icon}
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export { Feature43 };
  