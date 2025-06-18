import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormData } from "../schema";
import dynamic from "next/dynamic";
import { useCEP } from "@/hooks/use-cep";
import { useEffect } from "react";

const MaskedInput = dynamic(
  () => import("@/components/ui/masked-input").then((mod) => mod.MaskedInput),
  {
    ssr: false,
  }
);

interface CompanyAddressProps {
  form: UseFormReturn<SignUpFormData>;
}

export function CompanyAddress({ form }: CompanyAddressProps) {
  const { fetchAddress, loading, error } = useCEP();

  // Observar mudanças no CEP
  const cep = form.watch("company.address.zipCode");

  useEffect(() => {
    const searchAddress = async () => {
      // Remove caracteres não numéricos para validação
      const cleanCEP = cep?.replace(/\D/g, "");

      if (cleanCEP?.length === 8) {
        const address = await fetchAddress(cleanCEP);

        if (address) {
          form.setValue("company.address.streetName", address.logradouro);
          form.setValue("company.address.city", address.localidade);
          form.setValue("company.address.state", address.uf);
          form.setValue("company.address.country", "Brasil");

          // Se houver complemento da API, adiciona ao campo
          if (address.complemento) {
            form.setValue("company.address.complement", address.complemento);
          }
        }
      }
    };

    searchAddress();
  }, [cep, form, fetchAddress]);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="company.address.zipCode"
        render={({ field: { value, onChange, onBlur, ...field } }) => (
          <FormItem className="min-h-[78px] flex flex-col">
            <div>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="99999-999"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  maskChar={null}
                  placeholder="00000-000"
                  {...field}
                />
              </FormControl>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="company.address.streetName"
          render={({ field }) => (
            <FormItem className="min-h-[78px] flex flex-col">
              <div>
                <FormLabel>Rua</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company.address.streetNumber"
          render={({ field }) => (
            <FormItem className="min-h-[78px] flex flex-col">
              <div>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="company.address.city"
          render={({ field }) => (
            <FormItem className="min-h-[78px] flex flex-col">
              <div>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company.address.state"
          render={({ field }) => (
            <FormItem className="min-h-[78px] flex flex-col">
              <div>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input maxLength={2} placeholder="SP" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="company.address.complement"
          render={({ field }) => (
            <FormItem className="min-h-[78px] flex flex-col">
              <div>
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input placeholder="Apto 123" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company.address.country"
          render={({ field }) => (
            <FormItem className="min-h-[78px] flex flex-col">
              <div>
                <FormLabel>País</FormLabel>
                <FormControl>
                  <Input placeholder="Brasil" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
