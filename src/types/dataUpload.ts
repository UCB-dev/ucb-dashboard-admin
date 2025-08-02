export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface ExcelRow {
  correo_docente: string;
  nombre_docente: string;
  sigla: string;
  nombre_materia: string;
  gestion: string;
  paralelo: string;
  image_materia: string;
  descripcion_elemento: string;
  fecha_limite_elemento: string;
  descripcion_saber: string;
}

export interface PreviewData {
  headers: string[];
  rows: ExcelRow[];
  totalRows: number;
}

export interface ProcessedDocente {
  correo: string;
  nombre: string;
  picture?: string;
}

export interface ProcessedMateria {
  id: string;
  name: string;
  image: string;
  docente_correo: string;
  paralelo: string;
  sigla: string;
  gestion: string;
  elementos_totales: number;
  rec_totales: number;
  saberes_totales: number;
}

export interface ProcessedElemento {
  materia_id: string;
  descripcion: string;
  fecha_limite: string;
  saberes: string[];
  saberes_totales: number;
}

export interface ProcessedData {
  docentes: ProcessedDocente[];
  materias: ProcessedMateria[];
  elementos: ProcessedElemento[];
}

export interface UploadResponse {
  success: boolean;
  message: string;
  resumen?: {
    docentes_procesados: number;
    materias_procesadas: number;
    elementos_procesados: number;
    saberes_totales: number;
  };
  error?: string;
} 