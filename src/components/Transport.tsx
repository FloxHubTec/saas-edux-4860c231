import React from 'react';
import { Route } from '../types';
import { Bus, Route as RouteIcon, Users, BarChart3, MapPin, Pencil, Map } from 'lucide-react';

interface TransportProps {
  routes: Route[];
  onAddRoute: (route: Route) => void;
  onManagePassengers: (routeId: string) => void;
}

const Transport: React.FC<TransportProps> = ({ routes, onAddRoute, onManagePassengers }) => {
  const stats = [
    { label: 'Rotas Ativas', value: routes.filter(r => r.status === 'active').length, icon: RouteIcon, color: 'bg-brand-success' },
    { label: 'Veículos', value: routes.length, icon: Bus, color: 'bg-brand-info' },
    { label: 'Passageiros', value: routes.reduce((acc, r) => acc + r.passengersCount, 0), icon: Users, color: 'bg-brand-warning' },
    { label: 'Capacidade Total', value: routes.reduce((acc, r) => acc + r.capacity, 0), icon: BarChart3, color: 'bg-brand-dark' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-brand-success/10 text-brand-success',
      maintenance: 'bg-brand-warning/10 text-brand-warning',
      inactive: 'bg-brand-danger/10 text-brand-danger',
    };
    const labels: Record<string, string> = {
      active: 'Ativa',
      maintenance: 'Manutenção',
      inactive: 'Inativa',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Transporte Escolar</h1>
          <p className="text-brand-muted mt-1">Gerencie rotas e passageiros do transporte</p>
        </div>
        <button 
          onClick={() => onAddRoute({} as Route)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-brand-dark rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg shadow-brand-primary/20"
        >
          <RouteIcon size={16} />
          Nova Rota
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-2xl font-black text-brand-dark">{stat.value}</p>
                <p className="text-brand-muted text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => {
          const occupancy = ((route.passengersCount / route.capacity) * 100).toFixed(0);
          return (
            <div key={route.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-brand-info/10 rounded-2xl flex items-center justify-center">
                  <Bus size={28} className="text-brand-info" />
                </div>
                {getStatusBadge(route.status)}
              </div>
              
              <h3 className="font-black text-brand-dark text-lg">{route.name}</h3>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-muted">Veículo:</span>
                  <span className="font-bold text-brand-dark">{route.vehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">Motorista:</span>
                  <span className="font-bold text-brand-dark">{route.driver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">Passageiros:</span>
                  <span className="font-bold text-brand-dark">{route.passengersCount}/{route.capacity}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-brand-muted">Ocupação</span>
                  <span className="font-bold text-brand-dark">{occupancy}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      parseInt(occupancy) > 90 ? 'bg-brand-danger' : 
                      parseInt(occupancy) > 70 ? 'bg-brand-warning' : 'bg-brand-success'
                    }`}
                    style={{ width: `${occupancy}%` }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Paradas</p>
                <div className="flex flex-wrap gap-1">
                  {route.stops.slice(0, 3).map((stop, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-brand-muted rounded text-xs flex items-center gap-1">
                      <MapPin size={10} />
                      {stop}
                    </span>
                  ))}
                  {route.stops.length > 3 && (
                    <span className="px-2 py-1 bg-brand-info/10 text-brand-info rounded text-xs font-bold">
                      +{route.stops.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => onManagePassengers(route.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                >
                  <Users size={14} />
                  Passageiros
                </button>
                <button className="px-4 py-2 bg-gray-100 text-brand-muted rounded-xl text-xs font-bold hover:bg-gray-200 transition-all">
                  <Pencil size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Placeholder */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-brand-success/10 rounded-xl flex items-center justify-center">
            <Map size={20} className="text-brand-success" />
          </span>
          Mapa de Rotas
        </h2>
        <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Map size={32} className="text-brand-muted" />
            </div>
            <p className="text-brand-muted">Mapa de rotas em desenvolvimento</p>
            <p className="text-brand-muted text-sm">Integração com Google Maps prevista</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transport;