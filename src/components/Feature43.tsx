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
      <section className="py-32 flex justify-center items-center">
        <div className="container">
          <div className="mb-10 md:mb-20">
            <h2 className="mb-2 text-center text-3xl font-bold lg:text-4xl">
              {heading}
            </h2>
          </div>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, i) => (
              <div key={i} className="flex flex-col">
                <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-accent">
                  {reason.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export { Feature43 };
  