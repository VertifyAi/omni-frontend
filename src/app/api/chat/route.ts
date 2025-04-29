import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/fetch';

export async function GET() {
  try {
    const response = await fetchApi('/tickets/1/messages');

    console.log(response);
    
    if (!response) {
      return NextResponse.json({ error: 'Nenhuma mensagem encontrada' }, { status: 404 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetchApi('/tickets/messages', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    );
  }
} 