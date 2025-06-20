import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumber(phone: string | number): string {
  const phoneStr = String(phone).replace(/\D/g, '');

  if (phoneStr.length !== 13) {
    throw new Error('Número inválido: o número deve ter 13 dígitos (ex: 5514998328107)');
  }

  const countryCode = phoneStr.substring(0, 2);
  const areaCode = phoneStr.substring(2, 4);
  const firstPart = phoneStr.substring(4, 9);
  const secondPart = phoneStr.substring(9, 13);

  return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
}

export function formatWhatsAppNumber(value: string): string {
  // Se não começar com +55, retorna o número como veio
  if (!value.startsWith('+55')) {
    return value;
  }
  
  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, '');
  
  // Se não tiver números, retorna o prefixo
  if (!numbers) return '+55 ';
  
  // Garante que começa com 55
  const cleanNumber = numbers.startsWith('55') ? numbers : `55${numbers}`;
  
  // Formata o número
  const match = cleanNumber.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  
  // Retorna o número parcialmente formatado
  if (cleanNumber.length <= 2) return `+${cleanNumber}`;
  if (cleanNumber.length <= 4) return `+${cleanNumber.slice(0, 2)} (${cleanNumber.slice(2)}`;
  if (cleanNumber.length <= 9) return `+${cleanNumber.slice(0, 2)} (${cleanNumber.slice(2, 4)}) ${cleanNumber.slice(4)}`;
  
  return `+${cleanNumber.slice(0, 2)} (${cleanNumber.slice(2, 4)}) ${cleanNumber.slice(4, 9)}-${cleanNumber.slice(9)}`;
}

export function removeAllNonNumeric(value: string): string {
  return value.replace(/\D/g, '');
}
