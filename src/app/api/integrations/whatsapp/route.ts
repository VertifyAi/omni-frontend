import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API_URL = 'http://localhost:3001';

export async function GET() {
  try {
    console.log('GET request received');
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const companyId = cookieStore.get('company_id')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Token não fornecido' },
        { status: 401 }
      );
    }

    if (!companyId) {
      return NextResponse.json(
        { message: 'ID da empresa não fornecido' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/integrations/whatsapp?company_id=${companyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { message: data.message || 'Erro ao buscar integração' },
        { status: response.status }
      );
    }

    // Verificar se a resposta está vazia
    const text = await response.text();
    if (!text) {
      return NextResponse.json({ data: null });
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      return NextResponse.json(
        { message: 'Erro ao processar resposta do servidor' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erro ao buscar integração:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const companyId = cookieStore.get('company_id')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Token não fornecido' },
        { status: 401 }
      );
    }

    if (!companyId) {
      return NextResponse.json(
        { message: 'ID da empresa não fornecido' },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body.whatsapp_number || !body.account_sid || !body.auth_token) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/integrations/whatsapp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...body,
        company_id: parseInt(companyId)
      })
    });

    if (response.status === 401) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { message: data.message || 'Erro ao criar integração' },
        { status: response.status }
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Erro ao criar integração:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const companyId = cookieStore.get('company_id')?.value;
    const body = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Token não fornecido' },
        { status: 401 }
      );
    }

    if (!companyId) {
      return NextResponse.json(
        { message: 'ID da empresa não fornecido' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/integrations/whatsapp`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...body,
        company_id: parseInt(companyId)
      })
    });

    if (response.status === 401) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { message: data.message || 'Erro ao atualizar integração' },
        { status: response.status }
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Erro ao atualizar integração:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const companyId = cookieStore.get('company_id')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Token não fornecido' },
        { status: 401 }
      );
    }

    if (!companyId) {
      return NextResponse.json(
        { message: 'ID da empresa não fornecido' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/integrations/whatsapp?company_id=${companyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { message: data.message || 'Erro ao remover integração' },
        { status: response.status }
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Erro ao remover integração:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 