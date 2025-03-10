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
          "Ao contratar qualquer assinatura, você tem 7 dias para testar e avaliar o serviço. Caso a Vertify não atenda suas expectativas nesse período, você pode cancelar e receberá integralmente o valor pago.",
      },
    ],
  }: Faq1Props) => {
    return (
      <section className="pt-32 flex justify-center items-center">
        <div className="container">
          <h1 className="mb-4 text-3xl font-semibold md:mb-11 md:text-4xl">
            {heading}
          </h1>
          {items.map((item, index) => (
            <Accordion key={index} type="single" collapsible>
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className="hover:text-foreground/60 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </section>
    );
  };
  
  export { Faq1 };
  