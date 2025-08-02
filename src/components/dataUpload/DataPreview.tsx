import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PreviewData } from '@/types/dataUpload';

interface DataPreviewProps {
  previewData: PreviewData;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ previewData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vista Previa de Datos</CardTitle>
        <CardDescription>
          Aquí puedes ver todos tus datos cargados ({previewData.totalRows} filas en total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-auto max-w-5xl mx-auto" style={{ height: '400px' }}>
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-muted/50 z-10">
              <tr>
                {previewData.headers.map((header, index) => (
                  <th 
                    key={index} 
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-b"
                    style={{ minWidth: '150px' }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-muted/20 border-b">
                  {previewData.headers.map((header, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className="px-3 py-2 whitespace-nowrap text-sm text-gray-900"
                      style={{ minWidth: '150px' }}
                      title={row[header as keyof typeof row] || '-'}
                    >
                      {row[header as keyof typeof row] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}; 