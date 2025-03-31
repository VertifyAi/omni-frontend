import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormData } from "../schema";
import dynamic from "next/dynamic";

const MaskedInput = dynamic(() => import("@/components/ui/masked-input").then(mod => mod.MaskedInput), {
  ssr: false
});

interface CompanyAddressProps {
  form: UseFormReturn<SignUpFormData>;
}

export function CompanyAddress({ form }: CompanyAddressProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="company.address.zip_code"
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
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company.address.street"
        render={({ field }) => (
          <FormItem className="min-h-[78px] flex flex-col">
            <div>
              <FormLabel>Rua</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

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