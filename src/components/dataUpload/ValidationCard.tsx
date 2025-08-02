import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ValidationCardProps {
  validationStatus: 'idle' | 'validating' | 'valid' | 'invalid';
  validationErrors: string[];
  onValidate: () => void;
}

export const ValidationCard: React.FC<ValidationCardProps> = ({
  validationStatus,
  validationErrors,
  onValidate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Validación de Datos</span>
          {validationStatus === 'valid' && <CheckCircle className="h-5 w-5 text-success" />}
          {validationStatus === 'invalid' && <AlertCircle className="h-5 w-5 text-destructive" />}
        </CardTitle>
        <CardDescription>
          Valida la estructura y el contenido de los datos antes de cargarlos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={onValidate}
            disabled={validationStatus === 'validating'}
            variant={validationStatus === 'valid' ? 'secondary' : 'default'}
          >
            {validationStatus === 'validating' ? 'Validando...' : 'Validar Datos'}
          </Button>
          
          {validationStatus !== 'idle' && (
            <Badge 
              variant={validationStatus === 'valid' ? 'default' : 'destructive'}
              className={validationStatus === 'valid' ? 'bg-success hover:bg-success/90' : ''}
            >
              {validationStatus === 'validating' && 'Validando...'}
              {validationStatus === 'valid' && 'Válido'}
              {validationStatus === 'invalid' && 'Inválido'}
            </Badge>
          )}
        </div>

        {validationErrors.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <h4 className="font-medium text-destructive mb-2">Errores de validación:</h4>
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-destructive flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 