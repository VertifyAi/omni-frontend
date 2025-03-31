import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormData } from "../schema";
import { useCEP } from "@/hooks/use-cep";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const MaskedInput = dynamic(() => import("@/components/ui/masked-input").then(mod => mod.MaskedInput), {
  ssr: false
});

interface AddressInfoProps {
  form: UseFormReturn<SignUpFormData>;
}

export function AddressInfo({ form }: AddressInfoProps) {
  const { fetchAddress, loading, error } = useCEP();

  // Observar mudanças no CEP
  const cep = form.watch("address.zip_code");

  useEffect(() => {
    const searchAddress = async () => {
      // Remove caracteres não numéricos para validação
      const cleanCEP = cep?.replace(/\D/g, '');
      
      if (cleanCEP?.length === 8) {
        const address = await fetchAddress(cleanCEP);
        
        if (address) {
          form.setValue('address.street', address.logradouro);
          form.setValue('address.city', address.localidade);
          form.setValue('address.state', address.uf);
          form.setValue('address.country', 'Brasil');
          
          // Se houver complemento da API, adiciona ao campo
          if (address.complemento) {
            form.setValue('address.complement', address.complemento);
          }
        }
      }
    };

    searchAddress();
  }, [cep, form, fetchAddress]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="address.zip_code"
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

      <FormField
        control={form.control}
        name="address.street"
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="address.city"
          render={({ field }) => (
            <FormItem className="min-h-[78px] flex flex-col">
              <div>
                <FormLabel>Cidade</FormLabel>
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
          name="address.state"
          render={({ field }) => (
            <FormItem className="min-h-[78px] flex flex-col">
              <div>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input maxLength={2} placeholder="SP" {...field} disabled={loading} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="address.complement"
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
          name="address.country"
          render={({ field }) => (
            <FormItem className="min-h-[78px] flex flex-col">
              <div>
                <FormLabel>País</FormLabel>
                <FormControl>
                  <Input placeholder="Brasil" {...field} disabled={loading} />
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