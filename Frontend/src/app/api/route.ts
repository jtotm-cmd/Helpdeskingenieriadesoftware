import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Enviar petición al webhook de n8n
    // Usamos el hostname 'n8n' porque ambos contenedores (frontend y n8n)
    // estarán en la misma red de Docker generada por docker-compose.
    const response = await axios.post('http://n8n:5678/webhook/ticket-ingreso', body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json({ success: true, data: response.data }, { status: 200 });
  } catch (error: any) {
    console.error('Error proxying to n8n:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to proxy request to n8n' },
      { status: 500 }
    );
  }
}
