import React, { useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useDataUpload } from '@/hooks/useDataUpload';
import { FileUploadArea } from '@/components/dataUpload/FileUploadArea';
import { DataPreview } from '@/components/dataUpload/DataPreview';
import { DataSummary } from '@/components/dataUpload/DataSummary';
import { ValidationCard } from '@/components/dataUpload/ValidationCard';
import { UploadConfirmation } from '@/components/dataUpload/UploadConfirmation';

const DataUpload = () => {
  const {
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
  } = useDataUpload();

  const handleFileSelect = useCallback((file: File) => {
    processFile(file);
  }, [processFile]);

  return (
    <div className="space-y-6 max-w-full">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Subir Datos</h1>
        <p className="text-muted-foreground">
          Sube un archivo Excel para cargar tus datos de docentes, materias, elementos de competencia, saberes mínimos y recuperatorios
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Descargar Plantilla</CardTitle>
          <CardDescription>
            Descarga la plantilla Excel con el formato correcto para cargar tus datos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleDownloadTemplate} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Descargar Plantilla Excel
          </Button>
        </CardContent>
      </Card>

      <FileUploadArea
        uploadedFile={uploadedFile}
        onFileSelect={handleFileSelect}
        onRemoveFile={handleRemoveFile}
        formatFileSize={formatFileSize}
      />

     
      {previewData && (
        <DataPreview previewData={previewData} />
      )}

   
      {processedData && (
        <DataSummary processedData={processedData} />
      )}

      {uploadedFile && (
        <ValidationCard
          validationStatus={validationStatus}
          validationErrors={validationErrors}
          onValidate={validateData}
        />
      )}

      {validationStatus === 'valid' && (
        <UploadConfirmation
          isUploading={isUploading}
          onConfirmUpload={handleUpload}
        />
      )}
    </div>
  );
};

export default DataUpload;