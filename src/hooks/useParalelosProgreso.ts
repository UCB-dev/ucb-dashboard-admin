import { useState, useEffect } from 'react';
import { getParalelosProgreso } from '../services/api'; 
import type { MateriaProgreso } from '../types/materia';

export const useParalelosProgreso = (nombreMateria: string, gestion?: string) => {
  const [paralelos, setParalelos] = useState<MateriaProgreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParalelos = async () => {
    if (!nombreMateria || nombreMateria.trim() === '') {
      setParalelos([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getParalelosProgreso(nombreMateria, gestion);
      setParalelos(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar paralelos');
      setParalelos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParalelos();
  }, [nombreMateria, gestion]);

  return {
    paralelos,
    loading,
    error,
    refetch: fetchParalelos
  };
};