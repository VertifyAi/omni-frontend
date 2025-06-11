import { Faq1 } from "@/components/Faq1";
import { Feature108 } from "@/components/Feature108";
import { Feature43 } from "@/components/Feature43";
import { Footer2 } from "@/components/Footer2";
// import { Hero3 } from "@/components/Hero";
import { Hero7 } from "@/components/hero7";
// import { Hero45 } from "@/components/Hero02";
import { Navbar1 } from "@/components/NavBar";
import { Pricing2 } from "@/components/Pricing2";
import { Stats8 } from "@/components/Stats8";
import { Cta11 } from "@/components/Cta11";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar1 />
      {/* <Hero3 /> */}
      <Hero7 />
      <Stats8 />
      <Feature108 />
      <Feature43 />
      <Cta11 
        heading="Não Deixe Seus Concorrentes Te Passarem Para Trás" 
        description="Otimize seu atendimento e impulsione suas vendas com nossa IA. Experimente grátis agora e perceba a diferença em apenas 30 dias."
      />
      <Pricing2 />
      <Faq1 />
      <Footer2 />
    </div>
  );
}
