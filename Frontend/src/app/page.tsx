'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

export default function Home() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    mensaje: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await axios.post('/api/ticket', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setStatus('success');
      setMessage('Tu reporte ha sido enviado con éxito.');
      setFormData({ nombre: '', correo: '', mensaje: '' });
    } catch (error) {
      console.error('Error sending ticket:', error);
      setStatus('error');
      setMessage('Hubo un error al enviar el reporte. Inténtalo más tarde.');
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.glow}></div>
      <div className={styles.glow2}></div>
      
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Portal de Soporte</h1>
        <p className={styles.subtitle}>Ingresa tu información y nos pondremos en contacto</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="nombre" className={styles.label}>Nombre completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className={styles.input}
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Armando Tot"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="correo" className={styles.label}>Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              className={styles.input}
              value={formData.correo}
              onChange={handleChange}
              placeholder="armando@test.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mensaje" className={styles.label}>Mensaje del reporte</label>
            <textarea
              id="mensaje"
              name="mensaje"
              className={styles.textarea}
              value={formData.mensaje}
              onChange={handleChange}
              placeholder="Describe tu problema o solicitud..."
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.button}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar Reporte'}
          </button>
        </form>

        {status === 'success' && (
          <div className={`${styles.message} ${styles.messageSuccess}`}>
            {message}
          </div>
        )}
        
        {status === 'error' && (
          <div className={`${styles.message} ${styles.messageError}`}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
