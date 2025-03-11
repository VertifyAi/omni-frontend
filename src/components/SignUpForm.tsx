"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 letras"),
  zip_code: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"),
  country: z.string().min(1, "País é obrigatório"),
  complement: z.string().optional(),
});

const signUpSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  phone: z.string().min(11, "Telefone deve ter no mínimo 11 dígitos"),
  address: addressSchema,
  companyId: z.number(),
  areaId: z.number(),
  role: z.enum(["attendant", "admin"]),
  companyChoice: z.enum(["create", "join"]).optional(),
  company: z.object({
    name: z.string().min(1, "Nome da empresa é obrigatório"),
    cnpj: z.string().min(14, "CNPJ inválido"),
    phone: z.string().min(11, "Telefone deve ter no mínimo 11 dígitos"),
    address: addressSchema,
  }).optional(),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const steps = [
  { title: "Dados Pessoais", description: "Informações básicas" },
  { title: "Empresa", description: "Criar ou entrar em uma empresa" },
  { title: "Endereço", description: "Seu endereço completo" },
];

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
      companyId: 0,
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
    
    type FieldName = keyof SignUpFormData | 'address.street' | 'address.city' | 'address.state' | 'address.zip_code' | 'address.country' | 'address.complement' | 'company.name' | 'company.cnpj' | 'company.phone' | 'company.address.street' | 'company.address.city' | 'company.address.state' | 'company.address.zip_code' | 'company.address.country';
    
    const fields: Record<number, FieldName[]> = {
      0: ['firstName', 'lastName', 'email', 'password', 'phone'],
      1: ['companyChoice', 'role'],
      2: ['address.street', 'address.city', 'address.state', 'address.zip_code', 'address.country'],
    };

    // Se estiver no step da empresa e escolheu criar, valida os campos da empresa
    if (currentStep === 1 && form.getValues('companyChoice') === 'create') {
      fields[1].push(
        'company.name',
        'company.cnpj',
        'company.phone',
        'company.address.street',
        'company.address.city',
        'company.address.state',
        'company.address.zip_code',
        'company.address.country'
      );
    }

    const currentFields = fields[currentStep];
    if (!currentFields) return;

    const values = form.getValues();
    console.log("Valores atuais:", values);

    const isValid = await form.trigger(currentFields);
    console.log("É válido?", isValid);

    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    console.log("Submit chamado", { currentStep, data });

    if (currentStep < steps.length - 1) {
      await handleNextStep();
      return;
    }

    try {
      // Se escolheu criar empresa, cria primeiro
      if (data.companyChoice === 'create' && data.company) {
        const companyResponse = await fetch('/api/companies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.company.name,
            cnpj: data.company.cnpj,
            phone: data.company.phone,
            address: data.company.address,
          }),
        });

        if (!companyResponse.ok) {
          throw new Error('Erro ao criar empresa');
        }

        const companyData = await companyResponse.json();
        
        // Atualiza os IDs no form
        form.setValue('companyId', companyData.id);
        form.setValue('areaId', companyData.defaultAreaId);
      }

      const formData = form.getValues();

      // Prepara o payload conforme o CreateUserDto
      const userPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        companyId: formData.companyId,
        areaId: formData.areaId,
        role: formData.role,
      };

      // Cadastra o usuário
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPayload),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar conta');
      }

      router.push('/sign-in');
    } catch (error) {
      console.error('Erro no registro:', error);
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="João" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="joao@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="11999999999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="companyChoice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>O que você deseja fazer?</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={field.value === 'create' ? 'default' : 'outline'}
                      className="w-full h-24"
                      onClick={() => field.onChange('create')}
                    >
                      Criar nova empresa
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'join' ? 'default' : 'outline'}
                      className="w-full h-24"
                      onClick={() => field.onChange('join')}
                    >
                      Entrar em uma empresa existente
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('companyChoice') === 'create' ? (
              <div className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sua função na empresa</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione sua função" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="attendant">Atendente</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company.cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone da Empresa</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company.address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço da Empresa</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company.address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company.address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input maxLength={2} placeholder="SP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company.address.zip_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input placeholder="01234-567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company.address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País</FormLabel>
                        <FormControl>
                          <Input placeholder="Brasil" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ) : form.watch('companyChoice') === 'join' ? (
              <div className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sua função na empresa</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione sua função" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="attendant">Atendente</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Aqui você pode adicionar campos para entrar em uma empresa existente */}
              </div>
            ) : null}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input maxLength={2} placeholder="SP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address.zip_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="01234-567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input placeholder="Brasil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address.complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input placeholder="Apto 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

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