import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { 
  UploadedFile, 
  ExcelRow, 
  PreviewData, 
  ProcessedData 
} from '@/types/dataUpload';
import { uploadExcelData, downloadTemplate } from '@/services/api';

const expectedHeaders = [
  'correo_docente',
  'nombre_docente', 
  'sigla',
  'nombre_materia',
  'gestion',
  'paralelo',
  'image_materia',
  'descripcion_elemento',
  'fecha_limite_elemento',
  'descripcion_saber'
];

export const useDataUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const processExcelData = useCallback((data: ExcelRow[]) => {
    const docentes = new Map();
    const materias = new Map();
    const elementosMap = new Map();
    let materiaCounter = 1; 

    data.forEach(row => {
      if (!docentes.has(row.correo_docente)) {
        docentes.set(row.correo_docente, {
          correo: row.correo_docente,
          nombre: row.nombre_docente,
          picture: null
        });
      }

      const materiaKey = `${row.sigla}-${row.gestion}-${row.paralelo}`;
      if (!materias.has(materiaKey)) {
        materias.set(materiaKey, {
          id: materiaCounter.toString(),
          name: row.nombre_materia,
          image: row.image_materia,
          docente_correo: row.correo_docente,
          paralelo: row.paralelo,
          sigla: row.sigla,
          gestion: row.gestion
        });
        materiaCounter++; 
      }
      
      const elementoKey = `${materiaKey}-${row.descripcion_elemento}`;
      if (!elementosMap.has(elementoKey)) {
        const materia = materias.get(materiaKey);
        elementosMap.set(elementoKey, {
          materia_id: materia.id, 
          descripcion: row.descripcion_elemento,
          fecha_limite: row.fecha_limite_elemento,
          saberes: []
        });
      }

      const elemento = elementosMap.get(elementoKey);
      if (!elemento.saberes.includes(row.descripcion_saber)) {
        elemento.saberes.push(row.descripcion_saber);
      }
    });

    const materiasConContadores = Array.from(materias.values()).map(materia => {
      const elementosDeMateria = Array.from(elementosMap.values()).filter(
        elemento => elemento.materia_id === materia.id
      );
      
      const elementosTotales = elementosDeMateria.length;
      const saberesTotales = elementosDeMateria.reduce((sum, el) => sum + el.saberes.length, 0);
      const recTotales = elementosTotales; 

      return {
        ...materia,
        elementos_totales: elementosTotales,
        rec_totales: recTotales,
        saberes_totales: saberesTotales
      };
    });

    
    const elementosConContadores = Array.from(elementosMap.values()).map(elemento => ({
      ...elemento,
      saberes_totales: elemento.saberes.length
    }));

    const processed: ProcessedData = {
      docentes: Array.from(docentes.values()),
      materias: materiasConContadores,
      elementos: elementosConContadores
    };

    setProcessedData(processed);
  }, []);

  const processFile = useCallback(async (file: File) => {

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Tipo de archivo inválido",
        description: "Por favor, sube un archivo Excel (.xlsx o .xls)",
        variant: "destructive",
      });
      return;
    }


    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "El archivo es muy grande. Tamaño máximo: 10MB",
        variant: "destructive",
      });
      return;
    }

    const fileInfo: UploadedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    };

    setUploadedFile(fileInfo);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];

      if (jsonData.length === 0) {
        toast({
          title: "Archivo vacío",
          description: "El archivo Excel está vacío",
          variant: "destructive",
        });
        return;
      }

      const headers = Object.keys(jsonData[0]);

      const preview: PreviewData = {
        headers,
        rows: jsonData,
        totalRows: jsonData.length
      };

      setPreviewData(preview);
      setValidationStatus('idle');
      setValidationErrors([]);

      processExcelData(jsonData);

      toast({
        title: "Archivo cargado exitosamente",
        description: `${file.name} ha sido cargado para vista previa`,
      });

    } catch (error) {
      console.error('Error reading Excel file:', error);
      toast({
        title: "Error al leer archivo",
        description: "Error al leer el archivo Excel",
        variant: "destructive",
      });
    }
  }, [toast, processExcelData]);

  const validateData = useCallback(async () => {
    if (!previewData || !processedData) return;

    setValidationStatus('validating');
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    const errors: string[] = [];

    const missingHeaders = expectedHeaders.filter(header => 
      !previewData.headers.includes(header)
    );
    
    if (missingHeaders.length > 0) {
      errors.push(`Faltan columnas requeridas: ${missingHeaders.join(', ')}`);
    }

    
    processedData.docentes.forEach((docente, index) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(docente.correo)) {
        errors.push(`Email inválido en docente ${index + 1}: ${docente.correo}`);
      }
    });

  
    processedData.elementos.forEach((elemento, index) => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(elemento.fecha_limite)) {
        errors.push(`Fecha inválida en elemento ${index + 1}: ${elemento.fecha_limite}. Use formato YYYY-MM-DD`);
      }
    });

  
    previewData.rows.forEach((row, index) => {
      expectedHeaders.forEach(header => {
        if (!row[header as keyof ExcelRow] || row[header as keyof ExcelRow].trim() === '') {
          errors.push(`Campo vacío en fila ${index + 2}, columna '${header}'`);
        }
      });
    });

    setValidationErrors(errors);
    setValidationStatus(errors.length === 0 ? 'valid' : 'invalid');

    if (errors.length === 0) {
      toast({
        title: "Validación exitosa",
        description: "Todos los datos son válidos y están listos para cargar",
      });
    } else {
      toast({
        title: "Validación fallida",
        description: `Se encontraron ${errors.length} errores en los datos`,
        variant: "destructive",
      });
    }
  }, [previewData, processedData, toast]);

  const handleUpload = useCallback(async () => {
    if (!processedData || validationStatus !== 'valid') return;

    setIsUploading(true);
    
    try {
      console.log('Iniciando carga de datos:', processedData);
      
      const result = await uploadExcelData(processedData);
      
      console.log('Respuesta del servidor:', result);
      
      const successMessage = `Carga completada exitosamente:
        • ${result.resumen?.docentes_procesados || 0} docentes procesados
        • ${result.resumen?.materias_procesadas || 0} materias procesadas
        • ${result.resumen?.elementos_procesados || 0} elementos procesados
        • ${result.resumen?.saberes_totales || 0} saberes totales`;
      
      toast({
        title: "Carga exitosa",
        description: successMessage,
      });

      setUploadedFile(null);
      setPreviewData(null);
      setProcessedData(null);
      setValidationStatus('idle');
      setValidationErrors([]);
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error al cargar",
        description: error instanceof Error ? error.message : "Error al cargar los datos al sistema",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [processedData, validationStatus, toast]);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setPreviewData(null);
    setProcessedData(null);
    setValidationStatus('idle');
    setValidationErrors([]);
  }, []);

  const handleDownloadTemplate = useCallback(async () => {
    try {
      await downloadTemplate();
      toast({
        title: "Plantilla descargada",
        description: "La plantilla Excel ha sido descargada exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error al descargar",
        description: "Error al descargar la plantilla",
        variant: "destructive",
      });
    }
  }, [toast]);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return {
    uploadedFile,
    previewData,
    processedData,
    validationStatus,
    validationErrors,
    isUploading,
    processFile,
    validateData,
    handleUpload,
    handleRemoveFile,
    handleDownloadTemplate,
    formatFileSize
  };
}; 