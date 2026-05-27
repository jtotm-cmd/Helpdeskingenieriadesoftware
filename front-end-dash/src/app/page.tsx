'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, FilterX, Clock, Calendar, Mail, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './page.module.css';

interface Ticket {
  id: number;
  nombre: string;
  correo: string;
  mensaje: string;
  prioridad: string;
  fecha: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    correo: '',
    mes: '',
    anio: '',
    hora: '',
    minutos: '',
    prioridad: ''
  });

  const fetchTickets = useCallback(async (pageToFetch: number = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.correo) queryParams.append('correo', filters.correo);
      if (filters.mes) queryParams.append('mes', filters.mes);
      if (filters.anio) queryParams.append('anio', filters.anio);
      if (filters.hora) queryParams.append('hora', filters.hora);
      if (filters.minutos) queryParams.append('minutos', filters.minutos);
      if (filters.prioridad) queryParams.append('prioridad', filters.prioridad);
      
      queryParams.append('page', pageToFetch.toString());
      queryParams.append('limit', pagination.limit.toString());

      const response = await fetch(`/api/tickets?${queryParams.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setTickets(result.data);
        setPagination(result.pagination);
      } else {
        console.error('Error fetching tickets:', result.error);
      }
    } catch (error) {
      console.error('Failed to fetch tickets', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  // When filters change, reset to page 1 and fetch
  useEffect(() => {
    // Adding a slight debounce to prevent multiple calls while typing
    const timeoutId = setTimeout(() => {
      fetchTickets(1);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters, fetchTickets]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      correo: '',
      mes: '',
      anio: '',
      hora: '',
      minutos: '',
      prioridad: ''
    });
  };

  const goToNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      fetchTickets(pagination.page + 1);
    }
  };

  const goToPrevPage = () => {
    if (pagination.page > 1) {
      fetchTickets(pagination.page - 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    <main className={styles.container}>
      <div className={styles.glow}></div>

      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard Tickets</h1>
      </header>

      <section className={styles.filterCard}>
        <div className={styles.filterGroup}>
          <label className={styles.label}><Mail size={14} style={{ display: 'inline', marginRight: '4px' }}/> Correo</label>
          <input 
            type="text" 
            name="correo" 
            className={styles.input} 
            placeholder="Buscar correo..." 
            value={filters.correo}
            onChange={handleFilterChange}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }}/> Mes</label>
          <select name="mes" className={styles.select} value={filters.mes} onChange={handleFilterChange}>
            <option value="">Todos</option>
            {Array.from({length: 12}, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }}/> Año</label>
          <select name="anio" className={styles.select} value={filters.anio} onChange={handleFilterChange}>
            <option value="">Todos</option>
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}><Clock size={14} style={{ display: 'inline', marginRight: '4px' }}/> Hora</label>
          <select name="hora" className={styles.select} value={filters.hora} onChange={handleFilterChange}>
            <option value="">Todas</option>
            {Array.from({length: 24}, (_, i) => i).map(h => (
              <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}><Clock size={14} style={{ display: 'inline', marginRight: '4px' }}/> Minutos</label>
          <input 
            type="number" 
            name="minutos" 
            className={styles.input} 
            placeholder="Ej: 30" 
            min="0" 
            max="59"
            value={filters.minutos}
            onChange={handleFilterChange}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}><AlertCircle size={14} style={{ display: 'inline', marginRight: '4px' }}/> Prioridad</label>
          <select name="prioridad" className={styles.select} value={filters.prioridad} onChange={handleFilterChange}>
            <option value="">Todas</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end', gridColumn: '1 / -1' }}>
          <button className={`${styles.button} ${styles.buttonClear}`} onClick={clearFilters}>
            <FilterX size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}/>
            Limpiar Filtros
          </button>
        </div>
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Mensaje</th>
                <th>Prioridad</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className={styles.loading}>Cargando tickets...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>No se encontraron tickets con los filtros actuales.</td>
                </tr>
              ) : (
                tickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td>{ticket.nombre}</td>
                    <td>{ticket.correo}</td>
                    <td>{ticket.mensaje}</td>
                    <td>
                      <span className={`${styles.badge} ${ticket.prioridad === 'normal' ? styles.badgeNormal : styles.badgeAlta}`}>
                        {ticket.prioridad}
                      </span>
                    </td>
                    <td>{formatDate(ticket.fecha)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            Mostrando página {pagination.page} de {Math.max(1, pagination.totalPages)} ({pagination.total} tickets)
          </span>
          <div className={styles.paginationControls}>
            <button 
              className={styles.paginationButton} 
              onClick={goToPrevPage}
              disabled={pagination.page <= 1 || loading}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>
            <button 
              className={styles.paginationButton} 
              onClick={goToNextPage}
              disabled={pagination.page >= pagination.totalPages || loading}
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
