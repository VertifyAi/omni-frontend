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
  heading = "O Impacto Real da Automação com Inteligência Artificial",
  description = "Garantimos estabilidade e escalabilidade para todos os usuários",
  link = {
    text: "Leia o relatório completo de impacto",
    url: "https://www.shadcnblocks.com",
  },
  stats = [
    {
      id: "stat-1",
      value: "74%+",
      label: "das empresas usam IA regularmente.",
    },
    {
      id: "stat-2",
      value: "​91,63%",
      label: "dos empresários relatam melhora significativa na experiência do cliente.",
    },
    {
      id: "stat-4",
      value: "69%+",
      label: "dos usuários afirmam que a IA agiliza o atendimento e reduz filas de espera.",
    },
    {
      id: "stat-3",
      value: "44%+",
      label: "de redução nos custos operacionais sem comprometer a qualidade do atendimento.",
    }
  ],
}: Stats8Props) => {
  return (
    <section className="pt-32 flex justify-center items-center">
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
