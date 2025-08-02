# Medicat - UCB Dashboard

## Descripción General

**Medicat** es un sistema de gestión de progreso académico desarrollado para la **Universidad Católica Boliviana (UCB)**. La aplicación permite a los administradores monitorear el progreso de los docentes, gestionar materias, elementos de competencia, saberes mínimos y recuperatorios.

## Arquitectura del Proyecto

### Stack Tecnológico
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Excel Processing**: XLSX

### Estructura de Directorios
```
src/
├── assets/           # Imágenes y recursos estáticos
├── components/       # Componentes reutilizables
│   ├── dataUpload/   # Componentes específicos de carga de datos
│   ├── layout/       # Componentes de layout (Sidebar, TopNav)
│   └── ui/          # Componentes base 
├── contexts/        # Contextos de React (AuthContext)
├── hooks/           # Custom hooks
├── lib/             # Utilidades y configuraciones
├── pages/           # Páginas principales de la aplicación
├── services/        # Servicios de API
├── types/           # Definiciones de tipos TypeScript
├── App.tsx          # Componente raíz
└── main.tsx         # Punto de entrada
```

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install

# Crear archivo .env
echo "VITE_API_URL=http://localhost:3000" > .env

# Ejecutar en desarrollo
npm run dev
```



## Autenticación

### Credenciales de Acceso
- **Email**: `admin@ucb.edu.bo`
- **Contraseña**: `admin123`


## Funcionalidades Principales

### 1. Dashboard Principal (`/dashboard`)
- **Vista general** del progreso académico
- **Filtros** por gestión (2025-1, etc.)
- **Gráficos interactivos** con Recharts
- **Métricas clave**:
  - Elementos de competencia
  - Saberes mínimos
  - Recuperatorios
  - Progreso por paralelo

### 2. Carga de Datos (`/dashboard/upload`)
- **Subida de archivos Excel** (.xlsx, .xls)
- **Drag & drop** para archivos
- **Validación de datos** formato adecuado
- **Vista previa** de datos antes de cargar
- **Procesamiento automático** de:
  - Docentes
  - Materias
  - Elementos de competencia
  - Saberes mínimos

### 3. Gestión de Materias
- **Progreso por materia**
- **Análisis por paralelo**
- **Elementos de competencia**
- **Saberes mínimos**
- **Recuperatorios**

## Componentes Principales

### Páginas (`src/pages/`)
- **`Login.tsx`** - Autenticación de usuarios
- **`Dashboard.tsx`** - Dashboard principal con gráficos
- **`DataUpload.tsx`** - Carga masiva de datos
- **`Index.tsx`** - Página de inicio
- **`NotFound.tsx`** - Página 404

### Layout (`src/components/layout/`)
- **`DashboardLayout.tsx`** - Layout principal con sidebar
- **`Sidebar.tsx`** - Navegación lateral
- **`TopNav.tsx`** - Navegación superior

### Carga de Datos (`src/components/dataUpload/`)
- **`FileUploadArea.tsx`** - Área de drag & drop
- **`DataPreview.tsx`** - Vista previa de datos
- **`DataSummary.tsx`** - Resumen de datos procesados
- **`ValidationCard.tsx`** - Validación de datos
- **`UploadConfirmation.tsx`** - Confirmación de carga


##  Base de Datos (en Neon)

### Esquema PostgreSQL
```sql
-- Tabla USUARIO
CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(255) NOT NULL UNIQUE,
  google_id VARCHAR(100),
  activo BOOLEAN NOT NULL DEFAULT true,
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  picture TEXT
);

-- Tabla MATERIA
CREATE TABLE materia (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  image TEXT NOT NULL,
  docente_id INTEGER NOT NULL REFERENCES usuario(id),
  paralelo VARCHAR(20) NOT NULL,
  elementos_totales INTEGER NOT NULL DEFAULT 0,
  rec_totales INTEGER NOT NULL DEFAULT 0,
  rec_tomados INTEGER NOT NULL DEFAULT 0,
  elem_evaluados INTEGER NOT NULL DEFAULT 0,
  elem_completados INTEGER NOT NULL DEFAULT 0,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sigla VARCHAR(20) NOT NULL,
  gestion VARCHAR(20) NOT NULL,
  vigente BOOLEAN NOT NULL DEFAULT true
);

-- Tabla ELEMENTO_COMPETENCIA
CREATE TABLE elemento_competencia (
  id SERIAL PRIMARY KEY,
  materia_id VARCHAR(10) NOT NULL REFERENCES materia(id),
  descripcion TEXT NOT NULL,
  fecha_limite DATE NOT NULL,
  fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
  saberes_totales INTEGER NOT NULL DEFAULT 0,
  saberes_completados INTEGER NOT NULL DEFAULT 0,
  completado BOOLEAN NOT NULL DEFAULT false,
  evaluado BOOLEAN NOT NULL DEFAULT false,
  comentario TEXT,
  fecha_evaluado TIMESTAMP
);

-- Tabla SABER_MINIMO
CREATE TABLE saber_minimo (
  id SERIAL PRIMARY KEY,
  completado BOOLEAN NOT NULL DEFAULT false,
  elemento_competencia_id INTEGER NOT NULL REFERENCES elemento_competencia(id),
  descripcion TEXT NOT NULL
);

-- Tabla RECUPERATORIO
CREATE TABLE recuperatorio (
  id SERIAL PRIMARY KEY,
  completado BOOLEAN NOT NULL DEFAULT false,
  elemento_competencia_id INTEGER NOT NULL REFERENCES elemento_competencia(id),
  fecha_evaluado TIMESTAMP
);
```

## Estilos y Temas

### Tailwind CSS
- **Configuración personalizada** en `tailwind.config.ts`
- **Variables CSS** para colores del tema
- **Responsive design** para móviles y desktop

### Colores del Tema
- **Primary**: Azul institucional UCB
- **Secondary**: Grises neutros
- **Success**: Verde para completados
- **Warning**: Amarillo para pendientes
- **Destructive**: Rojo para errores



## Manejo de Errores

### Validaciones Frontend
- **Tipos de archivo** (.xlsx, .xls)
- **Tamaño de archivo** (máx 10MB)
- **Formato de email**
- **Fechas válidas** (YYYY-MM-DD)
- **Campos requeridos**

### Toast Notifications
- **Éxito**: Carga exitosa, validación correcta
- **Error**: Credenciales inválidas, errores de API
- **Advertencia**: Campos faltantes, archivos inválidos

## Configuración de Desarrollo

### Progreso Académico
- **Elementos completados** vs totales
- **Saberes mínimos** completados
- **Recuperatorios** tomados
- **Progreso por paralelo**

### Visualizaciones
- **Gráficos de barras** para comparaciones
- **Gráficos de línea** para tendencias
- **Gráficos de pastel** para distribuciones
- **Progreso circular** para completitud


**Desarrollado para la Universidad Católica Boliviana** 
