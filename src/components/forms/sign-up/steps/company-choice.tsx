import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormData } from "../schema";

interface CompanyChoiceProps {
  form: UseFormReturn<SignUpFormData>;
}

export function CompanyChoice({ form }: CompanyChoiceProps) {
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
    </div>
  );
} 