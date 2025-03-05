import { ArrowRight } from "lucide-react";

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
  heading = "Impacto da Automação Inteligente",
  description = "Garantimos estabilidade e escalabilidade para todos os usuários",
  link = {
    text: "Leia o relatório completo de impacto",
    url: "https://www.shadcnblocks.com",
  },
  stats = [
    {
      id: "stat-1",
      value: "74%+",
      label: "Utilizam IA regularmente em suas operações diárias.",
    },
    {
      id: "stat-2",
      value: "250%+",
      label: "Crescimento médio na interação do usuário.",
    },
    {
      id: "stat-4",
      value: "69%+",
      label: "Utilizam IA para melhorar a experiência do atendimento ao cliente.",
    },
    {
      id: "stat-3",
      value: "44%+",
      label: "Registraram redução de custos operacionais.",
    }
  ],
}: Stats8Props) => {
  return (
    <section className="py-32 flex justify-center items-center">
      <div className="container">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold md:text-4xl">{heading}</h2>
          <p>{description}</p>
          <a
            href={link.url}
            className="flex items-center gap-1 font-bold hover:underline"
          >
            {link.text}
            <ArrowRight className="h-auto w-4" />
          </a>
        </div>
        <div className="mt-14 grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-5">
              <div className="text-6xl font-bold">{stat.value}</div>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Stats8 };
