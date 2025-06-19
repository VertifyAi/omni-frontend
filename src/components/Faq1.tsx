import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  interface FaqItem {
    question: string;
    answer: string;
  }
  
  interface Faq1Props {
    heading?: string;
    items?: FaqItem[];
  }
  
  const Faq1 = ({
    heading = "Perguntas Frequentes",
    items = [
      {
        question: "O que é a Vertify?",
        answer:
          "A Vertify é uma plataforma omnichannel que utiliza inteligência artificial para escalar o atendimento ao cliente. Nossa assistente virtual, a Vera, interage diretamente com seus clientes para otimizar vendas, suporte e relacionamento.",
      },
      {
        question: "Como funciona o atendimento inteligente com a Vera?",
        answer:
          "A Vera é treinada para compreender o contexto das mensagens, identificar a necessidade dos clientes e direcionar atendimentos para a equipe responsável.",
      },
      {
        question: "Preciso de conhecimentos técnicos para usar a plataforma?",
        answer:
          "Não! A Vertify é simples e intuitiva. Basta criar sua conta, conectar seus canais preferidos e definir a maneira como a Vera se comunicará com seus clientes.",
      },
      {
        question: "Quais canais a Vertify e a Vera suportam atualmente?",
        answer:
          "Atualmente, oferecemos integração direta com WhatsApp e, em breve, você poderá vincular ao Instagram, Facebook Messenger, Telegram, E-mail e Webchat.",
      },
      {
        question: "Posso gerenciar equipes internas e controlar o acesso às informações?",
        answer:
          "Sim! Você pode organizar sua equipe em grupos específicos, criando acessos restritos por departamento ou função. Além disso, oferecemos um chat interno exclusivo para colaboradores, facilitando a comunicação da equipe.",
      },
      {
        question: "A Vera realiza atendimentos 24h sem custo adicional?",
        answer:
          "Sim, a Vera atende seus clientes 24 horas por dia, 7 dias por semana, sem custos extras. Assim, você garante que ninguém fique sem resposta, mesmo fora do horário comercial.",
      },
      {
        question: "Como acompanho o desempenho e os atendimentos feitos pela Vera?",
        answer:
          "Através da dashboard Vertify, você visualiza métricas detalhadas, acompanha o desempenho em tempo real e tem insights valiosos para aprimorar ainda mais seu atendimento.",
      },
      {
        question: "Como posso começar a usar a Vertify?",
        answer:
          "Basta criar sua conta agora mesmo e vincular seus canais de atendimento. Em poucos minutos, você já terá a Vera pronta para atender seus clientes com eficiência.",
      },
      {
        question: "Como faço para testar uma assinatura? Posso cancelar depois?",
        answer:
          "Ao contratar qualquer assinatura, você tem 30 dias para testar e avaliar o serviço. Caso a Vertify não atenda suas expectativas nesse período, você pode cancelar e receberá integralmente o valor pago.",
      },
    ],
  }: Faq1Props) => {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-background to-white-soft flex justify-center">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent px-2 sm:px-0">
              {heading}
            </h2>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {items.map((item, index) => (
              <div key={index} className="elevated-1 rounded-2xl overflow-hidden">
                <Accordion type="single" collapsible>
                  <AccordionItem value={`item-${index}`} className="border-0">
                    <AccordionTrigger className="hover:text-primary hover:no-underline px-4 sm:px-6 md:px-8 py-4 sm:py-6 text-left font-semibold text-base sm:text-lg">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export { Faq1 };
  