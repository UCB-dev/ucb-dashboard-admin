import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UploadConfirmationProps {
  isUploading: boolean;
  onConfirmUpload: () => void;
}

export const UploadConfirmation: React.FC<UploadConfirmationProps> = ({
  isUploading,
  onConfirmUpload
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirmar Carga</CardTitle>
        <CardDescription>
          La validación de datos fue exitosa. Todo listo para subir al sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onConfirmUpload}
          disabled={isUploading}
          className="bg-gradient-to-r from-success to-success/90 hover:shadow-lg"
        >
          {isUploading ? 'Cargando...' : 'Confirmar Carga'}
        </Button>
      </CardContent>
    </Card>
  );
}; 