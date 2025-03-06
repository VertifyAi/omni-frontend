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
    heading = "Por que confiar em nós?",
    reasons = [
      {
        title: "Atendimento Omnichannel",
        description:
          "Conecte-se com seus clientes em múltiplos canais (WhatsApp, e-mail, chat e mais) de forma integrada, garantindo uma experiência fluida e personalizada.",
        icon: <GitPullRequest className="size-6" />,
      },
      {
        title: "Agentes de Inteligência Artificial",
        description:
          "Automação inteligente para triagem, suporte e vendas, reduzindo custos e aumentando a eficiência do seu atendimento.",
        icon: <SquareKanban className="size-6" />,
      },
      {
        title: "Implantação Rápida e Simples",
        description:
          "Assine, configure e comece a usar em minutos! Sem burocracia, sem complicação – apenas resultados imediatos.",
        icon: <RadioTower className="size-6" />,
      },
      {
        title: "Suporte Especializado à Disposição",
        description:
          "Nossa equipe está pronta para ajudar você a extrair o máximo da plataforma, garantindo uma operação sem interrupções.",
        icon: <WandSparkles className="size-6" />,
      },
      {
        title: "Escalabilidade para Crescer com Você",
        description:
          "Desde pequenas empresas a grandes operações, nossa solução se adapta ao seu volume de atendimentos sem perder eficiência.",
        icon: <Layers className="size-6" />,
      },
      {
        title: "Segurança em Cada Atendimento",
        description:
          "Seus dados e interações protegidos com tecnologia de ponta, garantindo privacidade e conformidade com as melhores práticas do mercado.",
        icon: <BatteryCharging className="size-6" />,
      },
    ],
  }: Feature43Props) => {
    return (
      <section className="pt-32 flex justify-center items-center">
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
  