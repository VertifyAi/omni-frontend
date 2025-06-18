"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { signUpSchema, steps, type SignUpFormData } from "./schema";
import { PersonalInfo, AddressInfo, CompanyForm } from "./steps";
import { CompanyAddress } from "./steps/company-address";
import { WelcomeScreen } from "./welcome-screen";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchApi } from "@/lib/fetchApi";

export function SignUpForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm<SignUpFormData>({
    mode: "onChange",
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      phone: "",
      address: {
        streetName: "",
        streetNumber: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        complement: "",
      },
      company: {
        name: "",
        cnpj: "",
        phone: "",
        address: {
          streetName: "",
          streetNumber: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          complement: "",
        },
      },
    },
  });

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  const handleNextStep = async () => {
    type FieldName =
      | keyof SignUpFormData
      | "address.streetName"
      | "address.streetNumber"
      | "address.city"
      | "address.state"
      | "address.zipCode"
      | "address.country"
      | "address.complement"
      | "company.name"
      | "company.cnpj"
      | "company.phone"
      | "company.address.streetName"
      | "company.address.streetNumber"
      | "company.address.city"
      | "company.address.state"
      | "company.address.zipCode"
      | "company.address.country"
      | "company.address.complement";

    const fields: Record<number, FieldName[]> = {
      0: [
        "firstName",
        "lastName",
        "email",
        "password",
        "passwordConfirmation",
        "phone",
      ],
      1: [
        "address.streetName",
        "address.streetNumber",
        "address.city",
        "address.state",
        "address.zipCode",
        "address.country",
      ],
      2: ["company.name", "company.cnpj", "company.phone"],
      3: [
        "company.address.streetName",
        "company.address.streetNumber",
        "company.address.city",
        "company.address.state",
        "company.address.zipCode",
        "company.address.country",
      ],
    };

    const currentFields = fields[currentStep];
    if (!currentFields) return;
    // Validar todos os campos do passo atual
    const isValid = await form.trigger(currentFields);

    // Validação específica para o primeiro passo (onde está a senha)
    if (currentStep === 0) {
      const password = form.getValues("password");
      const passwordConfirmation = form.getValues("passwordConfirmation");

      // Verificar se as senhas coincidem
      if (password !== passwordConfirmation) {
        form.setError("passwordConfirmation", {
          type: "manual",
          message: "As senhas não coincidem",
        });
        return;
      }

      // Verificar a força da senha
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
      const isLongEnough = password.length >= 6;

      if (
        !hasUpperCase ||
        !hasLowerCase ||
        !hasNumber ||
        !hasSpecialChar ||
        !isLongEnough
      ) {
        form.setError("password", {
          type: "manual",
          message: "A senha não atende aos requisitos mínimos",
        });
        return;
      }
    }

    // Só avança se todos os campos estiverem válidos
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      form.trigger(currentFields);
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      const response = await fetchApi("/api/auth/sign-up", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Erro ao criar conta");
      }

      setIsSuccess(true);
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar conta"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfo form={form} />;
      case 1:
        return <AddressInfo form={form} />;
      case 2:
        return <CompanyForm form={form} />;
      case 3:
        return <CompanyAddress form={form} />;
      default:
        return null;
    }
  };

  if (isSuccess) {
    return <WelcomeScreen />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStep()}

            <div className="flex gap-4">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Voltar
                </Button>
              )}
              <Button
                type={isLastStep ? "submit" : "button"}
                className="flex-1"
                onClick={!isLastStep ? handleNextStep : undefined}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Aguarde...
                  </>
                ) : isLastStep ? (
                  "Finalizar"
                ) : (
                  "Próximo"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
