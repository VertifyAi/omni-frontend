import Image from 'next/image';

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
            title: "Instagram",
            description: "Entre em contato conosco",
            url: "https://www.instagram.com/vertifybr/",
          },
          {
            title: "Linkedin",
            description: "Últimas notícias e atualizações",
            url: "https://www.linkedin.com/company/vertifybr",
          },
          {
            title: "Facebook",
            description: "Conheça nossa história e missão",
            url: "https://www.facebook.com/people/Vertify/61574481330894/",
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
      <section className="bg-gradient-to-b from-white-soft to-white-warm border-t border-white-warm">
        <div className="px-4">
          <footer className="pt-20 pb-12">
            <div className="grid grid-cols-2 gap-12 lg:grid-cols-6 mb-16">
              <div className="col-span-2 mb-8 lg:mb-0">
                <div className="flex items-center gap-2 lg:justify-start mb-6">
                  <a href="https://shadcnblocks.com">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={150}
                      height={50}
                      className="h-10 w-auto"
                    />
                  </a>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-sm">{tagline}</p>
              </div>
              
              {menuItems.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-6 font-bold text-foreground">{section.title}</h3>
                  <ul className="space-y-4">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <a 
                          href={item.url} 
                          target="_blank"
                          className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col justify-between gap-6 border-t border-white-warm pt-8 text-sm md:flex-row md:items-center">
              <p className="text-muted-foreground">{copyright}</p>
              <ul className="flex gap-6">
                {bottomLinks.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a 
                      href={link.url}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.text}
                    </a>
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
  