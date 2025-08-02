export interface MateriaProgreso {
  nombre_materia: string;
  elementos_totales: number;
  elem_completados: number;
  elem_evaluados: number;
  rec_totales: number;
  rec_tomados: number;
  progreso_general?: number;
  evaluaciones?: number;
  saberes_minimos?: number;
  paralelo?: string;
}

export interface SaberMinimo {
  descripcion: string;
  completado: boolean;
}

export interface Elemento {
  id: number;
  descripcion: string;
  completado: boolean;
  evaluado: boolean;
  saberes_totales: number;
  saberes_completados: number;
  fecha_limite: string;
  fecha_registro: string | null;
  fecha_evaluado: string | null;
  comentario: string | null;
  saberes_minimos: [string, boolean][];
  recuperatorios: [boolean, string | null][];
}

export interface ElementosPorParalelo {
  paralelo: string;
  docente: string;
  elementos: Elemento[];
}

export interface ParaleloDetalle {
  paralelo: string;
  docente: string;
  completado: boolean;
  evaluado: boolean;
  saberes_completados: number;
  saberes_totales: number;
  fecha_limite: string;
  fecha_registro: string | null;
  fecha_evaluado: string | null;
  comentario: string | null;
  saberes_minimos: [string, boolean][];
}

export interface ApiResponse<T = MateriaProgreso[]> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}