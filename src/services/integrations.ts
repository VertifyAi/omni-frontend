import { WhatsAppIntegration, WhatsAppMessage } from "@/types/integrations";

export class IntegrationsService {
  private static instance: IntegrationsService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = "/api/integrations";
  }

  public static getInstance(): IntegrationsService {
    if (!IntegrationsService.instance) {
      IntegrationsService.instance = new IntegrationsService();
    }
    return IntegrationsService.instance;
  }

  private async getHeaders() {
    return {
      "Content-Type": "application/json",
    };
  }

  public async getWhatsAppIntegration(): Promise<WhatsAppIntegration | null> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/whatsapp`, {
        headers,
      });

      console.log('response getWhatsAppIntegration', response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao buscar integração");
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar integração:", error);
      return null;
    }
  }

  public async createWhatsAppIntegration(data: {
    whatsapp_number: string;
  }): Promise<WhatsAppIntegration> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/whatsapp`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar integração");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao criar integração:", error);
      throw error;
    }
  }

  public async updateWhatsAppIntegration(
    data: WhatsAppIntegration
  ): Promise<WhatsAppIntegration> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/whatsapp`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao atualizar integração");
      }

      return response.json();
    } catch (error) {
      console.error("Erro ao atualizar integração:", error);
      throw error;
    }
  }

  public async deleteWhatsAppIntegration(): Promise<void> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/whatsapp`, {
      method: "DELETE",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao remover integração");
    }
  }

  public async getWhatsAppMessages(): Promise<WhatsAppMessage[]> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/whatsapp/messages`, {
      headers,
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao buscar mensagens");
    }
    return await response.json();
  }

  public async sendWhatsAppMessage(data: {
    phone: string;
    message: string;
  }): Promise<void> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/whatsapp/messages/send`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao enviar mensagem");
    }
  }
}
