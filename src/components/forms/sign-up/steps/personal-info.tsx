import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormData } from "../schema";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const MaskedInput = dynamic(() => import("@/components/ui/masked-input").then(mod => mod.MaskedInput), {
  ssr: false
});

interface PersonalInfoProps {
  form: UseFormReturn<SignUpFormData>;
}

export function PersonalInfo({ form }: PersonalInfoProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  // Observar mudanças nos campos de senha em tempo real
  const password = form.watch("password");
  const passwordConfirmation = form.watch("passwordConfirmation");

  // Validar senhas quando qualquer uma delas mudar
  useEffect(() => {
    if (passwordConfirmation) {
      if (password !== passwordConfirmation) {
        form.setError('passwordConfirmation', {
          type: 'manual',
          message: 'As senhas não coincidem'
        });
      } else {
        form.clearErrors('passwordConfirmation');
      }
    }
  }, [password, passwordConfirmation, form]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="min-h-[78px] flex flex-col">
              <div>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="João" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="min-h-[78px] flex flex-col">
              <div>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input placeholder="Silva" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="min-h-[78px] flex flex-col">
            <div>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="joao@exemplo.com" {...field} />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <FormItem className="min-h-[98px] flex flex-col">
            <div>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} {...field} />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeIcon className="w-4 h-4 text-muted-foreground" /> : <EyeOffIcon className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </FormControl>
            </div>
            <div className="space-y-1">
              {fieldState.error ? (
                <FormMessage />
              ) : (
                <p className="text-xs text-muted-foreground">
                  A senha deve conter no mínimo 6 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.
                </p>
              )}
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="passwordConfirmation"
        render={({ field }) => (
          <FormItem className="min-h-[78px] flex flex-col">
            <div>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPasswordConfirmation ? "text" : "password"} 
                  className={cn(
                    passwordConfirmation && password !== passwordConfirmation && "border-red-500 focus-visible:ring-red-500"
                  )}
                    {...field} 
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  >
                    {showPasswordConfirmation ? <EyeIcon className="w-4 h-4 text-muted-foreground" /> : <EyeOffIcon className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field: { value, onChange, onBlur, ...field } }) => (
          <FormItem className="min-h-[78px] flex flex-col">
            <div>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="(99) 99999-9999"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  maskChar={null}
                  type="tel"
                  placeholder="(11) 99999-9999"
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 