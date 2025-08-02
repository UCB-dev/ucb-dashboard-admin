import React, { useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, X } from 'lucide-react';
import { UploadedFile } from '@/types/dataUpload';

interface FileUploadAreaProps {
  uploadedFile: UploadedFile | null;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  formatFileSize: (bytes: number) => string;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  uploadedFile,
  onFileSelect,
  onRemoveFile,
  formatFileSize
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sube un Archivo Excel</CardTitle>
        <CardDescription>
          Selecciona un archivo Excel (.xlsx o .xls) con los datos usando el formato de la plantilla.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <Upload className={`mx-auto h-12 w-12 mb-4 transition-colors ${
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <div className="space-y-2">
              <div className="text-lg font-medium">
                {isDragOver ? 'Suelta el archivo aquí' : 'Haz clic para subir el archivo'}
              </div>
              <div className="text-sm text-muted-foreground">
                {isDragOver ? 'o arrástralo y suéltalo aquí' : 'o arrástralo y suéltalo aquí'}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Tamaño máximo del archivo: 10MB | Formatos compatibles: .xlsx, .xls
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(uploadedFile.size)} • Cargado {new Date(uploadedFile.lastModified).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onRemoveFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 