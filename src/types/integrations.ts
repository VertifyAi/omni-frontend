export interface WhatsAppIntegration {
  id: number;
  company_id: number;
  account_sid: string;
  auth_token: string;
  whatsapp_number: string;
  status: "pending" | "active" | "inactive" | "error";
  config: {
    webhook_url: string;
    webhook_method: string;
    last_error?: string;
    last_error_date?: Date;
  };
  created_at: string;
  updated_at: string;
}

export interface WhatsAppMessage {
  id: number;
  phone: string;
  message: string;
  direction: "incoming" | "outgoing";
  status: "sent" | "delivered" | "read" | "failed";
  created_at: string;
  updated_at: string;
}

export interface WhatsAppIntegrationFormData {
  account_sid: string;
  auth_token: string;
  whatsapp_number: string;
}

export enum IntegrationType {
  WHATSAPP = "WHATSAPP",
}

export interface Integration {
  active: boolean;
  companyId: number;
  config: string;
  createdAt: string;
  id: number;
  type: IntegrationType.WHATSAPP;
  updatedAt: string;
}
