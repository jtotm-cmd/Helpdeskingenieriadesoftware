import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'helpdesk_user',
  password: process.env.DB_PASSWORD || 'helpdesk_password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'helpdesk_db',
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const correo = searchParams.get('correo');
    const mes = searchParams.get('mes');
    const anio = searchParams.get('anio');
    const hora = searchParams.get('hora');
    const minutos = searchParams.get('minutos');
    const prioridad = searchParams.get('prioridad');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50'); // 50 items per page default

    let baseQuery = ' FROM public.tickets WHERE 1=1';
    const values: any[] = [];
    let paramIndex = 1;

    if (correo) {
      baseQuery += ` AND correo ILIKE $${paramIndex}`;
      values.push(`%${correo}%`);
      paramIndex++;
    }

    if (prioridad) {
      baseQuery += ` AND prioridad = $${paramIndex}`;
      values.push(prioridad);
      paramIndex++;
    }

    if (anio) {
      baseQuery += ` AND EXTRACT(YEAR FROM fecha) = $${paramIndex}`;
      values.push(parseInt(anio));
      paramIndex++;
    }

    if (mes) {
      baseQuery += ` AND EXTRACT(MONTH FROM fecha) = $${paramIndex}`;
      values.push(parseInt(mes));
      paramIndex++;
    }

    if (hora) {
      baseQuery += ` AND EXTRACT(HOUR FROM fecha) = $${paramIndex}`;
      values.push(parseInt(hora));
      paramIndex++;
    }

    if (minutos) {
      baseQuery += ` AND EXTRACT(MINUTE FROM fecha) = $${paramIndex}`;
      values.push(parseInt(minutos));
      paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
    const dataQuery = `SELECT id, nombre, correo, mensaje, prioridad, fecha ${baseQuery} ORDER BY fecha DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    
    // Add limit and offset to values for the data query
    const offset = (page - 1) * limit;
    const dataValues = [...values, limit, offset];

    const client = await pool.connect();
    try {
      // Execute both queries
      const [countResult, dataResult] = await Promise.all([
        client.query(countQuery, values),
        client.query(dataQuery, dataValues)
      ]);

      const totalCount = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({ 
        success: true, 
        data: dataResult.rows,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages
        }
      }, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets from database' },
      { status: 500 }
    );
  }
}
