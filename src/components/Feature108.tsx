import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Layout, Pointer, Zap } from "lucide-react";
import Image from "next/image";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
  benefit: string;
  roi: string;
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
  heading = "3 Formas Comprovadas de Aumentar Suas Vendas com IA",
  description = "Veja como empresas como a sua estão usando nossa IA para resolver problemas reais e gerar resultados em semanas, não meses.",
  tabs = [
    {
      value: "tab-1",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "Vendas",
      content: {
        badge: "Resultados em 30 dias",
        title: "Transforme 67% Mais Visitantes em Clientes Pagantes",
        description:
          "Pare de perder vendas por falta de atendimento. Nossa IA Vera qualifica leads, responde objeções e agenda reuniões automaticamente.",
        buttonText: "Ver Resultados",
        imageSrc:
          "https://vertify-public-assets.s3.us-east-2.amazonaws.com/website-assets/VENDAS%404x.png",
        imageAlt: "IA de vendas automatizada",
        benefit: "+340% em conversões",
        roi: "ROI médio: 1.200%",
      },
    },
    {
      value: "tab-2",
      icon: <Pointer className="h-auto w-4 shrink-0" />,
      label: "Suporte",
      content: {
        badge: "Redução de 85% nos custos",
        title: "Elimine Filas e Reduza 85% dos Custos de Suporte",
        description:
          "Chega de clientes irritados esperando atendimento. A Vera resolve 89% das dúvidas instantaneamente e escalona apenas casos complexos.",
        buttonText: "Calcular Economia",
        imageSrc:
          "https://vertify-public-assets.s3.us-east-2.amazonaws.com/website-assets/SUPORTE%404x.png",
        imageAlt: "Suporte automatizado com IA",
        benefit: "89% de resolução automática",
        roi: "Economia de tempo",
      },
    },
    {
      value: "tab-3",
      icon: <Layout className="h-auto w-4 shrink-0" />,
      label: "Equipes",
      content: {
        badge: "Produtividade 3x maior",
        title: "Multiplique a Produtividade da Sua Equipe por 3",
        description:
          "Pare de perder tempo com tarefas repetitivas. A Vera organiza, prioriza e distribui chamados automaticamente para o especialista certo.",
        buttonText: "Ver Cases",
        imageSrc:
          "https://vertify-public-assets.s3.us-east-2.amazonaws.com/website-assets/EQUIPE%404x.png",
        imageAlt: "Gestão de equipes com IA",
        benefit: "3x mais produtividade",
        roi: "78% menos retrabalho",
      },
    },
  ],
}: Feature108Props) => {
  return (
    <section className="py-20 sm:py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6" id="tab">
        <div className="flex flex-col items-center gap-3 sm:gap-4 text-center px-2 sm:px-0">
          {/* <Badge variant="outline">{badge}</Badge> */}
          <h1 className="max-w-2xl text-2xl sm:text-3xl font-bold md:text-4xl">
            {heading}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">{description}</p>
        </div>
        <Tabs defaultValue={tabs[0].value} className="mt-6 sm:mt-8 flex flex-col items-center">
          <TabsList className="rounded-lg w-fit container flex items-center justify-center gap-2 sm:gap-4 md:gap-10 bg-white-soft border border-white-warm shadow-white-soft overflow-x-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1 sm:gap-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-muted-foreground data-[state=active]:bg-white-pure data-[state=active]:text-primary data-[state=active]:shadow-white-soft hover-cool-blue whitespace-nowrap"
              >
                {tab.icon} <span className="hidden sm:inline">{tab.label}</span><span className="sm:hidden">{tab.label.charAt(0)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-6 sm:mt-8 max-w-screen-xl rounded-2xl bg-white-warm p-4 sm:p-6 lg:p-16 border border-white-warm shadow-white-elevated">
            {tabs.map((tab) => (
              <TabsContent
                id={tab.value}
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-8 sm:gap-12 lg:gap-20 lg:h-[500px] lg:grid-cols-2"
              >
                <div className="flex flex-col gap-4 sm:gap-6 order-2 lg:order-1">
                  {/* Badge de resultado */}
                  <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 w-fit">
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-green-800">
                      {tab.content.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold lg:text-4xl text-foreground">
                    {tab.content.title}
                  </h3>

                  <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
                    {tab.content.description}
                  </p>

                  {/* Métricas de resultado */}
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-2 sm:mt-4">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                      <div className="text-base sm:text-lg font-bold text-green-700">
                        {tab.content.benefit}
                      </div>
                      <div className="text-xs text-green-600">
                        resultado médio
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                      <div className="text-base sm:text-lg font-bold text-purple-700">
                        {tab.content.roi}
                      </div>
                      {/* <div className="text-xs text-purple-600">comprovado</div> */}
                    </div>
                  </div>

                  {/* CTA implícito */}
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white-warm">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      ✨ <strong>Quer resultados similares?</strong> Implemente
                      em 24h e veja os primeiros resultados em 30 dias.
                    </p>
                  </div>
                </div>

                <div className="relative order-1 lg:order-2 w-full max-w-md lg:max-w-none">
                  <Image
                    src={tab.content.imageSrc}
                    alt={tab.content.imageAlt}
                    width={500}
                    height={300}
                    className="rounded-2xl shadow-white-elevated bg-white-pure hover:scale-105 transition-transform duration-500 w-full h-auto"
                  />

                  {/* Overlay com benefício */}
                  <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 bg-gradient-to-r from-[#E97939] to-[#8A39DB] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-xl shadow-lg">
                    <div className="text-xs sm:text-sm font-bold">Resultado Real</div>
                    <div className="text-xs opacity-90">
                      {tab.content.benefit}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature108 };
