import { NextResponse } from 'next/server';

// Interface para a resposta da Meta API
interface MetaPhoneNumber {
  verified_name: string;
  code_verification_status: string;
  display_phone_number: string;
  quality_rating: string;
  platform_type: string;
  throughput: {
    level: string;
  };
  webhook_configuration: {
    whatsapp_business_account: string;
    application: string;
  };
  id: string;
}

interface MetaPhoneNumbersResponse {
  data: MetaPhoneNumber[];
  paging?: Record<string, unknown>;
}

export async function GET() {
  try {
    // Você deve configurar essas variáveis de ambiente
    const WABA_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '1211338270424866';
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
    const API_VERSION = process.env.META_API_VERSION || 'v23.0';

    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Meta Access Token não configurado' },
        { status: 500 }
      );
    }

    // Fazer chamada para a Meta Graph API
    const metaApiUrl = `https://graph.facebook.com/${API_VERSION}/${WABA_ID}/phone_numbers?access_token=${ACCESS_TOKEN}`;
    
    const response = await fetch(metaApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro da Meta API:', errorData);
      return NextResponse.json(
        { error: 'Erro ao buscar números da Meta API', details: errorData },
        { status: response.status }
      );
    }

    const data: MetaPhoneNumbersResponse = await response.json();
    
    // Retornar os dados no mesmo formato da Meta API
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro ao buscar números do WhatsApp:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 