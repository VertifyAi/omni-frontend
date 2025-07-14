import { Recover } from "@/components/Recover";
import { Suspense } from "react";

export default function RecoverPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <main>
        <Recover
          logo={{
            url: "https://vertify.com.br",
            alt: "Vertify",
            src: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/logos/1svg.svg",
          }}
        />
      </main>
    </Suspense>
  );
}
