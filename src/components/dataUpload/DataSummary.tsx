import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProcessedData } from '@/types/dataUpload';

interface DataSummaryProps {
  processedData: ProcessedData;
}

export const DataSummary: React.FC<DataSummaryProps> = ({ processedData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Datos Procesados</CardTitle>
        <CardDescription>
          Datos que serán cargados al sistema con contadores calculados automáticamente (1 recuperatorio por elemento de competencia)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Docentes</h3>
            <p className="text-2xl font-bold text-blue-600">{processedData.docentes.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Materias</h3>
            <p className="text-2xl font-bold text-green-600">{processedData.materias.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Elementos de Competencia</h3>
            <p className="text-2xl font-bold text-purple-600">{processedData.elementos.length}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Detalle por Materia:</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Materia</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Elementos</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Saberes</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Recuperatorios</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Docente</th>
                </tr>
              </thead>
              <tbody>
                {processedData.materias.map((materia, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">
                      <div>
                        <div className="font-medium">{materia.name}</div>
                        <div className="text-xs text-gray-500">{materia.id}</div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Badge variant="outline">{materia.elementos_totales}</Badge>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Badge variant="outline" className="bg-blue-50">{materia.saberes_totales}</Badge>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Badge variant="outline" className="bg-orange-50">{materia.rec_totales}</Badge>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <div className="text-sm">
                        {processedData.docentes.find(d => d.correo === materia.docente_correo)?.nombre}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 