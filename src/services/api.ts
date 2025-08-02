import { ApiResponse, MateriaProgreso, ElementosPorParalelo } from "@/types/materia";
import { ProcessedData, UploadResponse } from "@/types/dataUpload";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getMateriasProgreso = async (gestion?: string): Promise<MateriaProgreso[]> => {
  try {
    const url = new URL(`${API_BASE_URL}/api/materias/progreso`);
    

    if (gestion) {
      url.searchParams.append('gestion', gestion);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Error al obtener datos');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching materias progreso:', error);
    throw error;
  }
};

export const getParalelosProgreso = async (
  nombreMateria: string,
  gestion?: string
): Promise<MateriaProgreso[]> => {
  try {
    const encodedNombreMateria = encodeURIComponent(nombreMateria);
    const url = new URL(`${API_BASE_URL}/api/materias/${encodedNombreMateria}/rendimiento-paralelo`);

    if (gestion) {
      url.searchParams.append('gestion', gestion);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<MateriaProgreso[]> = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Error al obtener datos');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching materias progreso:', error);
    throw error;
  }
};

export const getElementosPorParalelo = async (
  nombreMateria: string,
  gestion?: string
): Promise<ElementosPorParalelo[]> => {
  try {
    const encodedNombreMateria = encodeURIComponent(nombreMateria);
    const url = new URL(`${API_BASE_URL}/api/materia/${encodedNombreMateria}/elementos-por-paralelo`);

    if (gestion) {
      url.searchParams.append('gestion', gestion);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<ElementosPorParalelo[]> = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Error al obtener datos');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching elementos por paralelo:', error);
    throw error;
  }
};

export const uploadExcelData = async (data: ProcessedData): Promise<UploadResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/upload-excel-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    const result: UploadResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Error en la carga');
    }

    return result;
  } catch (error) {
    console.error('Error uploading data:', error);
    throw error;
  }
};

export const downloadTemplate = async () => {
  const templateData = [
    {
      correo_docente: 'juan.perez@email.com',
      nombre_docente: 'Juan Pérez',
      sigla: 'MAT101',
      nombre_materia: 'Matemáticas Básicas',
      gestion: '2024-I',
      paralelo: 'A',
      image_materia: 'https://example.com/math.jpg',
      descripcion_elemento: 'Resolver ecuaciones lineales',
      fecha_limite_elemento: '2024-06-15',
      descripcion_saber: 'Identificar variables en ecuaciones'
    },
    {
      correo_docente: 'juan.perez@email.com',
      nombre_docente: 'Juan Pérez',
      sigla: 'MAT101',
      nombre_materia: 'Matemáticas Básicas',
      gestion: '2024-I',
      paralelo: 'A',
      image_materia: 'https://example.com/math.jpg',
      descripcion_elemento: 'Resolver ecuaciones lineales',
      fecha_limite_elemento: '2024-06-15',
      descripcion_saber: 'Aplicar propiedades algebraicas'
    },
    {
      correo_docente: 'maria.garcia@email.com',
      nombre_docente: 'María García',
      sigla: 'FIS201',
      nombre_materia: 'Física General',
      gestion: '2024-I',
      paralelo: 'B',
      image_materia: 'https://example.com/physics.jpg',
      descripcion_elemento: 'Cinemática básica',
      fecha_limite_elemento: '2024-07-01',
      descripcion_saber: 'Calcular velocidad y aceleración'
    }
  ];

  try {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
    XLSX.writeFile(wb, 'plantilla_carga_datos.xlsx');
  } catch (error) {
    console.error('Error downloading template:', error);
    throw error;
  }
};