import React, { useState } from 'react';
import { Passenger } from '../types';
import { MOCK_STUDENTS, MOCK_ROUTES } from '../constants';
import { Users, Bus, UserPlus, Search, CheckCircle, User, Trash2 } from 'lucide-react';

const PassengerManagement: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState(MOCK_ROUTES[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: 'pass-01', studentId: 'stu-01', studentName: 'Ana Clara Oliveira', routeId: 'route-01', boardingStop: 'Praça Central', dropoffStop: 'EMEF Prof. Maria Silva', status: 'active' },
    { id: 'pass-02', studentId: 'stu-02', studentName: 'Pedro Henrique Costa', routeId: 'route-01', boardingStop: 'Av. Norte', dropoffStop: 'EMEF Prof. Maria Silva', status: 'active' },
  ]);

  const selectedRoute = MOCK_ROUTES.find(r => r.id === selectedRouteId);
  const routePassengers = passengers.filter(p => 
    p.routeId === selectedRouteId &&
    p.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableStudents = MOCK_STUDENTS.filter(s => 
    !passengers.some(p => p.studentId === s.id && p.routeId === selectedRouteId)
  );

  const handleAddPassenger = (studentId: string) => {
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (!student || !selectedRoute) return;

    const newPassenger: Passenger = {
      id: `pass-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      routeId: selectedRouteId,
      boardingStop: selectedRoute.stops[0],
      dropoffStop: selectedRoute.stops[selectedRoute.stops.length - 1],
      status: 'active',
    };

    setPassengers([...passengers, newPassenger]);
    alert(`${student.name} adicionado à rota ${selectedRoute.name}`);
  };

  const handleRemovePassenger = (passengerId: string) => {
    setPassengers(passengers.filter(p => p.id !== passengerId));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Gestão de Passageiros</h1>
          <p className="text-brand-muted mt-1">Gerencie os alunos de cada rota de transporte</p>
        </div>
      </div>

      {/* Seleção de Rota */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">
              Selecione a Rota
            </label>
            <select
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-brand-dark font-medium focus:outline-none focus:border-brand-primary transition-all"
            >
              {MOCK_ROUTES.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name} - {route.vehicle}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">
              Buscar Passageiro
            </label>
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="text"
                placeholder="Nome do aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl text-brand-dark font-medium focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Informações da Rota */}
      {selectedRoute && (
        <div className="bg-gradient-to-r from-brand-dark to-brand-dark/80 rounded-[2rem] p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black">{selectedRoute.name}</h2>
              <p className="text-gray-300 mt-1">{selectedRoute.vehicle} • {selectedRoute.driver}</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-3xl font-black text-brand-primary">{routePassengers.length}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Passageiros</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black">{selectedRoute.capacity}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Capacidade</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-brand-success">
                  {selectedRoute.capacity - routePassengers.length}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Vagas</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Paradas</p>
            <div className="flex flex-wrap gap-2">
              {selectedRoute.stops.map((stop, i) => (
                <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                  {i + 1}. {stop}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Passageiros Atuais */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-success/10 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-brand-success" />
            </div>
            Passageiros da Rota
          </h2>

          {routePassengers.length === 0 ? (
            <div className="text-center py-8">
              <Bus size={48} className="mx-auto text-brand-muted mb-4" />
              <p className="text-brand-muted">Nenhum passageiro nesta rota</p>
            </div>
          ) : (
            <div className="space-y-3">
              {routePassengers.map((passenger) => (
                <div key={passenger.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-info/10 rounded-full flex items-center justify-center">
                      <User size={18} className="text-brand-info" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-dark">{passenger.studentName}</p>
                      <p className="text-brand-muted text-xs">
                        {passenger.boardingStop} → {passenger.dropoffStop}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePassenger(passenger.id)}
                    className="flex items-center gap-1 px-3 py-2 bg-brand-danger/10 text-brand-danger rounded-lg text-xs font-bold hover:bg-brand-danger/20 transition-all"
                  >
                    <Trash2 size={14} />
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Adicionar Passageiro */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-warning/10 rounded-xl flex items-center justify-center">
              <UserPlus size={20} className="text-brand-warning" />
            </div>
            Adicionar Passageiro
          </h2>

          {availableStudents.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="mx-auto text-brand-success mb-4" />
              <p className="text-brand-muted">Todos os alunos já estão nesta rota</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                  <div className="flex items-center gap-3">
                    <img src={student.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-brand-dark">{student.name}</p>
                      <p className="text-brand-muted text-xs">{student.currentGrade}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddPassenger(student.id)}
                    className="px-3 py-2 bg-brand-success text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all"
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassengerManagement;