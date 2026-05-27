# Helpdeskingenieriadesoftware
En este repositorio se colocara los archivos solicitados para la presentación del proyecto
# Sistema Automatizado de Help Desk con n8n

## Descripción

Este proyecto consiste en un sistema automatizado de Help Desk orientado a empresas de venta de software. La solución utiliza n8n para automatización de workflows, PostgreSQL como base de datos y Docker para despliegue local mediante contenedores.

El sistema permite:

* Recepción automática de tickets
* Clasificación de prioridad
* Registro de incidencias
* Manejo centralizado de errores
* Generación automática de reportes

---

# Tecnologías utilizadas

* n8n
* Docker
* PostgreSQL
* React + Vite
* ESLint
* MinIO

---

# Requisitos

* Docker
* Docker Compose
* Git

---

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/USUARIO/helpdesk-n8n.git
```

Ingresar al proyecto:

```bash
cd helpdesk-n8n
```

Levantar contenedores:

```bash
docker compose up -d
```

---

# Ejecución

Servicios disponibles:

| Servicio  | URL                   |
| --------- | --------------------- |
| Frontend  | http://localhost:3000 |
| Dashboard | http://localhost:3001 |
| n8n       | http://localhost:5678 |

---

# Workflows incluidos

## 1. Ticket Ingest Flow

Recibe tickets mediante webhook y almacena la información en PostgreSQL.

## 2. Error Global Handler

Captura errores globales y los registra en base de datos.

## 3. Weekly Ticket Report

Genera reportes automáticos semanales en formato CSV.

---

# Uso del sistema

1. Acceder al frontend
2. Crear ticket
3. Verificar almacenamiento en PostgreSQL
4. Revisar reportes automáticos
5. Consultar logs y errores

---

# Pruebas realizadas

* Prueba de creación de tickets
* Prueba de clasificación automática
* Prueba de generación de reportes
* Prueba de manejo de errores

---

# Arquitectura general

Frontend → n8n → PostgreSQL → Logs / Reportes

---

# Autor

Proyecto académico de Ingeniería de Software.
