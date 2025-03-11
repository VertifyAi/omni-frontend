// interface MenuItem {
//     title: string;
//     links: {
//       text: string;
//       url: string;
//     }[];
//   }
  
  interface Footer2Props {
    logo?: {
      url: string;
      src: string;
      alt: string;
    };
    tagline?: string;
    menuItems?: {
      title: string;
      items: {
        title: string;
        description?: string;
        url: string;
      }[];
    }[];
    copyright?: string;
    bottomLinks?: {
      text: string;
      url: string;
    }[];
    socialLinks?: {
      platform: string;
      url: string;
      icon: React.ReactNode;
    }[];
    newsletter?: {
      title: string;
      description: string;
      buttonText: string;
    };
  }
  
  const Footer2 = ({
    logo = {
      url: "#",
      src: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/logos/1svg.svg",
      alt: "Logo",
    },
    tagline = "Aumente a produtividade e a eficiência da sua empresa com a IA.",
    menuItems = [
      {
        title: "Produtos",
        items: [
          {
            title: "Omni",
            description: "Sistema completo de gestão empresarial integrado",
            url: "https://vertify.com.br/sign-in",
          },
        ],
      },
      {
        title: "Casos de Uso",
        items: [
          {
            title: "Vendas",
            description: "Gestão completa do seu funil de vendas",
            url: "#tab",
          },
          {
            title: "Suporte",
            description: "Atendimento e suporte ao cliente integrado",
            url: "#tab",
          },
          {
            title: "Comunicação Interna",
            description: "Ferramentas para melhorar a comunicação da sua equipe",
            url: "#tab",
          },
        ],
      },
      {
        title: "Redes Sociais",
        items: [
          {
            title: "Facebook",
            description: "Conheça nossa história e missão",
            url: "#",
          },
          {
            title: "Instagram",
            description: "Entre em contato conosco",
            url: "#",
          },
          {
            title: "Linkedin",
            description: "Últimas notícias e atualizações",
            url: "#",
          },
        ],
      },
      {
        title: "Legal",
        items: [
          {
            title: "Termos de Uso",
            description: "Termos e condições de uso",
            url: "#",
          },
          {
            title: "Privacidade",
            description: "Política de privacidade",
            url: "#",
          },
        ],
      },
    ],
    copyright = "© 2025 Copyright. Todos os direitos reservados.",
    bottomLinks = [
      { text: "Termos de uso", url: "#" },
      { text: "Política de privacidade", url: "#" },
    ],
  }: Footer2Props) => {
    return (
      <section className="pt-32 flex justify-center items-center">
        <div className="container">
          <footer>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
              <div className="col-span-2 mb-8 lg:mb-0">
                <div className="flex items-center gap-2 lg:justify-start">
                  <a href="https://shadcnblocks.com">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="h-10"
                    />
                  </a>
                  {/* <p className="text-xl font-semibold">{logo}</p> */}
                </div>
                <p className="mt-4 font-bold">{tagline}</p>
              </div>
              {menuItems.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-4 font-bold">{section.title}</h3>
                  <ul className="space-y-4 text-muted-foreground">
                    {section.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="font-medium hover:text-primary"
                      >
                        <a href={item.url}>{item.title}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
              <p>{copyright}</p>
              <ul className="flex gap-4">
                {bottomLinks.map((link, linkIdx) => (
                  <li key={linkIdx} className="underline hover:text-primary">
                    <a href={link.url}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          </footer>
        </div>
      </section>
    );
  };
  
  export { Footer2 };
  