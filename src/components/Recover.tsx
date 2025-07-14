"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  RecoverFormSchema,
  RecoverPasswordFormSchema,
} from "@/lib/definitions";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";

interface RecoverProps {
  heading?: string;
  headingToken?: string;
  subheadingToken?: string;
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

const Recover = ({
  heading = "Recuperar senha",
  headingToken = "Recuperar senha",
  subheadingToken = "Digite sua nova senha",
  subheading = "Digite seu e-mail para recuperar sua senha.",
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://www.shadcnblocks.com/images/block/block-1.svg",
    alt: "logo",
  },
}: RecoverProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = useSearchParams().get("token");

  const form = useForm<z.infer<typeof RecoverFormSchema>>({
    resolver: zodResolver(RecoverFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const formToken = useForm<z.infer<typeof RecoverPasswordFormSchema>>({
    resolver: zodResolver(RecoverPasswordFormSchema),
    defaultValues: {
      password: "",
      token: token || "",
    },
  });

  const { handleSubmit } = form;
  const { handleSubmit: handleSubmitToken } = formToken;

  const onSubmit = async (data: z.infer<typeof RecoverFormSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/forgot-password", {
        email: data.email,
      });
      if (response.status === 201) {
        toast.success("Email enviado com sucesso");
      } else {
        toast.error("Erro ao enviar email");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Erro ao enviar email");
      }
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

  const onSubmitToken = async (
    data: z.infer<typeof RecoverPasswordFormSchema>
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/recover-password", {
        password: data.password,
        token: data.token,
      });
      if (response.status === 201) {
        toast.success("Senha recuperada com sucesso");
      } else {
        toast.error("Erro ao recuperar senha");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Erro ao recuperar senha");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-32 flex justify-center items-center h-screen">
      <div className="container">
        <div className="flex flex-col gap-4">
          {token ? (
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
                <p className="mb-2 text-2xl font-bold">{headingToken}</p>
                <p className="text-muted-foreground">{subheadingToken}</p>
              </div>
              <form onSubmit={handleSubmitToken(onSubmitToken, onError)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Nova senha"
                      {...formToken.register("password")}
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Enviar"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
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
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Enviar"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export { Recover };
