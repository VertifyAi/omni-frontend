"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { SignInFormSchema } from "@/lib/definitions";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { setMixpanelTrack } from "@/lib/mixpanelClient";

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
  recoverUrl?: string;
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
  signupText = "Não tem uma conta?",
  signupUrl = "/sign-up",
  recoverUrl = "/recover",
}: Login3Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Carregar credenciais salvas quando o componente for montado
  useEffect(() => {
    const savedCredentials = localStorage.getItem("omni-login-credentials");
    if (savedCredentials) {
      try {
        const { email, password } = JSON.parse(savedCredentials);
        form.setValue("email", email);
        form.setValue("password", password);
        setRememberMe(true);
      } catch (error) {
        console.error("Erro ao carregar credenciais salvas:", error);
        localStorage.removeItem("omni-login-credentials");
      }
    }
  }, [form]);

  const { handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof SignInFormSchema>) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      
      // Salvar ou remover credenciais baseado no checkbox
      if (rememberMe) {
        localStorage.setItem("omni-login-credentials", JSON.stringify({
          email: data.email,
          password: data.password,
        }));
      } else {
        localStorage.removeItem("omni-login-credentials");
      }
      
      setMixpanelTrack("login_success", {
        event_id: "login_success",
        properties: {
          user: data,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao fazer login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (errors: typeof form.formState.errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message.toString());
    } else {
      toast.error("Erro ao enviar o formulário");
    }
  };

  return (
    <section className="py-32 flex justify-center items-center h-screen">
      <div className="container">
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow">
              <div className="mb-6 flex flex-col items-center">
                <a href={logo.url}>
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={40}
                    height={40}
                    className="mb-7 h-10 w-auto"
                  />
                </a>
                <p className="mb-2 text-2xl font-bold">{heading}</p>
                <p className="text-muted-foreground">{subheading}</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="E-mail"
                    {...form.register("email")}
                    disabled={isLoading}
                  />
                  {/* {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )} */}
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha"
                      {...form.register("password")}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeIcon className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <EyeOffIcon className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {/* {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )} */}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : loginText}
                </Button>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground text-start flex items-center gap-2 mb-2">
                  <input 
                    type="checkbox" 
                    id="remember-me" 
                    className="w-4 h-4" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="text-sm">
                    Lembrar-me
                  </label>
                </p>
                <p className="text-sm text-muted-foreground text-start">
                  <a href={recoverUrl} className="text-primary hover:underline">
                    Esqueceu sua senha?
                  </a>
                </p>
                <p className="text-sm text-muted-foreground text-start">
                  {signupText}{" "}
                  <a href={signupUrl} className="text-primary hover:underline">
                    Criar conta
                  </a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export { Login3 };
