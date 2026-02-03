import React, { useState } from 'react';
import { User, UserRole, Student } from '../types';
import { MOCK_SCHOOLS, MOCK_STUDENTS, MOCK_ENROLLMENTS, MOCK_ROUTES } from '../constants';
import SchoolSelector from './SchoolSelector';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  selectedSchoolId: string;
  onSchoolChange: (schoolId: string) => void;
  userRole: UserRole;
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, selectedSchoolId, onSchoolChange, userRole, currentUser }) => {
  const filteredSchools = selectedSchoolId === 'all' 
    ? MOCK_SCHOOLS 
    : MOCK_SCHOOLS.filter(s => s.id === selectedSchoolId);

  const totalStudents = filteredSchools.reduce((acc, s) => acc + s.students, 0);
  const totalCapacity = filteredSchools.reduce((acc, s) => acc + (s.maxCapacity || 0), 0);
  const pendingEnrollments = MOCK_ENROLLMENTS.filter(e => 
    e.status === 'PENDING' && (selectedSchoolId === 'all' || e.schoolId === selectedSchoolId)
  ).length;
  const activeRoutes = MOCK_ROUTES.filter(r => r.status === 'active').length;

  const statCards = [
    { 
      title: 'Total de Alunos', 
      value: totalStudents.toLocaleString('pt-BR'), 
      icon: '👨‍🎓', 
      color: 'bg-brand-info',
      subtitle: `de ${totalCapacity.toLocaleString('pt-BR')} vagas`,
      onClick: () => onNavigate('grading_management')
    },
    { 
      title: 'Matrículas Pendentes', 
      value: pendingEnrollments.toString(), 
      icon: '📝', 
      color: 'bg-brand-warning',
      subtitle: 'aguardando análise',
      onClick: () => onNavigate('enrollment_manager')
    },
    { 
      title: 'Escolas Ativas', 
      value: filteredSchools.length.toString(), 
      icon: '🏫', 
      color: 'bg-brand-success',
      subtitle: 'em funcionamento',
      onClick: undefined
    },
    { 
      title: 'Rotas de Transporte', 
      value: activeRoutes.toString(), 
      icon: '🚌', 
      color: 'bg-brand-yellow',
      subtitle: 'rotas ativas',
      onClick: () => onNavigate('transport')
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Dashboard</h1>
          <p className="text-brand-gray mt-1">Visão geral da rede municipal de ensino</p>
        </div>
        {userRole === UserRole.ADMIN && (
          <SchoolSelector 
            selectedSchoolId={selectedSchoolId} 
            onSchoolChange={onSchoolChange}
          />
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            onClick={stat.onClick}
            className={`bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all ${stat.onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-brand-gray text-xs font-bold uppercase tracking-widest">{stat.title}</p>
                <p className="text-4xl font-black text-brand-dark mt-2">{stat.value}</p>
                <p className="text-brand-gray text-sm mt-1">{stat.subtitle}</p>
              </div>
              <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-brand-dark mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Nova Matrícula', icon: '➕', action: () => onNavigate('enrollment_manager') },
            { label: 'Lançar Notas', icon: '📊', action: () => onNavigate('grading_management') },
            { label: 'Ver Calendário', icon: '📅', action: () => onNavigate('calendar_letivo') },
            { label: 'Relatório de Auditoria', icon: '🔒', action: () => onNavigate('audit') },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-50 hover:bg-brand-yellow/10 hover:border-brand-yellow border-2 border-transparent transition-all"
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="text-sm font-bold text-brand-dark">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Schools Overview */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-brand-dark mb-6">Escolas da Rede</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchools.map((school) => {
            const occupancy = ((school.students / (school.maxCapacity || 1)) * 100).toFixed(0);
            return (
              <div key={school.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-brand-dark">{school.name}</h3>
                    <p className="text-brand-gray text-sm mt-1">{school.address}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {school.levels?.map((level, i) => (
                        <span key={i} className="px-3 py-1 bg-brand-info/10 text-brand-info text-[10px] font-bold uppercase rounded-full">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-brand-dark">{school.students}</p>
                    <p className="text-brand-gray text-xs">alunos</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-brand-gray">Ocupação</span>
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
