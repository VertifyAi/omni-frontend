import { useState } from 'react';

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export function useCEP() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = async (cep: string): Promise<ViaCEPResponse | null> => {
    // Remove caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, '');

    // Valida o formato do CEP
    if (cleanCEP.length !== 8) {
      setError('CEP deve conter 8 dígitos');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      
      if (!response.ok) {
        throw new Error('CEP não encontrado');
      }

      const data = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar CEP');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAddress,
    loading,
    error
  };
} 