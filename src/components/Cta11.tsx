import { Button } from "@/components/ui/button";

interface Cta11Props {
  heading: string;
  description: string;
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
  heading = "Ready to Get Started?",
  description = "Join thousands of satisfied customers using our platform to build amazing websites.",
  buttons = {
    secondary: {
      text: "Acesso Antecipado",
      url: "https://vertify.com.br/sign-up",
    },
  },
}: Cta11Props) => {
  return (
    <section className="pt-32 flex justify-center items-center">
      <div className="container">
        <div 
          className="relative flex flex-col items-center rounded-lg p-8 text-center md:rounded-xl lg:p-16 overflow-hidden"
          style={{
            backgroundImage: `url('https://vertify-public-assets.s3.us-east-2.amazonaws.com/website-assets/DALL%C2%B7E+2025-03-11+10.13.42+-+A+futuristic+sports+car+racing+at+high+speed+on+a+modern+track%2C+featuring+vibrant+neon+lights+in+shades+of+orange+(%23E67E22)+and+purple+(%238E44AD).+The+.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-black/75 z-0" />
          <div className="relative z-10">
            <h3 className="mb-3 max-w-3xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6 text-white">
              {heading}
            </h3>
            <p className="mb-8 max-w-3xl text-white/90 lg:text-lg">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
              {buttons.secondary && (
                <Button variant="outline" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white hover:text-black" asChild>
                  <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
                </Button>
              )}
              {buttons.primary && (
                <Button className="w-full sm:w-auto" asChild>
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta11 };
