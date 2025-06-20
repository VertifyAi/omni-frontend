"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Mail, Phone, Calendar, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/fetchApi";
import { formatPhoneNumber } from "@/lib/utils";

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone: string;
  avatar?: string;
  createdAt: string;
  lastMessageAt?: string;
  totalTickets?: number;
  activeTickets?: number;
}

interface CustomerDetailsPanelProps {
  customerId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailsPanel({ customerId, isOpen, onClose }: CustomerDetailsPanelProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
      
      if (customerId) {
        fetchCustomerData();
      }
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen, customerId]);

  const fetchCustomerData = async () => {
    if (!customerId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchApi(`/api/customers/${customerId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar dados do cliente');
      }
      
      const customerData = await response.json();
      setCustomer(customerData);
    } catch (error) {
      console.error('Erro ao buscar dados do cliente:', error);
      setError('Não foi possível carregar os dados do cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isAnimating ? 'opacity-40' : 'opacity-0'
        }`}
        onClick={handleOverlayClick}
      />
      
      {/* Side Panel */}
      <div className={`fixed right-4 top-4 bottom-4 w-[500px] bg-white-pure border border-white-warm shadow-white-elevated z-50 overflow-y-auto transition-transform duration-300 ease-out rounded-2xl ${
        isAnimating ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white-warm">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Detalhes do Cliente
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-white-soft transition-colors rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-cool-teal flex items-center justify-center mb-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
              <p className="text-muted-foreground">Carregando dados do cliente...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
              <Button
                variant="link"
                className="ml-2 text-red-700 hover:text-red-800"
                onClick={fetchCustomerData}
              >
                Tentar novamente
              </Button>
            </div>
          ) : customer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-center gap-4 p-4 bg-white-soft rounded-xl border border-white-warm elevated-1">
                <Avatar className="h-16 w-16 border-2 border-white-warm">
                  <AvatarImage src={customer.avatar || "/default-avatar.svg"} />
                  <AvatarFallback className="text-lg bg-gradient-brand text-foreground font-semibold">
                    {customer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">{customer.name}</h3>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-primary" />
                    {formatPhoneNumber(customer.phone)}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white-soft rounded-xl p-4 border border-white-warm elevated-1">
                <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-brand rounded-full"></div>
                  Informações de Contato
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white-pure rounded-lg border border-white-warm">
                    <Phone className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Telefone</p>
                      <p className="text-sm text-muted-foreground">{formatPhoneNumber(customer.phone)}</p>
                    </div>
                  </div>
                  {customer.email && (
                    <div className="flex items-center gap-3 p-3 bg-white-pure rounded-lg border border-white-warm">
                      <Mail className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Email</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white-soft rounded-xl p-4 border border-white-warm elevated-1">
                <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-brand rounded-full"></div>
                  Estatísticas
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white-pure rounded-lg border border-white-warm text-center">
                    <MessageCircle className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-lg font-semibold text-foreground">{customer.totalTickets || 0}</p>
                    <p className="text-xs text-muted-foreground">Total de Tickets</p>
                  </div>
                  <div className="p-3 bg-white-pure rounded-lg border border-white-warm text-center">
                    <MessageCircle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-lg font-semibold text-foreground">{customer.activeTickets || 0}</p>
                    <p className="text-xs text-muted-foreground">Tickets Ativos</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white-soft rounded-xl p-4 border border-white-warm elevated-1">
                <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-brand rounded-full"></div>
                  Histórico
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white-pure rounded-lg border border-white-warm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Cliente desde</p>
                      <p className="text-sm text-muted-foreground">{formatDate(customer.createdAt)}</p>
                    </div>
                  </div>
                  {customer.lastMessageAt && (
                    <div className="flex items-center gap-3 p-3 bg-white-pure rounded-lg border border-white-warm">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Última mensagem</p>
                        <p className="text-sm text-muted-foreground">{formatDate(customer.lastMessageAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 