import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Layout, Pointer, Zap } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

interface Feature108Props {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

const Feature108 = ({
  // badge = "shadcnblocks.com",
  heading = "Gerencie Todos os Seus Canais de Atendimento com IA em Minutos",
  description = "Automatize conversas com IA, conecte-se com clientes nos principais canais e implemente tudo em poucos minutos.",
  tabs = [
    {
      value: "tab-1",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "Vendas",
      content: {
        badge: "Modern Tactics",
        title: "Automatize Sua Prospecção e Qualifique Leads",
        description:
          "Nossa IA inteligente identifica, qualifica e interage com leads 24h por dia, garantindo um funil de vendas mais aquecido e eficiente. Aumente suas conversões enquanto sua equipe foca no que realmente importa: fechar negócios.",
        buttonText: "See Plans",
        imageSrc:
          "https://vertify-public-assets.s3.us-east-2.amazonaws.com/website-assets/VENDAS%404x.png",
        imageAlt: "placeholder",
      },
    },
    {
      value: "tab-2",
      icon: <Pointer className="h-auto w-4 shrink-0" />,
      label: "Suporte",
      content: {
        badge: "Expert Features",
        title: "Reduza o Tempo de Espera e Aumente a Eficiência",
        description:
          "Ofereça suporte instantâneo e humanizado com a Vera. Ela responde dúvidas, resolve solicitações e direciona atendimentos complexos para a equipe certa – tudo isso 24h por dia, sem filas e sem custos extras.",
        buttonText: "See Tools",
        imageSrc:
          "https://vertify-public-assets.s3.us-east-2.amazonaws.com/website-assets/SUPORTE%404x.png",
        imageAlt: "placeholder",
      },
    },
    {
      value: "tab-3",
      icon: <Layout className="h-auto w-4 shrink-0" />,
      label: "Equipes",
      content: {
        badge: "Elite Solutions",
        title: "Facilite a Comunicação e Aumente a Produtividade",
        description:
          "A Vera organiza e direciona chamados automaticamente para a equipe mais qualificada, otimizando o fluxo de trabalho. Crie equipes, restrinja acessos e reduza ruídos na comunicação, garantindo mais eficiência e segurança na troca de informações.",
        buttonText: "See Options",
        imageSrc:
          "https://vertify-public-assets.s3.us-east-2.amazonaws.com/website-assets/EQUIPE%404x.png",
        imageAlt: "placeholder",
      },
    },
  ],
}: Feature108Props) => {
  return (
    <section className="pt-32">
      <div className="container mx-auto" id="tab">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* <Badge variant="outline">{badge}</Badge> */}
          <h1 className="max-w-2xl text-3xl font-bold md:text-4xl">
            {heading}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Tabs defaultValue={tabs[0].value} className="mt-8">
          <TabsList className="container flex items-center justify-center gap-4 md:gap-10">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-8 max-w-screen-xl rounded-2xl bg-muted/70 p-6 lg:p-16">
            {tabs.map((tab) => (
              <TabsContent
                id={tab.value}
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-20 lg:h-[500px] lg:grid-cols-2 lg:gap-10"
              >
                <div className="flex flex-col gap-5">
                  {/* <Badge variant="outline" className="w-fit bg-background">
                    {tab.content.badge}
                  </Badge> */}
                  <h3 className="text-3xl font-semibold lg:text-5xl">
                    {tab.content.title}
                  </h3>
                  <p className="text-muted-foreground lg:text-lg">
                    {tab.content.description}
                  </p>
                  {/* <Button className="mt-2.5 w-fit gap-2" size="lg">
                    {tab.content.buttonText}
                  </Button> */}
                </div>
                <img
                  src={tab.content.imageSrc}
                  alt={tab.content.imageAlt}
                  className="rounded-xl"
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature108 };
