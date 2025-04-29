import { Loader2 } from "lucide-react";

interface LoadingProps {
  text?: string;
  size?: number;
}

export function Loading({ text = "Carregando...", size = 24 }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2">
      <Loader2 className="h-6 w-6 animate-spin text-primary" size={size} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
} 