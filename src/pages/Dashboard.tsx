import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { useMateriasProgreso } from '../hooks/useMateriasProgreso';
import { useParalelosProgreso } from '../hooks/useParalelosProgreso';
import { useElementosPorParalelo } from '../hooks/useElementosPorParalelo';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { ParaleloDetalle } from '../types/materia';

interface MateriasProgresoProps {
  gestion?: string;
}

const Dashboard: React.FC<MateriasProgresoProps> = ({ gestion }) => {

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedGestion, setSelectedGestion] = useState('2025-1');
  const [paraleloSeleccionado, setParaleloSeleccionado] = useState<string>('');

  const [competenciaTab, setCompetenciaTab] = useState<'saberes' | 'recuperatorios'>('saberes');


  const { materias, loading: materiasLoading, error: materiasError, refetch: refetchMaterias } = useMateriasProgreso(
    selectedGestion === '2025-1' ? undefined : selectedGestion
  );

  const { 
    paralelos, 
    loading: paralelosLoading, 
    error: paralelosError, 
    refetch: refetchParalelos 
  } = useParalelosProgreso(selectedSubject || '', selectedGestion);

  const {
    elementos,
    loading: elementosLoading,
    error: elementosError,
    refetch: refetchElementos
  } = useElementosPorParalelo(selectedSubject || '', selectedGestion);
  

  
  const paraleloKeys = useMemo(() => elementos.map(p => p.paralelo), [elementos]);

  useEffect(() => {
    if (paraleloKeys.length > 0) {
      setParaleloSeleccionado(prev =>
        paraleloKeys.includes(prev) ? prev : paraleloKeys[0]
      );
    } else {
      setParaleloSeleccionado('');
    }
  }, [paraleloKeys.join(",")]);
  
  

  const handleCardClick = (nombreMateria: string) => {
    setSelectedSubject(nombreMateria);
  };
  
  const handleResetFilter = () => {
    setSelectedSubject(null);
  };
 

  

  const formatChartData = () => {
    if (!selectedSubject || !paralelos || paralelos.length === 0) {
      
      return [];
    }
    
  
    return paralelos.map(paralelo => ({
      paralelo: paralelo.paralelo,
      
      elementos_totales: paralelo.elementos_totales,
      elem_evaluados: paralelo.elem_evaluados,
      elem_completados: paralelo.elem_completados,
      rec_tomados: paralelo.rec_tomados,
      rec_totales: paralelo.rec_totales,
      
      completados: paralelo.elem_completados,
      evaluados: paralelo.elem_evaluados,
      recuperatorios: paralelo.rec_tomados,
      
      completados_porcentaje: Math.round((paralelo.elem_completados / paralelo.elementos_totales) * 100) || 0,
      evaluados_porcentaje: Math.round((paralelo.elem_evaluados / paralelo.elementos_totales) * 100) || 0,
      recuperatorios_porcentaje: Math.round((paralelo.rec_tomados / paralelo.rec_totales) * 100) || 0
    }));
  };

  const formatElementosChartData = () => {
    if (!elementos || elementos.length === 0) {
      return [];
    }

    const allElementos = new Map();
    
    elementos.forEach(paralelo => {
      paralelo.elementos.forEach(elemento => {
        
        const numeroElemento = elemento.descripcion.split('.')[0];
        const ecKey = `EC${numeroElemento}`;
        
        if (!allElementos.has(ecKey)) {
          allElementos.set(ecKey, {
            id: elemento.id,
            descripcion: elemento.descripcion,
            ec: ecKey,
            saberes_totales: elemento.saberes_totales,
            saberes_minimos: elemento.saberes_minimos
          });
        }
      });
    });

    
    const ecData = Array.from(allElementos.values()).map(elemento => {
      const numeroElemento = elemento.descripcion.split('.')[0];
      const ecDataPoint: any = {
        ec: `EC${numeroElemento}`,
        descripcion: elemento.descripcion
      };

      elementos.forEach(paralelo => {
        const elementoEnParalelo = paralelo.elementos.find(e => {
          const numeroElemento = e.descripcion.split('.')[0];
          return numeroElemento === elemento.ec.replace('EC', '');
        });
        if (elementoEnParalelo) {
          const porcentaje = Math.round((elementoEnParalelo.saberes_completados / elementoEnParalelo.saberes_totales) * 100);
          ecDataPoint[paralelo.paralelo] = porcentaje;
          ecDataPoint[`${paralelo.paralelo}_data`] = {
            completado: elementoEnParalelo.completado,
            evaluado: elementoEnParalelo.evaluado,
            saberes_completados: elementoEnParalelo.saberes_completados,
            saberes_totales: elementoEnParalelo.saberes_totales,
            saberes_minimos: elementoEnParalelo.saberes_minimos,
            descripcion: elementoEnParalelo.descripcion,
            fecha_limite: elementoEnParalelo.fecha_limite,
            fecha_registro: elementoEnParalelo.fecha_registro,
            fecha_evaluado: elementoEnParalelo.fecha_evaluado,
            comentario: elementoEnParalelo.comentario
          };
        } else {
          ecDataPoint[paralelo.paralelo] = 0;
          ecDataPoint[`${paralelo.paralelo}_data`] = null;
        }
      });

      return ecDataPoint;
    });

    return ecData;
  };

  const chartData = formatChartData();
  const elementosChartData = formatElementosChartData();
  const formatRecuperatoriosChartData = () => {
    if (!elementos || elementos.length === 0) return [];
    const allElementos = new Map();
    elementos.forEach(paralelo => {
      paralelo.elementos.forEach(elemento => {
        const numeroElemento = elemento.descripcion.split('.')[0];
        const ecKey = `EC${numeroElemento}`;
        if (!allElementos.has(ecKey)) {
          allElementos.set(ecKey, {
            id: elemento.id,
            descripcion: elemento.descripcion,
            ec: ecKey,
            saberes_totales: elemento.saberes_totales,
            saberes_minimos: elemento.saberes_minimos
          });
        }
      });
    });
    
    const ecData = Array.from(allElementos.values()).map(elemento => {
      const numeroElemento = elemento.descripcion.split('.')[0];
      const ecDataPoint: any = {
        ec: `EC${numeroElemento}`,
        descripcion: elemento.descripcion
      };
      elementos.forEach(paralelo => {
        const elementoEnParalelo = paralelo.elementos.find(e => {
          const numeroElemento = e.descripcion.split('.')[0];
          return numeroElemento === elemento.ec.replace('EC', '');
        });
        if (elementoEnParalelo) {
          
          const recTotales = elementoEnParalelo.recuperatorios?.length ?? 0;
          const recTomados = elementoEnParalelo.recuperatorios?.filter(r => r[0]).length ?? 0;
          const recFechas = (elementoEnParalelo.recuperatorios || []).filter(r => r[0] && r[1]).map(r => r[1]);
          const porcentaje = recTotales > 0 ? Math.round((recTomados / recTotales) * 100) : 0;
          ecDataPoint[paralelo.paralelo] = porcentaje;
          ecDataPoint[`${paralelo.paralelo}_data`] = {
            recTomados,
            recTotales,
            recFechas,
            descripcion: elementoEnParalelo.descripcion,
            ec: ecDataPoint.ec,
            completado: elementoEnParalelo.completado,
            evaluado: elementoEnParalelo.evaluado
          };
        } else {
          ecDataPoint[paralelo.paralelo] = 0;
          ecDataPoint[`${paralelo.paralelo}_data`] = { 
            recTomados: 0, 
            recTotales: 0, 
            recFechas: [], 
            descripcion: '', 
            ec: ecDataPoint.ec,
            completado: false,
            evaluado: false
          };
        }
      });
      return ecDataPoint;
    });
    return ecData;
  };
  const recuperatoriosChartData = formatRecuperatoriosChartData();

  if (materiasLoading) return <div>Cargando materias...</div>;
  if (materiasError) return <div>Error: {materiasError}</div>;
  
  
  const paralelosDetalle: ParaleloDetalle[] = paraleloKeys.map(pk => {
    const paraleloObj = elementos.find(e => e.paralelo === pk);
    return {
      paralelo: pk,
      docente: paraleloObj?.docente || '',
      completado: elementosChartData[0]?.[`${pk}_data`]?.completado || false,
      evaluado: elementosChartData[0]?.[`${pk}_data`]?.evaluado || false,
      saberes_completados: elementosChartData[0]?.[`${pk}_data`]?.saberes_completados || 0,
      saberes_totales: elementosChartData[0]?.[`${pk}_data`]?.saberes_totales || 0,
      fecha_limite: elementosChartData[0]?.[`${pk}_data`]?.fecha_limite || '',
      fecha_registro: elementosChartData[0]?.[`${pk}_data`]?.fecha_registro || null,
      fecha_evaluado: elementosChartData[0]?.[`${pk}_data`]?.fecha_evaluado || null,
      comentario: elementosChartData[0]?.[`${pk}_data`]?.comentario || null,
      saberes_minimos: elementosChartData[0]?.[`${pk}_data`]?.saberes_minimos || []
    };
  });

  
  const ganttData = paralelosDetalle.find(p => p.paralelo === paraleloSeleccionado)?.saberes_minimos.map((saber, idx) => {
    return {
      ec: `EC${idx + 1}`,
      descripcion: saber[0],
      fecha_limite: paralelosDetalle.find(p => p.paralelo === paraleloSeleccionado)?.fecha_limite,
      fecha_registro: paralelosDetalle.find(p => p.paralelo === paraleloSeleccionado)?.fecha_registro,
      fecha_evaluado: paralelosDetalle.find(p => p.paralelo === paraleloSeleccionado)?.fecha_evaluado
    };
  }) || [];

  const CustomElementosTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      
     
      
      const paralelosConDatos = payload
        .map((entry: any) => {
          const paraleloKey = entry.dataKey;
          const paraleloData = data?.[`${paraleloKey}_data`];
          return paraleloData ? { key: paraleloKey, data: paraleloData } : null;
        })
        .filter(Boolean);

      if (paralelosConDatos.length === 0) return null;

      const saberesMinimos = paralelosConDatos[0].data.saberes_minimos;
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg max-w-lg">
          <div className="mb-3">
            <p className="font-semibold text-foreground">{data.descripcion}</p>
            <p className="text-sm text-muted-foreground">Elemento: {data.ec}</p>
          </div>
          
          
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Saberes Mínimos:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-1 pr-2 font-medium">Saber</th>
                    {paralelosConDatos.map((paralelo: any) => (
                      <th key={paralelo.key} className="text-center py-1 px-1 font-medium">
                        {paralelo.key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {saberesMinimos.map((saber: any, index: number) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-1 pr-2 text-foreground">
                        {saber[0]}
                      </td>
                      {paralelosConDatos.map((paralelo: any) => {
                        const saberEnParalelo = paralelo.data.saberes_minimos[index];
                        return (
                          <td key={paralelo.key} className="text-center py-1 px-1">
                            <span className={saberEnParalelo[1] ? 'text-green-500' : 'text-red-500'}>
                              {saberEnParalelo[1] ? '✓' : '✗'}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };




  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm" style={{ color: 'hsl(var(--chart-1))' }}>
              <span className="font-medium">Elementos Completados:</span> {data?.elem_completados}/{data?.elementos_totales} ({data?.completados_porcentaje}%)
            </p>
            <p className="text-sm" style={{ color: 'hsl(var(--chart-2))' }}>
              <span className="font-medium">Elementos Evaluados:</span> {data?.elem_evaluados}/{data?.elementos_totales} ({data?.evaluados_porcentaje}%)
            </p>
            <p className="text-sm" style={{ color: 'hsl(var(--chart-3))' }}>
              <span className="font-medium">Recuperatorios Tomados:</span> {data?.rec_tomados}/{data?.rec_totales} ({data?.recuperatorios_porcentaje}%)
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  
  const CustomRecuperatoriosTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
    
      const paralelosConDatos = payload
        .map((entry: any) => {
          const paraleloKey = entry.dataKey;
          const paraleloData = data?.[`${paraleloKey}_data`];
          return paraleloData ? { key: paraleloKey, data: paraleloData } : null;
        })
        .filter(Boolean);
      if (paralelosConDatos.length === 0) return null;
      
      const maxRecuperatorios = Math.max(
        ...paralelosConDatos.map(p => (p.data.recFechas?.length ?? 0) > 0 ? p.data.recTotales : 0)
      );
      
      const totalTomados = paralelosConDatos.reduce((acc, p) => acc + (p.data.recTomados ?? 0), 0);
      const totalPosibles = paralelosConDatos.reduce((acc, p) => acc + (p.data.recTotales ?? 0), 0);
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg max-w-lg">
          <div className="mb-3">
            <p className="font-semibold text-foreground">{data.descripcion}</p>
            <p className="text-sm text-muted-foreground">Elemento: {data.ec}</p>
            <p className="text-xs font-medium text-muted-foreground mt-2 mb-1">
              Recuperatorios tomados: <span className="text-foreground font-bold">{totalTomados}</span> / <span className="text-foreground font-bold">{totalPosibles}</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1 pr-2 font-medium">N°</th>
                  {paralelosConDatos.map((paralelo: any) => (
                    <th key={paralelo.key} className="text-center py-1 px-1 font-medium">
                      {paralelo.key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: maxRecuperatorios }).map((_, recIdx) => (
                  <tr key={recIdx} className="border-b border-border/50">
                    <td className="py-1 pr-2 text-foreground">{recIdx + 1}</td>
                    {paralelosConDatos.map((paralelo: any) => {
                      const recs = data?.[`${paralelo.key}_data`]?.recFechas || [];
                      const recTotales = data?.[`${paralelo.key}_data`]?.recTotales || 0;
                      let cellContent = <span className="text-muted-foreground">No tomado</span>;
                      if (recIdx < recTotales) {
                        const fecha = recs[recIdx];
                        if (fecha) {
                          cellContent = <span>{new Date(fecha).toLocaleDateString('es-ES')}</span>;
                        }
                      }
                      return (
                        <td key={paralelo.key} className="text-center py-1 px-1">
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resumen de Progreso</h1>
          <p className="text-muted-foreground">Seguimiento integral de elementos de competencia y rendimiento docente</p>
        </div>

        
        
        <div className="flex space-x-4">
          <Select value={selectedGestion} onValueChange={setSelectedGestion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Gestion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-2">Actual 2-2025</SelectItem>
              <SelectItem value="2025-1">1-2025</SelectItem>
              <SelectItem value="2024-2">2-2024</SelectItem>
              <SelectItem value="2024-1">1-2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedSubject && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-700">
            Filtrando por: {selectedSubject}
          </span>
          <button
            onClick={handleResetFilter}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Limpiar filtro
          </button>
        </div>
      )}
    
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {materias.map((subject) => (
            <CarouselItem 
              key={subject.nombre_materia} 
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Card 
                className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
                  selectedSubject === subject.nombre_materia 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : ''
                }`}
                onClick={() => handleCardClick(subject.nombre_materia)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{subject.nombre_materia}</CardTitle>
                  <CardDescription>Progreso General</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{subject.progreso_general}%</span>
                      <span className="text-sm text-muted-foreground">{(subject.rec_tomados/subject.rec_totales*100).toFixed()}% recuperatorios <br /> completados</span>
                    </div>
                    <Progress value={subject.progreso_general} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Evaluaciones: {(subject.elem_evaluados/subject.elementos_totales*100).toFixed()}%</span>
                      <span>Saberes Minimos: {subject.saberes_minimos}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>
              {selectedSubject ? `Rendimiento por Paralelo - ${selectedSubject}` : 'Rendimiento por Paralelo'}
            </CardTitle>
            <CardDescription>
              {selectedSubject 
                ? `Progreso de evaluación por paralelo para ${selectedSubject}`
                : 'Selecciona una materia para ver el detalle por paralelos'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {paralelosLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Cargando paralelos...</p>
                </div>
              </div>
            ) : paralelosError ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-red-500">Error: {paralelosError}</p>
              </div>
            ) : !selectedSubject ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-500">Haz clic en una materia para ver el detalle por paralelos</p>
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-500">No hay datos disponibles para esta materia</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} onClick={state => {
                              if (state && state.activeLabel) setParaleloSeleccionado(state.activeLabel as string);
                            }}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                              <XAxis dataKey="paralelo" fontSize={12} />
                              <YAxis fontSize={12} />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="completados" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="evaluados" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="recuperatorios" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                            </BarChart>
              </ResponsiveContainer>
            )}
            <div className="text-xs mt-2 text-muted-foreground">Haz clic en una barra para seleccionar el paralelo.</div>

          </CardContent>
        </Card>

        {}
        <Card>
                        <CardHeader>
                          <CardTitle>Detalle por Paralelo</CardTitle>
                          <CardDescription>
                            Estado de entrega y evaluación de saberes mínimos para el paralelo seleccionado.
                          </CardDescription>
                          <div className="mt-2">
                            <span className="font-semibold">Paralelo seleccionado:</span> {paralelosDetalle.find(p => p.paralelo === paraleloSeleccionado)?.paralelo} <br />
                            <span className="font-semibold">Docente:</span> {paralelosDetalle.find(p => p.paralelo === paraleloSeleccionado)?.docente}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto rounded-lg border border-border bg-background shadow-sm">
                            <table className="w-full text-xs border-collapse">
                              <thead className="bg-muted sticky top-0 z-10">
                                <tr>
                                  <th className="text-left py-2 px-3 font-semibold">Elemento</th>
                                  <th className="text-left py-2 px-3 font-semibold">Fecha Límite</th>
                                  <th className="text-left py-2 px-3 font-semibold">Fecha Registro</th>
                                  <th className="text-left py-2 px-3 font-semibold">Fecha Evaluado</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ganttData.map((row, idx) => {
                                  const registro = row.fecha_registro ? new Date(row.fecha_registro) : null;
                                  const limite = row.fecha_limite ? new Date(row.fecha_limite) : null;
                                  const registroDespuesLimite = registro && limite && registro > limite;
                                  return (
                                    <tr
                                      key={idx}
                                      className={idx % 2 === 0 ? "bg-white dark:bg-muted/30" : "bg-muted/10 dark:bg-muted/50"}
                                    >
                                      <td className="py-2 px-3 font-medium">{row.descripcion}</td>
                                      <td className="py-2 px-3">
                                        {row.fecha_limite
                                          ? new Date(row.fecha_limite).toLocaleDateString('es-ES')
                                          : <span className="text-muted-foreground">No registrado</span>}
                                      </td>
                                      <td className={`py-2 px-3 ${registroDespuesLimite ? 'bg-red-100 text-red-700 font-bold rounded' : ''}`}> 
                                        {row.fecha_registro
                                          ? <>
                                              {new Date(row.fecha_registro).toLocaleDateString('es-ES')}
                                              {registroDespuesLimite && (
                                                <span className="ml-2 inline-block px-2 py-0.5 rounded bg-red-200 text-red-800 text-[10px] font-semibold align-middle">
                                                  Fuera de plazo
                                                </span>
                                              )}
                                            </>
                                          : <span className="text-muted-foreground">No registrado</span>}
                                      </td>
                                      <td className="py-2 px-3">
                                        {row.fecha_evaluado
                                          ? new Date(row.fecha_evaluado).toLocaleDateString('es-ES')
                                          : <span className="text-muted-foreground">No registrado</span>}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>

        
        <Tabs value={competenciaTab} onValueChange={v => setCompetenciaTab(v as 'saberes' | 'recuperatorios')} className="mb-4">
          <TabsList>
            <TabsTrigger value="saberes">Saberes mínimos</TabsTrigger>
            <TabsTrigger value="recuperatorios">Recuperatorios</TabsTrigger>
          </TabsList>
        </Tabs>
        {competenciaTab === 'saberes' ? (
          
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedSubject ? `Elementos de Competencia - ${selectedSubject}` : 'Elementos de Competencia'}
              </CardTitle>
              <CardDescription>
                {selectedSubject 
                  ? `Progreso de saberes mínimos por elemento de competencia para ${selectedSubject}`
                  : 'Selecciona una materia para ver el detalle de elementos de competencia'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {elementosLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Cargando elementos...</p>
                  </div>
                </div>
              ) : elementosError ? (
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-red-500">Error: {elementosError}</p>
                </div>
              ) : !selectedSubject ? (
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-gray-500">Haz clic en una materia para ver el detalle de elementos de competencia</p>
                </div>
              ) : elementosChartData.length === 0 ? (
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-gray-500">No hay datos disponibles para esta materia</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={elementosChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="ec" 
                        fontSize={12}
                        type="category"
                      />
                      <YAxis 
                        fontSize={12}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<CustomElementosTooltip />} />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        wrapperStyle={{
                          paddingBottom: '10px'
                        }}
                      />
                      {paraleloKeys.map((paraleloKey, index) => (
                        <Line 
                          key={paraleloKey}
                          type="monotone" 
                          dataKey={paraleloKey}
                          stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                          strokeWidth={3}
                          dot={(props) => {
                            const data = props.payload[`${paraleloKey}_data`];
                            if (!data) return null;
                            
                            let color = 'gray'; 
                            if (data.completado) {
                              color = 'blue'; 
                            } else if (data.evaluado) {
                              color = 'yellow';
                            }
                            
                            return (
                              <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={6}
                                fill={color}
                                stroke="white"
                                strokeWidth={2}
                              />
                            );
                          }}
                          name={`Paralelo ${paraleloKey}`}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-4 justify-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-muted-foreground">Completado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-muted-foreground">Evaluado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span className="text-muted-foreground">Pendiente</span>
                    </div>
                  </div>
                 
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Recuperatorios por Elemento de Competencia</CardTitle>
              <CardDescription>
                Porcentaje de recuperatorios tomados sobre el total por elemento de competencia y paralelo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={recuperatoriosChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="ec" fontSize={12} type="category" />
                  <YAxis fontSize={12} domain={[0, 100]} tickFormatter={value => `${value}%`} />
                  <Tooltip content={<CustomRecuperatoriosTooltip />} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '10px' }} />
                  {paraleloKeys.map((paraleloKey, index) => (
                    <Line
                      key={paraleloKey}
                      type="monotone"
                      dataKey={paraleloKey}
                      stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                      strokeWidth={3}
                      dot={(props) => {
                        const data = props.payload[`${paraleloKey}_data`];
                        if (!data) return null;
                        
                        let color = 'gray'; 
                        if (data.completado) {
                          color = 'blue'; 
                        } else if (data.evaluado) {
                          color = 'yellow';
                        }
                        
                        return (
                          <circle
                            cx={props.cx}
                            cy={props.cy}
                            r={6}
                            fill={color}
                            stroke="white"
                            strokeWidth={2}
                          />
                        );
                      }}
                      name={`Paralelo ${paraleloKey}`}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-muted-foreground">Completado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-muted-foreground">Evaluado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span className="text-muted-foreground">Pendiente</span>
                    </div>
                  </div>
            </CardContent>
          </Card>
        )}
      </div>

      
    </div>
  );
};

export default Dashboard;