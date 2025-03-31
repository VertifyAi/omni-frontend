import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormData } from "../schema";
import dynamic from "next/dynamic";

const MaskedInput = dynamic(() => import("@/components/ui/masked-input").then(mod => mod.MaskedInput), {
  ssr: false
});

interface CompanyFormProps {
  form: UseFormReturn<SignUpFormData>;
}

export function CompanyForm({ form }: CompanyFormProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="company.name"
        render={({ field }) => (
          <FormItem className="min-h-[78px] flex flex-col">
            <div>
              <FormLabel>Nome da Empresa</FormLabel>
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
        name="company.cnpj"
        render={({ field: { value, onChange, onBlur, ...field } }) => (
          <FormItem className="min-h-[78px] flex flex-col">
            <div>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="99.999.999/9999-99"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  maskChar={null}
                  placeholder="00.000.000/0000-00"
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company.phone"
        render={({ field: { value, onChange, onBlur, ...field } }) => (
          <FormItem className="min-h-[78px] flex flex-col">
            <div>
              <FormLabel>Telefone da Empresa</FormLabel>
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