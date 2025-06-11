import { Navbar1 } from "@/components/NavBar";

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar1
        logo={{
          url: "/",
          src: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/logos/1svg.svg",
          alt: "Vertify",
          title: "Vertify"
        }}
        menu={[
          { title: "Início", url: "/" },
          { title: "Recursos", url: "/#recursos" },
          { title: "Preços", url: "/pricing" },
          { title: "Contato", url: "/#contato" }
        ]}
        auth={{
          login: { text: "Entrar", url: "/sign-in" },
          signup: { text: "Teste grátis por 30 dias", url: "/sign-up" }
        }}
      />
      <div className="pt-24">
        {children}
      </div>
    </div>
  );
} 