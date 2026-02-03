import React, { useState } from 'react';
import { User, CalendarEvent } from '../types';
import { MOCK_CALENDAR_EVENTS, MOCK_SCHOOLS } from '../constants';
import { Plus, ChevronLeft, ChevronRight, Calendar, Clock, Flag, Users } from 'lucide-react';

interface InteractiveCalendarProps {
  currentUser: User;
  schoolId: string;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({ currentUser, schoolId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', type: 'event' as CalendarEvent['type'], description: '' });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(evt => {
      if (evt.date === dateStr) return true;
      if (evt.endDate) {
        return dateStr >= evt.date && dateStr <= evt.endDate;
      }
      return false;
    });
  };

  const getEventTypeStyle = (type: CalendarEvent['type']) => {
    const styles: Record<string, string> = {
      holiday: 'bg-brand-danger/20 text-brand-danger',
      event: 'bg-brand-info/20 text-brand-info',
      meeting: 'bg-brand-warning/20 text-brand-warning',
      deadline: 'bg-brand-success/20 text-brand-success',
      school_day: 'bg-gray-200 text-gray-600',
    };
    return styles[type] || styles.event;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title) return;

    const event: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: newEvent.title,
      date: selectedDate.toISOString().split('T')[0],
      type: newEvent.type,
      description: newEvent.description,
      schoolId: schoolId !== 'all' ? schoolId : undefined,
    };

    setEvents([...events, event]);
    setShowAddModal(false);
    setNewEvent({ title: '', type: 'event', description: '' });
    alert('Evento adicionado com sucesso!');
  };

  const renderCalendarDays = () => {
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 p-2 border border-gray-100 rounded-xl cursor-pointer transition-all hover:border-brand-primary ${
            isToday ? 'bg-brand-primary/10 border-brand-primary' : ''
          } ${isSelected ? 'ring-2 ring-brand-dark' : ''}`}
        >
          <span className={`text-sm font-bold ${isToday ? 'text-brand-dark' : 'text-brand-muted'}`}>
            {day}
          </span>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map((evt) => (
              <div
                key={evt.id}
                className={`px-2 py-0.5 rounded text-[10px] font-bold truncate ${getEventTypeStyle(evt.type)}`}
                title={evt.title}
              >
                {evt.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-[10px] text-brand-muted font-bold">
                +{dayEvents.length - 2} mais
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Calendário Letivo</h1>
          <p className="text-brand-muted mt-1">Gerencie eventos e datas importantes do ano escolar</p>
        </div>
        <button 
          onClick={() => { setShowAddModal(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-brand-dark rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus size={16} />
          Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handlePrevMonth}
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-black text-brand-dark">
              {MONTHS[month]} {year}
            </h2>
            <button
              onClick={handleNextMonth}
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="text-center text-xs font-bold text-brand-muted uppercase tracking-widest py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {renderCalendarDays()}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Info */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-brand-dark mb-4">
              {selectedDate 
                ? selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
                : 'Selecione uma data'}
            </h3>
            
            {selectedDate && (
              <>
                {selectedDateEvents.length === 0 ? (
                  <p className="text-brand-muted text-sm">Nenhum evento nesta data</p>
                ) : (
                  <div className="space-y-3">
                    {selectedDateEvents.map((evt) => (
                      <div key={evt.id} className={`p-4 rounded-xl ${getEventTypeStyle(evt.type)}`}>
                        <p className="font-bold">{evt.title}</p>
                        {evt.description && (
                          <p className="text-sm mt-1 opacity-80">{evt.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Legend */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-black text-brand-dark mb-4 uppercase tracking-widest">Legenda</h3>
            <div className="space-y-2">
              {[
                { type: 'holiday', label: 'Feriado/Recesso', icon: Calendar },
                { type: 'event', label: 'Evento', icon: Flag },
                { type: 'meeting', label: 'Reunião', icon: Users },
                { type: 'deadline', label: 'Prazo', icon: Clock },
              ].map((item) => (
                <div key={item.type} className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded flex items-center justify-center ${getEventTypeStyle(item.type as CalendarEvent['type'])}`}>
                    <item.icon size={10} />
                  </span>
                  <span className="text-sm text-brand-muted">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-black text-brand-dark mb-4 uppercase tracking-widest">Próximos Eventos</h3>
            <div className="space-y-3">
              {events
                .filter(e => new Date(e.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((evt) => (
                  <div key={evt.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <p className="text-lg font-black text-brand-dark">
                        {new Date(evt.date).getDate()}
                      </p>
                      <p className="text-xs text-brand-muted">
                        {MONTHS[new Date(evt.date).getMonth()].slice(0, 3)}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-brand-dark text-sm">{evt.title}</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getEventTypeStyle(evt.type)}`}>
                        {evt.type === 'holiday' ? 'Feriado' : 
                         evt.type === 'meeting' ? 'Reunião' :
                         evt.type === 'deadline' ? 'Prazo' : 'Evento'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-black text-brand-dark mb-6">Novo Evento</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Data Selecionada</label>
                <p className="text-brand-dark font-bold">
                  {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : 'Selecione uma data no calendário'}
                </p>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Título *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all"
                  placeholder="Nome do evento"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Tipo</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as CalendarEvent['type'] })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all"
                >
                  <option value="event">Evento</option>
                  <option value="holiday">Feriado/Recesso</option>
                  <option value="meeting">Reunião</option>
                  <option value="deadline">Prazo</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Descrição</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all resize-none"
                  placeholder="Detalhes do evento..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-brand-muted rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!selectedDate || !newEvent.title}
                className="flex-1 px-6 py-3 bg-brand-dark text-white rounded-xl font-bold text-sm hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveCalendar;