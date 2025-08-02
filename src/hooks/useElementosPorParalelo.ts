import { useState, useEffect } from 'react';
import { getElementosPorParalelo } from '../services/api';
import type { ElementosPorParalelo } from '../types/materia';

export const useElementosPorParalelo = (nombreMateria: string, gestion?: string) => {
  const [elementos, setElementos] = useState<ElementosPorParalelo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchElementos = async () => {
    if (!nombreMateria || nombreMateria.trim() === '') {
      setElementos([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getElementosPorParalelo(nombreMateria, gestion);
      setElementos(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar elementos por paralelo');
      setElementos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElementos();
  }, [nombreMateria, gestion]);

  return {
    elementos,
    loading,
    error,
    refetch: fetchElementos
  };
}; 