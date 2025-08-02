import { useState, useEffect } from 'react';
import { getMateriasProgreso } from '../services/api';
import type { MateriaProgreso } from '../types/materia';

export const useMateriasProgreso = (gestion?: string) => {
  const [materias, setMaterias] = useState<MateriaProgreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMateriasProgreso(gestion);
      setMaterias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterias();
  }, [gestion]);

  return {
    materias,
    loading,
    error,
    refetch: fetchMaterias
  };
};
