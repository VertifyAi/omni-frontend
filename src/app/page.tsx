import { Faq1 } from "@/components/Faq1";
import { Feature108 } from "@/components/Feature108";
import { Footer2 } from "@/components/Footer2";
import { Hero3 } from "@/components/Hero";
// import { Hero45 } from "@/components/Hero02";
import { Navbar1 } from "@/components/NavBar";
import { Pricing2 } from "@/components/Pricing2";
import { Stats8 } from "@/components/Stats8";

export default function Home() {
  return (
    <div className="">
      <Navbar1 />
      <Hero3 />
      {/* <Hero45 /> */}
      <Stats8 />
      <Feature108 />
      <Pricing2 />
      <Faq1 />
      <Footer2 />
    </div>
  );
}
