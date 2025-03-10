"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { signUpSchema, steps, type SignUpFormData } from "./schema";
import { PersonalInfo, CompanyChoice, AddressInfo, RoleInfo, CompanyForm } from "./steps";

export function SignUpForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const form = useForm<SignUpFormData>({
    mode: "onChange",
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      role: "attendant",
      areaId: 1,
      companyChoice: undefined,
      address: {
        street: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        complement: "",
      },
      company: {
        name: "",
        cnpj: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          zip_code: "",
          country: "",
          complement: "",
        },
      },
    },
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNextStep = async () => {
    console.log("Tentando avançar...");
    
    type FieldName = keyof SignUpFormData | 'address.street' | 'address.city' | 'address.state' | 'address.zip_code' | 'address.country' | 'address.complement' | 'company.name' | 'company.cnpj' | 'company.phone' | 'company.address.street' | 'company.address.city' | 'company.address.state' | 'company.address.zip_code' | 'company.address.country' | 'company.address.complement';
    
    const fields: Record<number, FieldName[]> = {
      0: ['firstName', 'lastName', 'email', 'password', 'phone'],
      1: ['address.street', 'address.city', 'address.state', 'address.zip_code', 'address.country'],
      2: ['companyChoice'],
      3: form.getValues('companyChoice') === 'create' 
        ? ['company.name', 'company.cnpj', 'company.phone', 'company.address.street', 'company.address.city', 'company.address.state', 'company.address.zip_code', 'company.address.country']
        : [],
      4: ['areaId', 'role']
    };

    const currentFields = fields[currentStep];
    if (!currentFields) return;

    const values = form.getValues();
    console.log("Valores atuais:", values);

    const isValid = await form.trigger(currentFields);
    console.log("É válido?", isValid);

    if (isValid) {
      // Se o usuário escolheu entrar em uma empresa existente, pular o passo de criar empresa
      if (currentStep === 2 && values.companyChoice === 'join') {
        setCurrentStep(4);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    console.log("Submit chamado", { currentStep, data });

    if (currentStep < steps.length - 1) {
      await handleNextStep();
      return;
    }

    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar conta');
      }

      if (data.companyChoice === 'create') {
        router.push('/company/create');
      } else {
        router.push('/company/join');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
    }
  };

  const handleBack = () => {
    const values = form.getValues();
    // Se estiver na última etapa e escolheu entrar em uma empresa, voltar para a escolha
    if (currentStep === 4 && values.companyChoice === 'join') {
      setCurrentStep(2);
    } else {
      setCurrentStep(Math.max(0, currentStep - 1));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfo form={form} />;
      case 1:
        return <AddressInfo form={form} />;
      case 2:
        return <CompanyChoice form={form} />;
      case 3:
        return <CompanyForm form={form} />;
      case 4:
        return <RoleInfo form={form} />;
      default:
        return null;
    }
  };

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
                <Button type="button" variant="outline" onClick={handleBack}>
                  Voltar
                </Button>
              )}
              <Button 
                type="button"
                className="flex-1"
                onClick={currentStep === steps.length - 1 ? form.handleSubmit(onSubmit) : handleNextStep}
              >
                {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 