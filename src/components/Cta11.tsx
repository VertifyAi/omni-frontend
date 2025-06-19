import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, Zap } from "lucide-react";

interface Cta11Props {
  heading?: string;
  description?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
}

const Cta11 = ({
  heading = "Não Deixe Seus Concorrentes Te Passarem Para Trás",
  description = "Otimize seu atendimento e impulsione suas vendas com nossa IA. Experimente grátis agora e perceba a diferença em apenas 30 dias.",
  buttons = {
    primary: {
      text: "Começar Teste Gratuito de 30 Dias",
      url: "/sign-up",
    },
    // secondary: {
    //   text: "Ver Preços",
    //   url: "/pricing",
    // },
  },
}: Cta11Props) => {
  return (
    <section className="pt-20 sm:pt-24 md:pt-32 flex justify-center items-center px-4 sm:px-6">
      <div className="container">
        <div
          className="relative flex flex-col items-center rounded-3xl p-6 sm:p-8 md:p-12 lg:p-20 text-center overflow-hidden"
          style={{
            backgroundImage: `url('https://vertify-public-assets.s3.us-east-2.amazonaws.com/website-assets/DALL%C2%B7E+2025-03-11+10.13.42+-+A+futuristic+sports+car+racing+at+high+speed+on+a+modern+track%2C+featuring+vibrant+neon+lights+in+shades+of+orange+(%23E67E22)+and+purple+(%238E44AD).+The+.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80 z-0 rounded-3xl" />

          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Urgência Sutil */}
            <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-300 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
              <span className="text-xs sm:text-sm font-medium text-blue-800 text-center">
                ✨ Atendimento personalizado para os primeiros a se inscreverem!
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
              {heading}
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              {description}
            </p>

            {/* Benefícios em destaque */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-green-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-white font-bold text-base sm:text-lg">+340%</div>
                <div className="text-white/80 text-xs sm:text-sm">Aumento em vendas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <Zap className="w-6 sm:w-8 h-6 sm:h-8 text-blue-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-white font-bold text-base sm:text-lg">24/7</div>
                <div className="text-white/80 text-xs sm:text-sm">
                  Nunca para de vender
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <Users className="w-6 sm:w-8 h-6 sm:h-8 text-purple-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-white font-bold text-base sm:text-lg">Feito por</div>
                <div className="text-white/80 text-xs sm:text-sm">Especialistas em IA</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
              {buttons.primary && (
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-[#E97939] to-[#8A39DB] hover:from-[#E97939]/90 hover:to-[#8A39DB]/90 text-white px-8 sm:px-12 py-4 sm:py-8 text-base sm:text-xl font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 border-0 w-full sm:w-auto"
                >
                  <a
                    href={buttons.primary.url}
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="text-center">{buttons.primary.text}</span>
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                  </a>
                </Button>
              )}

              {buttons.secondary && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-6 sm:px-8 py-4 sm:py-8 text-base sm:text-lg font-semibold rounded-2xl w-full sm:w-auto"
                >
                  <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
                </Button>
              )}
            </div>

            {/* Garantias e Social Proof */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full"></div>
                <span>30 dias grátis garantidos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple-400 rounded-full"></div>
                <span>Setup em 24 horas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-400 rounded-full"></div>
                <span>Suporte VIP</span>
              </div>
            </div>

            {/* Testimonial Final */}
            {/* <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-white italic mb-4">
                  &ldquo;Implementamos em uma sexta-feira e na segunda já
                  tínhamos 12 leads qualificados esperando. Fechamos R$ 89.000
                  na primeira semana.&rdquo;
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#E97939] to-[#8A39DB] rounded-full flex items-center justify-center text-white font-bold">
                    LS
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">Lucas Silva</div>
                    <div className="text-white/70 text-sm">
                      CEO, TechSolutions
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta11 };
