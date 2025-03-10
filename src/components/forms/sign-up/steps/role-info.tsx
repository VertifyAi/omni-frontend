import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormData } from "../schema";

interface RoleInfoProps {
  form: UseFormReturn<SignUpFormData>;
}

export function RoleInfo({ form }: RoleInfoProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="areaId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Área</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma área" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Área 1</SelectItem>
                <SelectItem value="2">Área 2</SelectItem>
                <SelectItem value="3">Área 3</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Função</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
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
    </div>
  );
} 