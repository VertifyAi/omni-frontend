"use client";

import { useState, useEffect } from "react";
// import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SignInFormSchema } from "@/lib/definitions";
import { useAuth } from "@/hooks/useAuth";

interface Login3Props {
  heading?: string;
  subheading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
  };
  loginText?: string;
  googleText?: string;
  signupText?: string;
  signupUrl?: string;
}

const Login3 = ({
  heading = "Bem-vindo(a) de volta",
  subheading = "Faça login para continuar.",
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://www.shadcnblocks.com/images/block/block-1.svg",
    alt: "logo",
  },
  loginText = "Entrar",
  // googleText = "Entrar com Google",
  signupText = "Não tem uma conta?",
  signupUrl = "#",
}: Login3Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isClient, setIsClient] = useState(false);
  const { login } = useAuth();
  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    formState: { errors },
  } = form;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert("E-mail ou senha inválidos");
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <section className="py-32 flex justify-center items-center">
      <div className="container">
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSubmit}>
            <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow">
              <div className="mb-6 flex flex-col items-center">
                <a href={logo.url}>
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="mb-7 h-10 w-auto"
                  />
                </a>
                <p className="mb-2 text-2xl font-bold">{heading}</p>
                <p className="text-muted-foreground">{subheading}</p>
              </div>
              <div>
                <div className="grid gap-4">
                  <Input
                    type="email"
                    placeholder="Escreva seu e-mail"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <span>{errors.email.message}</span>}
                  <div>
                    <Input
                      type="password"
                      placeholder="Escreva sua senha"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <span>{errors.password.message}</span>}
                  </div>
                  <div className="flex justify-end">
                    <a
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>
                  <Button type="submit" className="mt-2 w-full">
                    {loginText}
                  </Button>
                  {/* <Button variant="outline" className="w-full">
                    <FcGoogle className="mr-2 size-5" />
                    {googleText}
                  </Button> */}
                </div>
                <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
                  <p>{signupText}</p>
                  <a href={signupUrl} className="font-medium text-primary">
                    Criar conta
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export { Login3 };
