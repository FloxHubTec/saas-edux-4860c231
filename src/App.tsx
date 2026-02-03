import React, { useState } from 'react';
import { UserRole, User, EnrollmentApplication, EnrollmentStatus, Route, Student } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ClassDiary from './components/ClassDiary';
import Transport from './components/Transport';
import AuditReport from './components/AuditReport';
import LoginPage from './components/LoginPage';
import EnrollmentManager from './components/EnrollmentManager';
import AssessmentGrader from './components/AssessmentGrader';
import ProfessorManager from './components/ProfessorManager';
import TransferManager from './components/TransferManager';
import InteractiveCalendar from './components/InteractiveCalendar';
import IDEPIntegration from './components/IDEPIntegration';
import StudentPortal from './components/StudentPortal';
import EnrollmentDetail from './components/EnrollmentDetail';
import GradingManagement from './components/GradingManagement';
import LessonPlanner from './components/LessonPlanner';
import { MOCK_ROUTES, MOCK_STUDENTS } from './constants';
import { auditService } from './services/auditService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSchoolId, setSelectedSchoolId] = useState('all');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [viewingApplication, setViewingApplication] = useState<EnrollmentApplication | null>(null);
  const [routes, setRoutes] = useState<Route[]>(MOCK_ROUTES);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.isSelfRegistered) setActiveTab('enrollment');
    else if (user.role === UserRole.PROFESSOR) setActiveTab('diary');
    else if (user.role === UserRole.STUDENT) setActiveTab('student_portal');
    else setActiveTab('dashboard');
    if (user.role !== UserRole.ADMIN && user.schoolId) setSelectedSchoolId(user.schoolId);
    else setSelectedSchoolId('all');
  };

  const handleLogout = () => { setCurrentUser(null); setSelectedSchoolId('all'); };

  const handleSyncGrade = (studentId: string, subject: string, bimester: number, grade: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const updated = JSON.parse(JSON.stringify(s)) as Student;
        if (!updated.academicRecords[subject]) updated.academicRecords[subject] = { grades: {}, absences: {}, recovery: null };
        updated.academicRecords[subject].grades[bimester] = grade;
        auditService.log(currentUser!, 'Correção Automática de Gabarito', 'StudentAcademicRecord', `${studentId}-${subject}`, null, grade, `Nota sincronizada para ${subject} no ${bimester}º Bimestre.`);
        return updated;
      }
      return s;
    }));
    alert("Nota sincronizada!");
    setActiveTab('grading_management');
  };

  const handleUpdateStudent = (updatedStudent: Student) => { setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s)); };

  if (!currentUser) return <LoginPage onLogin={handleLogin} />;

  const renderContent = () => {
    if (activeTab === 'enrollment_detail' && viewingApplication) {
      return <EnrollmentDetail application={viewingApplication} currentUser={currentUser} onClose={() => { setActiveTab('enrollment_manager'); setViewingApplication(null); }} onUpdateStatus={(id, status) => { setViewingApplication(null); setActiveTab('enrollment_manager'); }} />;
    }
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} selectedSchoolId={selectedSchoolId} onSchoolChange={setSelectedSchoolId} userRole={currentUser.role} currentUser={currentUser} />;
      case 'grading_management': return <GradingManagement students={students} currentUser={currentUser} onUpdateStudent={handleUpdateStudent} />;
      case 'diary': return <ClassDiary currentUser={currentUser} selectedSchoolId={selectedSchoolId} />;
      case 'lesson_plan': return <LessonPlanner currentUser={currentUser} />;
      case 'grading': return <AssessmentGrader currentUser={currentUser} onSyncGrade={handleSyncGrade} />;
      case 'student_portal': const studentData = students.find(s => s.id === 'stu-01') || students[0]; return <StudentPortal currentStudent={studentData} />;
      case 'enrollment_manager': return <EnrollmentManager currentUser={currentUser} onViewDetails={(app) => { setViewingApplication(app); setActiveTab('enrollment_detail'); }} selectedSchoolId={selectedSchoolId} />;
      case 'professor_manager': return <ProfessorManager currentUser={currentUser} />;
      case 'idep_integration': return <IDEPIntegration />;
      case 'calendar_letivo': return <InteractiveCalendar currentUser={currentUser} schoolId={selectedSchoolId} />;
      case 'transfer_manager': return <TransferManager currentUser={currentUser} students={students} setStudents={setStudents} />;
      case 'transport': return <Transport routes={routes} onAddRoute={(r) => alert('Nova rota')} onManagePassengers={(id) => alert('Passageiros')} />;
      case 'audit': return <AuditReport />;
      default: return <Dashboard onNavigate={setActiveTab} selectedSchoolId={selectedSchoolId} onSchoolChange={setSelectedSchoolId} userRole={currentUser.role} currentUser={currentUser} />;
    }
  };

  return (
    <Layout activeTab={activeTab === 'enrollment_detail' ? 'enrollment_manager' : activeTab} setActiveTab={setActiveTab} userRole={currentUser.role} onLogout={handleLogout} selectedSchoolId={selectedSchoolId} currentUser={currentUser}>
      {renderContent()}
    </Layout>
  );
};

export default App;
