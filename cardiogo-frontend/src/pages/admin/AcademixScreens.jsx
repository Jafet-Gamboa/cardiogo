import React, { useState } from 'react';
import { Search, BookOpen, Heart, FileText, ClipboardList, Wifi, WifiOff, Menu, X, ChevronRight, Star, Download, Eye, CheckCircle } from 'lucide-react';

const AcademixScreens = () => {
  const [currentScreen, setCurrentScreen] = useState('register');
  const [isOnline, setIsOnline] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Mock data for library
  const topics = [
    {
      id: 1,
      name: 'Matemáticas',
      subtopics: ['Álgebra', 'Geometría', 'Cálculo'],
      resources: 24,
      difficulty: 'Intermedio'
    },
    {
      id: 2,
      name: 'Física',
      subtopics: ['Mecánica', 'Termodinámica', 'Óptica'],
      resources: 18,
      difficulty: 'Avanzado'
    },
    {
      id: 3,
      name: 'Química',
      subtopics: ['Química Orgánica', 'Inorgánica', 'Analítica'],
      resources: 15,
      difficulty: 'Intermedio'
    },
    {
      id: 4,
      name: 'Literatura',
      subtopics: ['Clásica', 'Contemporánea', 'Análisis'],
      resources: 32,
      difficulty: 'Básico'
    }
  ];

  const resources = [
    {
      id: 1,
      title: 'Introducción al Cálculo Diferencial',
      topic: 'Matemáticas',
      subtopic: 'Cálculo',
      type: 'PDF',
      pages: 45,
      difficulty: 'Intermedio',
      isFavorite: true,
      tags: ['derivadas', 'límites', 'continuidad'],
      author: 'Dr. Juan Pérez',
      content: 'El cálculo diferencial es una rama fundamental de las matemáticas que estudia las tasas de cambio instantáneas y las pendientes de curvas...'
    },
    {
      id: 2,
      title: 'Leyes de Newton y Aplicaciones',
      topic: 'Física',
      subtopic: 'Mecánica',
      type: 'Video',
      duration: '42 min',
      difficulty: 'Básico',
      isFavorite: false,
      tags: ['mecánica', 'fuerzas', 'movimiento'],
      author: 'Dra. María González',
      content: 'Las tres leyes de Newton describen la relación entre el movimiento de un objeto y las fuerzas que actúan sobre él...'
    },
    {
      id: 3,
      title: 'Nomenclatura Química Orgánica',
      topic: 'Química',
      subtopic: 'Química Orgánica',
      type: 'PDF',
      pages: 28,
      difficulty: 'Avanzado',
      isFavorite: true,
      tags: ['nomenclatura', 'orgánica', 'compuestos'],
      author: 'Prof. Carlos Ramírez',
      content: 'La nomenclatura química orgánica es un sistema de reglas para nombrar compuestos orgánicos de manera sistemática...'
    },
    {
      id: 4,
      title: 'Análisis de Textos Literarios',
      topic: 'Literatura',
      subtopic: 'Análisis',
      type: 'PDF',
      pages: 52,
      difficulty: 'Intermedio',
      isFavorite: false,
      tags: ['análisis', 'crítica', 'interpretación'],
      author: 'Lic. Ana Torres',
      content: 'El análisis literario es el proceso de examinar las diversas partes de una obra para comprender su significado profundo...'
    }
  ];

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Notas sobre Límites',
      content: 'Los límites son fundamentales para entender derivadas. Recordar que el límite de una función en un punto representa el valor al que se aproxima...',
      resourceId: 1,
      resourceTitle: 'Introducción al Cálculo Diferencial',
      date: '2026-01-25',
      isPinned: true
    },
    {
      id: 2,
      title: 'Segunda Ley de Newton',
      content: 'F = ma. La fuerza es igual a la masa por la aceleración. Importante: las fuerzas son vectores, por lo que tienen magnitud y dirección.',
      resourceId: 2,
      resourceTitle: 'Leyes de Newton y Aplicaciones',
      date: '2026-01-24',
      isPinned: false
    },
    {
      id: 3,
      title: 'Ideas para el ensayo final',
      content: 'Explorar el tema del romanticismo en la literatura latinoamericana. Considerar autores como García Márquez y Cortázar.',
      resourceId: null,
      resourceTitle: null,
      date: '2026-01-23',
      isPinned: false
    }
  ]);

  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [userRole, setUserRole] = useState('premium'); // 'standard' or 'premium'
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditingNote, setIsEditingNote] = useState(false);

  // Exam data
  const [exams, setExams] = useState([
    {
      id: 1,
      title: 'Fundamentos de Cálculo',
      topic: 'Matemáticas',
      subtopic: 'Cálculo',
      questions: 10,
      duration: '30 min',
      difficulty: 'Intermedio',
      completed: false
    },
    {
      id: 2,
      title: 'Leyes del Movimiento',
      topic: 'Física',
      subtopic: 'Mecánica',
      questions: 8,
      duration: '20 min',
      difficulty: 'Básico',
      completed: true,
      score: 87
    },
    {
      id: 3,
      title: 'Reacciones Químicas',
      topic: 'Química',
      subtopic: 'Química Orgánica',
      questions: 12,
      duration: '40 min',
      difficulty: 'Avanzado',
      completed: false
    }
  ]);

  const [selectedExam, setSelectedExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [examAnswers, setExamAnswers] = useState({});
  const [examResult, setExamResult] = useState(null);

  const examQuestions = [
    {
      id: 1,
      question: '¿Qué es una derivada?',
      options: [
        'La tasa de cambio instantánea de una función',
        'La integral de una función',
        'El valor máximo de una función',
        'La suma de todos los puntos de una función'
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: '¿Cuál es el límite de f(x) = 1/x cuando x tiende a infinito?',
      options: ['0', '1', 'Infinito', 'No existe'],
      correctAnswer: 0
    },
    {
      id: 3,
      question: '¿Qué regla se usa para derivar productos de funciones?',
      options: ['Regla de la cadena', 'Regla del producto', 'Regla del cociente', 'Regla de la suma'],
      correctAnswer: 1
    }
  ];

  // AI History
  const [aiHistory, setAiHistory] = useState([
    {
      id: 1,
      query: '¿Qué es una derivada?',
      selectedText: 'La derivada representa la tasa de cambio instantánea',
      response: 'La derivada es un concepto fundamental en cálculo que mide cómo cambia una función en un punto específico. Representa la pendiente de la tangente a la curva en ese punto.',
      resourceTitle: 'Introducción al Cálculo Diferencial',
      date: '2026-01-28',
      time: '14:30'
    },
    {
      id: 2,
      query: 'Explica la segunda ley de Newton',
      selectedText: 'F = ma',
      response: 'La segunda ley de Newton establece que la fuerza neta aplicada a un objeto es igual al producto de su masa por su aceleración. Esta ley es fundamental para entender la dinámica de los cuerpos.',
      resourceTitle: 'Leyes de Newton y Aplicaciones',
      date: '2026-01-27',
      time: '10:15'
    },
    {
      id: 3,
      query: '¿Qué es un grupo funcional?',
      selectedText: 'Los grupos funcionales son átomos o grupos de átomos',
      response: 'Un grupo funcional es un átomo o grupo de átomos específico dentro de una molécula que es responsable de las reacciones químicas características de esa molécula.',
      resourceTitle: 'Nomenclatura Química Orgánica',
      date: '2026-01-26',
      time: '16:45'
    }
  ]);

  // User profile
  const [userProfile, setUserProfile] = useState({
    name: 'María García',
    email: 'maria.garcia@example.com',
    role: 'premium',
    subscriptionStart: '2026-01-01',
    subscriptionEnd: '2026-12-31',
    avatar: 'MG',
    notesCount: notes.length,
    favoritesCount: resources.filter(r => r.isFavorite).length,
    examsCompleted: exams.filter(e => e.completed).length
  });

  // Offline resources
  const [offlineResources, setOfflineResources] = useState([
    {
      id: 1,
      title: 'Introducción al Cálculo Diferencial',
      topic: 'Matemáticas',
      size: '4.5 MB',
      downloadDate: '2026-01-25',
      type: 'PDF'
    },
    {
      id: 3,
      title: 'Nomenclatura Química Orgánica',
      topic: 'Química',
      size: '2.8 MB',
      downloadDate: '2026-01-24',
      type: 'PDF'
    }
  ]);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Work+Sans:wght@300;400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --text: #000000;
      --background: #dddfde;
      --primary: #071718;
      --secondary: #155a60;
      --accent: #29afc1;
      --success: #10b981;
      --error: #ef4444;
      --light-gray: #f5f5f5;
      --medium-gray: #9ca3af;
    }

    body {
      font-family: 'Work Sans', sans-serif;
      background: var(--background);
      color: var(--text);
      line-height: 1.6;
    }

    .screen-container {
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
    }

    /* Animated background pattern */
    .bg-pattern {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.03;
      background-image: 
        repeating-linear-gradient(45deg, var(--primary) 0px, var(--primary) 2px, transparent 2px, transparent 10px);
      pointer-events: none;
      animation: patternShift 20s linear infinite;
    }

    @keyframes patternShift {
      0% { transform: translateX(0) translateY(0); }
      100% { transform: translateX(10px) translateY(10px); }
    }

    /* Auth Screens Common Styles */
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
    }

    .auth-card {
      background: white;
      border-radius: 24px;
      box-shadow: 
        0 4px 6px rgba(0, 0, 0, 0.02),
        0 12px 24px rgba(7, 23, 24, 0.08),
        0 24px 48px rgba(7, 23, 24, 0.04);
      max-width: 480px;
      width: 100%;
      padding: 3rem;
      position: relative;
      overflow: hidden;
      animation: cardSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes cardSlideUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .auth-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, var(--secondary), var(--accent));
    }

    .auth-logo {
      text-align: center;
      margin-bottom: 2rem;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .auth-logo h1 {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      font-weight: 900;
      color: var(--primary);
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
    }

    .auth-logo p {
      color: var(--secondary);
      font-size: 0.95rem;
      font-weight: 400;
    }

    .form-group {
      margin-bottom: 1.5rem;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--primary);
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-input {
      width: 100%;
      padding: 1rem 1.25rem;
      border: 2px solid transparent;
      background: var(--light-gray);
      border-radius: 12px;
      font-size: 1rem;
      font-family: 'Work Sans', sans-serif;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      outline: none;
    }

    .form-input:focus {
      border-color: var(--accent);
      background: white;
      box-shadow: 0 0 0 4px rgba(41, 175, 193, 0.1);
      transform: translateY(-2px);
    }

    .btn-primary {
      width: 100%;
      padding: 1.125rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: 0 4px 12px rgba(7, 23, 24, 0.2);
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
    }

    .btn-primary:hover {
      background: var(--secondary);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(7, 23, 24, 0.3);
    }

    .btn-primary:active {
      transform: translateY(0);
    }

    .auth-link {
      text-align: center;
      margin-top: 1.5rem;
      color: var(--medium-gray);
      font-size: 0.9rem;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both;
    }

    .auth-link a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }

    .auth-link a:hover {
      color: var(--secondary);
      text-decoration: underline;
    }

    .error-message {
      background: #fef2f2;
      color: var(--error);
      padding: 0.875rem 1.125rem;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      border-left: 4px solid var(--error);
      animation: shake 0.4s;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      75% { transform: translateX(8px); }
    }

    .success-message {
      background: #f0fdf4;
      color: var(--success);
      padding: 0.875rem 1.125rem;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      border-left: 4px solid var(--success);
      animation: slideDown 0.4s;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Dashboard Styles */
    .dashboard {
      min-height: 100vh;
      padding-bottom: 2rem;
    }

    .dashboard-header {
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      padding: 1.25rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .header-logo {
      font-family: 'Playfair Display', serif;
      font-size: 1.75rem;
      font-weight: 900;
      color: var(--primary);
      letter-spacing: -0.02em;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--medium-gray);
      font-weight: 500;
    }

    .status-indicator.online {
      color: var(--success);
    }

    .icon-btn {
      background: var(--light-gray);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .icon-btn:hover {
      background: var(--accent);
      color: white;
      transform: translateY(-2px);
    }

    .dashboard-nav {
      background: white;
      padding: 1rem 2rem;
      margin: 1.5rem 2rem;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
    }

    .nav-items {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding: 0.5rem 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: var(--light-gray);
      border-radius: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
      border: 2px solid transparent;
    }

    .nav-item:hover {
      background: var(--accent);
      color: white;
      transform: translateY(-2px);
    }

    .nav-item.active {
      background: var(--primary);
      color: white;
      border-color: var(--accent);
    }

    .dashboard-content {
      padding: 0 2rem;
    }

    .welcome-section {
      margin-bottom: 2rem;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
    }

    .welcome-section h2 {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .welcome-section p {
      color: var(--medium-gray);
      font-size: 1.05rem;
    }

    .search-section {
      margin-bottom: 2rem;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
    }

    .search-bar {
      position: relative;
      max-width: 600px;
    }

    .search-bar input {
      width: 100%;
      padding: 1.125rem 1.25rem 1.125rem 3.5rem;
      border: 2px solid transparent;
      background: white;
      border-radius: 14px;
      font-size: 1rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      transition: all 0.3s;
    }

    .search-bar input:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 6px 20px rgba(41, 175, 193, 0.15);
    }

    .search-bar svg {
      position: absolute;
      left: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--medium-gray);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.75rem;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .stat-card:nth-child(1) { animation-delay: 0.5s; }
    .stat-card:nth-child(2) { animation-delay: 0.6s; }
    .stat-card:nth-child(3) { animation-delay: 0.7s; }
    .stat-card:nth-child(4) { animation-delay: 0.8s; }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .stat-card .icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--secondary), var(--accent));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      color: white;
    }

    .stat-card h3 {
      font-size: 0.875rem;
      color: var(--medium-gray);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .stat-card .value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary);
    }

    /* Library Styles */
    .library-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
    }

    .library-header h2 {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      color: var(--primary);
    }

    .filter-btn {
      padding: 0.75rem 1.5rem;
      background: white;
      border: 2px solid var(--primary);
      color: var(--primary);
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn:hover {
      background: var(--primary);
      color: white;
    }

    .topics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .topic-card {
      background: white;
      border-radius: 16px;
      padding: 1.75rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .topic-card:nth-child(1) { animation-delay: 0.4s; }
    .topic-card:nth-child(2) { animation-delay: 0.5s; }
    .topic-card:nth-child(3) { animation-delay: 0.6s; }
    .topic-card:nth-child(4) { animation-delay: 0.7s; }

    .topic-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--secondary), var(--accent));
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s;
    }

    .topic-card:hover::before {
      transform: scaleX(1);
    }

    .topic-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    }

    .topic-card h3 {
      font-size: 1.5rem;
      color: var(--primary);
      margin-bottom: 0.75rem;
      font-weight: 700;
    }

    .topic-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      color: var(--medium-gray);
    }

    .subtopics-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .subtopic-tag {
      padding: 0.4rem 0.875rem;
      background: var(--light-gray);
      border-radius: 20px;
      font-size: 0.8rem;
      color: var(--secondary);
      font-weight: 500;
    }

    .difficulty-badge {
      display: inline-block;
      padding: 0.3rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .difficulty-badge.basico {
      background: #dcfce7;
      color: #166534;
    }

    .difficulty-badge.intermedio {
      background: #fef3c7;
      color: #92400e;
    }

    .difficulty-badge.avanzado {
      background: #fee2e2;
      color: #991b1b;
    }

    .resources-section {
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
    }

    .resources-section h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.75rem;
      color: var(--primary);
      margin-bottom: 1.5rem;
    }

    .resource-card {
      background: white;
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 1.25rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .resource-card:nth-child(1) { animation-delay: 0.6s; }
    .resource-card:nth-child(2) { animation-delay: 0.7s; }
    .resource-card:nth-child(3) { animation-delay: 0.8s; }

    .resource-card:hover {
      transform: translateX(8px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .resource-info {
      flex: 1;
    }

    .resource-info h4 {
      font-size: 1.125rem;
      color: var(--primary);
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .resource-meta {
      display: flex;
      gap: 1.5rem;
      font-size: 0.875rem;
      color: var(--medium-gray);
      margin-bottom: 0.75rem;
    }

    .resource-actions {
      display: flex;
      gap: 0.75rem;
    }

    .action-btn {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: none;
      background: var(--light-gray);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: var(--accent);
      color: white;
      transform: scale(1.1);
    }

    .action-btn.favorite {
      color: var(--error);
    }

    .action-btn.favorite:hover {
      background: var(--error);
      color: white;
    }

    /* Screen Navigation */
    .screen-nav {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 1rem 1.5rem;
      border-radius: 50px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      display: flex;
      gap: 0.75rem;
      z-index: 1000;
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    .screen-nav button {
      padding: 0.625rem 1.25rem;
      border: none;
      background: var(--light-gray);
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
    }

    .screen-nav button.active {
      background: var(--primary);
      color: white;
    }

    .screen-nav button:hover:not(.active) {
      background: var(--accent);
      color: white;
    }

    /* Search & Filters Styles */
    .filters-panel {
      background: white;
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
    }

    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .filters-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary);
    }

    .clear-filters {
      color: var(--accent);
      background: none;
      border: none;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.875rem;
      transition: color 0.2s;
    }

    .clear-filters:hover {
      color: var(--secondary);
      text-decoration: underline;
    }

    .filter-group {
      margin-bottom: 1.5rem;
    }

    .filter-group label {
      display: block;
      margin-bottom: 0.75rem;
      color: var(--primary);
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .filter-select {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid var(--light-gray);
      background: var(--light-gray);
      border-radius: 10px;
      font-size: 0.95rem;
      font-family: 'Work Sans', sans-serif;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--accent);
      background: white;
    }

    .tags-filter {
      display: flex;
      flex-wrap: wrap;
      gap: 0.625rem;
    }

    .tag-chip {
      padding: 0.5rem 1rem;
      background: var(--light-gray);
      border: 2px solid transparent;
      border-radius: 20px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
    }

    .tag-chip:hover {
      background: var(--accent);
      color: white;
    }

    .tag-chip.selected {
      background: var(--primary);
      color: white;
      border-color: var(--accent);
    }

    .search-results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
    }

    .results-count {
      color: var(--medium-gray);
      font-size: 0.95rem;
    }

    /* Resource Detail Styles */
    .detail-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .detail-header {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
    }

    .detail-header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 2.25rem;
      color: var(--primary);
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .detail-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      color: var(--medium-gray);
      font-size: 0.95rem;
    }

    .detail-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .action-btn-large {
      padding: 0.875rem 1.5rem;
      border-radius: 10px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
      font-size: 0.95rem;
    }

    .action-btn-large.primary {
      background: var(--primary);
      color: white;
    }

    .action-btn-large.primary:hover {
      background: var(--secondary);
      transform: translateY(-2px);
    }

    .action-btn-large.secondary {
      background: var(--light-gray);
      color: var(--primary);
    }

    .action-btn-large.secondary:hover {
      background: var(--accent);
      color: white;
    }

    .action-btn-large.favorite {
      background: var(--light-gray);
      color: var(--error);
    }

    .action-btn-large.favorite:hover {
      background: var(--error);
      color: white;
    }

    .action-btn-large.favorite.active {
      background: var(--error);
      color: white;
    }

    .premium-badge {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
    }

    .content-viewer {
      background: white;
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
      line-height: 1.8;
      font-size: 1.05rem;
    }

    .content-viewer::selection {
      background: rgba(41, 175, 193, 0.3);
    }

    .ai-assistant-panel {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      border-top-left-radius: 24px;
      border-top-right-radius: 24px;
      box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.12);
      padding: 2rem;
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 200;
      max-height: 60vh;
      overflow-y: auto;
    }

    .ai-assistant-panel.open {
      transform: translateY(0);
    }

    .ai-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .ai-panel-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary);
    }

    .close-btn {
      background: var(--light-gray);
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: var(--error);
      color: white;
    }

    .selected-text-box {
      background: var(--light-gray);
      padding: 1rem;
      border-radius: 10px;
      margin-bottom: 1rem;
      font-style: italic;
      color: var(--secondary);
      border-left: 4px solid var(--accent);
    }

    .ai-response {
      background: linear-gradient(135deg, rgba(21, 90, 96, 0.05), rgba(41, 175, 193, 0.05));
      padding: 1.5rem;
      border-radius: 12px;
      line-height: 1.7;
    }

    /* Favorites Styles */
    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .favorite-card {
      background: white;
      border-radius: 16px;
      padding: 1.75rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      position: relative;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .favorite-card:nth-child(1) { animation-delay: 0.4s; }
    .favorite-card:nth-child(2) { animation-delay: 0.5s; }
    .favorite-card:nth-child(3) { animation-delay: 0.6s; }

    .favorite-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    }

    .remove-favorite {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--light-gray);
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      color: var(--error);
    }

    .remove-favorite:hover {
      background: var(--error);
      color: white;
      transform: scale(1.1);
    }

    .favorite-card h4 {
      font-size: 1.25rem;
      color: var(--primary);
      margin-bottom: 0.75rem;
      font-weight: 700;
      padding-right: 2rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--medium-gray);
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
    }

    .empty-state svg {
      margin: 0 auto 1.5rem;
      opacity: 0.3;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    /* Notes Styles */
    .notes-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
    }

    .notes-header h2 {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      color: var(--primary);
    }

    .btn-create-note {
      padding: 0.875rem 1.5rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .btn-create-note:hover {
      background: var(--secondary);
      transform: translateY(-2px);
    }

    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .note-card {
      background: white;
      border-radius: 16px;
      padding: 1.75rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      position: relative;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .note-card:nth-child(1) { animation-delay: 0.4s; }
    .note-card:nth-child(2) { animation-delay: 0.5s; }
    .note-card:nth-child(3) { animation-delay: 0.6s; }

    .note-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .note-card.pinned::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #fbbf24, #f59e0b);
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
    }

    .note-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .note-card h4 {
      font-size: 1.125rem;
      color: var(--primary);
      font-weight: 700;
      flex: 1;
    }

    .note-actions {
      display: flex;
      gap: 0.5rem;
    }

    .note-action-btn {
      background: var(--light-gray);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-size: 0.875rem;
    }

    .note-action-btn:hover {
      background: var(--accent);
      color: white;
    }

    .note-action-btn.delete:hover {
      background: var(--error);
    }

    .note-content {
      color: var(--text);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .note-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      color: var(--medium-gray);
      padding-top: 1rem;
      border-top: 1px solid var(--light-gray);
    }

    .note-resource-link {
      color: var(--accent);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .note-resource-link:hover {
      color: var(--secondary);
      text-decoration: underline;
    }

    .note-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(7, 23, 24, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      z-index: 300;
      animation: fadeIn 0.3s;
    }

    .note-modal-content {
      background: white;
      border-radius: 24px;
      padding: 2.5rem;
      max-width: 600px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
      animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes modalSlideUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .note-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .note-modal-header h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.75rem;
      color: var(--primary);
    }

    .note-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .note-input {
      width: 100%;
      padding: 1rem;
      border: 2px solid var(--light-gray);
      background: var(--light-gray);
      border-radius: 10px;
      font-size: 1rem;
      font-family: 'Work Sans', sans-serif;
      transition: all 0.2s;
    }

    .note-input:focus {
      outline: none;
      border-color: var(--accent);
      background: white;
    }

    .note-textarea {
      min-height: 200px;
      resize: vertical;
      font-family: 'Work Sans', sans-serif;
    }

    .note-form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn-cancel {
      padding: 0.875rem 1.5rem;
      background: var(--light-gray);
      color: var(--primary);
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background: var(--medium-gray);
      color: white;
    }

    .btn-save {
      padding: 0.875rem 1.5rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-save:hover {
      background: var(--secondary);
    }

    /* Publish Notes Styles */
    .publish-container {
      max-width: 700px;
      margin: 0 auto;
    }

    .publish-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
    }

    .publish-preview {
      border: 2px dashed var(--accent);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      background: rgba(41, 175, 193, 0.03);
    }

    .visibility-indicator {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: linear-gradient(135deg, rgba(21, 90, 96, 0.05), rgba(41, 175, 193, 0.05));
      border-radius: 10px;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      color: var(--secondary);
    }

    .publish-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .success-banner {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 1.25rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: slideDown 0.4s;
    }

    /* Exams Styles */
    .exams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .exam-card {
      background: white;
      border-radius: 16px;
      padding: 1.75rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      position: relative;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .exam-card:nth-child(1) { animation-delay: 0.4s; }
    .exam-card:nth-child(2) { animation-delay: 0.5s; }
    .exam-card:nth-child(3) { animation-delay: 0.6s; }

    .exam-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .exam-card.completed::before {
      content: '✓';
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 32px;
      height: 32px;
      background: var(--success);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.125rem;
    }

    .exam-card h4 {
      font-size: 1.25rem;
      color: var(--primary);
      margin-bottom: 0.75rem;
      font-weight: 700;
      padding-right: 2.5rem;
    }

    .exam-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
      color: var(--medium-gray);
      font-size: 0.875rem;
    }

    .exam-score {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.875rem;
    }

    /* Exam Execution Styles */
    .exam-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .exam-progress {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
    }

    .progress-bar-container {
      height: 8px;
      background: var(--light-gray);
      border-radius: 10px;
      overflow: hidden;
      margin-top: 0.75rem;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--secondary), var(--accent));
      transition: width 0.3s;
      border-radius: 10px;
    }

    .question-card {
      background: white;
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      margin-bottom: 1.5rem;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
    }

    .question-number {
      color: var(--accent);
      font-weight: 700;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }

    .question-text {
      font-size: 1.25rem;
      color: var(--primary);
      font-weight: 600;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .option-item {
      padding: 1.25rem;
      background: var(--light-gray);
      border: 2px solid transparent;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .option-item:hover {
      background: rgba(41, 175, 193, 0.1);
      border-color: var(--accent);
    }

    .option-item.selected {
      background: white;
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(7, 23, 24, 0.1);
    }

    .option-radio {
      width: 20px;
      height: 20px;
      border: 2px solid var(--medium-gray);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .option-item.selected .option-radio {
      border-color: var(--primary);
    }

    .option-item.selected .option-radio::after {
      content: '';
      width: 10px;
      height: 10px;
      background: var(--primary);
      border-radius: 50%;
    }

    .exam-navigation {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .btn-secondary {
      padding: 0.875rem 1.5rem;
      background: var(--light-gray);
      color: var(--primary);
      border: 2px solid var(--primary);
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-secondary:hover {
      background: var(--primary);
      color: white;
    }

    .btn-secondary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-finish {
      padding: 0.875rem 1.5rem;
      background: var(--success);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-finish:hover {
      background: #059669;
      transform: translateY(-2px);
    }

    /* Exam Results Styles */
    .results-header {
      background: white;
      border-radius: 16px;
      padding: 2.5rem;
      margin-bottom: 1.5rem;
      text-align: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
    }

    .score-circle {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--secondary), var(--accent));
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 8px 24px rgba(41, 175, 193, 0.3);
      animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
    }

    @keyframes scaleIn {
      from {
        transform: scale(0);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .score-circle span {
      font-size: 3rem;
      font-weight: 900;
      color: white;
    }

    .performance-indicator {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .performance-message {
      color: var(--medium-gray);
      font-size: 1rem;
    }

    .results-summary {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
    }

    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .summary-stat {
      text-align: center;
    }

    .summary-stat .label {
      font-size: 0.875rem;
      color: var(--medium-gray);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .summary-stat .value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary);
    }

    .summary-stat.correct .value {
      color: var(--success);
    }

    .summary-stat.incorrect .value {
      color: var(--error);
    }

    /* AI History Styles */
    .history-timeline {
      position: relative;
      padding-left: 2rem;
    }

    .history-timeline::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--light-gray);
    }

    .history-item {
      background: white;
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      position: relative;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .history-item:nth-child(1) { animation-delay: 0.4s; }
    .history-item:nth-child(2) { animation-delay: 0.5s; }
    .history-item:nth-child(3) { animation-delay: 0.6s; }

    .history-item::before {
      content: '';
      position: absolute;
      left: -2.5rem;
      top: 1.75rem;
      width: 12px;
      height: 12px;
      background: var(--accent);
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 2px var(--accent);
    }

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .history-item h4 {
      font-size: 1.125rem;
      color: var(--primary);
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .history-timestamp {
      font-size: 0.8rem;
      color: var(--medium-gray);
      text-align: right;
    }

    .history-query {
      background: var(--light-gray);
      padding: 1rem;
      border-radius: 10px;
      margin-bottom: 1rem;
      font-style: italic;
      color: var(--secondary);
      border-left: 4px solid var(--accent);
    }

    .history-response {
      line-height: 1.7;
      color: var(--text);
      margin-bottom: 1rem;
    }

    .history-resource {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(41, 175, 193, 0.1);
      border-radius: 20px;
      font-size: 0.85rem;
      color: var(--secondary);
      font-weight: 500;
    }

    /* Profile Styles */
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-header {
      background: white;
      border-radius: 16px;
      padding: 2.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .profile-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--secondary), var(--accent));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 900;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 8px 24px rgba(41, 175, 193, 0.3);
    }

    .profile-info {
      flex: 1;
    }

    .profile-name {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .profile-email {
      color: var(--medium-gray);
      font-size: 1rem;
      margin-bottom: 1rem;
    }

    .profile-role-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: white;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .profile-section {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .profile-section:nth-child(2) { animation-delay: 0.4s; }
    .profile-section:nth-child(3) { animation-delay: 0.5s; }
    .profile-section:nth-child(4) { animation-delay: 0.6s; }

    .profile-section h3 {
      font-size: 1.25rem;
      color: var(--primary);
      font-weight: 700;
      margin-bottom: 1.5rem;
    }

    .profile-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
    }

    .profile-stat-card {
      text-align: center;
      padding: 1.5rem;
      background: var(--light-gray);
      border-radius: 12px;
    }

    .profile-stat-card .value {
      font-size: 2.5rem;
      font-weight: 900;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .profile-stat-card .label {
      font-size: 0.875rem;
      color: var(--medium-gray);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .subscription-info {
      display: flex;
      justify-content: space-between;
      padding: 1.25rem;
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
      border-radius: 12px;
      margin-bottom: 1rem;
    }

    .subscription-info div {
      text-align: center;
    }

    .subscription-info .label {
      font-size: 0.8rem;
      color: var(--medium-gray);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .subscription-info .value {
      font-size: 1rem;
      font-weight: 700;
      color: var(--primary);
    }

    .btn-edit-profile {
      width: 100%;
      padding: 0.875rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 1rem;
    }

    .btn-edit-profile:hover {
      background: var(--secondary);
      transform: translateY(-2px);
    }

    /* Offline Mode Styles */
    .offline-banner {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      padding: 1.25rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: slideDown 0.4s;
    }

    .offline-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .offline-stat-card {
      background: white;
      padding: 1.75rem;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .offline-stat-card:nth-child(1) { animation-delay: 0.4s; }
    .offline-stat-card:nth-child(2) { animation-delay: 0.5s; }

    .offline-stat-card .icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--secondary), var(--accent));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      color: white;
    }

    .offline-stat-card h3 {
      font-size: 0.875rem;
      color: var(--medium-gray);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .offline-stat-card .value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary);
    }

    .offline-resource-card {
      background: white;
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 1.25rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .offline-resource-card:nth-child(1) { animation-delay: 0.6s; }
    .offline-resource-card:nth-child(2) { animation-delay: 0.7s; }

    .offline-resource-info h4 {
      font-size: 1.125rem;
      color: var(--primary);
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .offline-resource-meta {
      display: flex;
      gap: 1.5rem;
      font-size: 0.875rem;
      color: var(--medium-gray);
    }

    .storage-indicator {
      background: var(--light-gray);
      padding: 1.5rem;
      border-radius: 12px;
      margin-top: 2rem;
    }

    .storage-bar {
      height: 10px;
      background: var(--light-gray);
      border-radius: 10px;
      overflow: hidden;
      margin-top: 1rem;
    }

    .storage-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--secondary), var(--accent));
      border-radius: 10px;
      transition: width 0.3s;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        padding: 1rem;
      }

      .header-logo {
        font-size: 1.5rem;
      }

      .dashboard-nav,
      .dashboard-content {
        padding: 1rem;
        margin: 1rem;
      }

      .topics-grid,
      .favorites-grid,
      .notes-grid,
      .exams-grid {
        grid-template-columns: 1fr;
      }

      .resource-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .screen-nav {
        bottom: 1rem;
        padding: 0.75rem 1rem;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .screen-nav button {
        padding: 0.5rem 0.875rem;
        font-size: 0.75rem;
      }

      .detail-actions {
        flex-direction: column;
      }

      .action-btn-large {
        width: 100%;
        justify-content: center;
      }

      .ai-assistant-panel {
        border-radius: 0;
        max-height: 70vh;
      }

      .note-modal-content {
        margin: 1rem;
        padding: 1.5rem;
      }

      .profile-header {
        flex-direction: column;
        text-align: center;
      }

      .profile-avatar {
        width: 100px;
        height: 100px;
        font-size: 2.5rem;
      }

      .exam-navigation {
        flex-direction: column;
      }

      .history-timeline {
        padding-left: 1.5rem;
      }
    }
  `;

  // 1.1 - Register Screen
  const RegisterScreen = () => (
    <div className="screen-container">
      <div className="bg-pattern"></div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <h1>Academix</h1>
            <p>Tu biblioteca virtual colaborativa</p>
          </div>
          
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="tu@correo.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Contraseña</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Mínimo 8 caracteres"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Repite tu contraseña"
                required
              />
            </div>
            
            <button type="submit" className="btn-primary">
              Crear Cuenta
            </button>
          </form>
          
          <div className="auth-link">
            ¿Ya tienes cuenta? <a href="#" onClick={() => setCurrentScreen('login')}>Inicia sesión</a>
          </div>
        </div>
      </div>
    </div>
  );

  // 1.2 - Login Screen
  const LoginScreen = () => (
    <div className="screen-container">
      <div className="bg-pattern"></div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <h1>Academix</h1>
            <p>Bienvenido de nuevo</p>
          </div>
          
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="tu@correo.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Contraseña</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Tu contraseña"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary"
              onClick={() => setCurrentScreen('dashboard')}
            >
              Iniciar Sesión
            </button>
          </form>
          
          <div className="auth-link">
            ¿No tienes cuenta? <a href="#" onClick={() => setCurrentScreen('register')}>Regístrate aquí</a>
          </div>
        </div>
      </div>
    </div>
  );

  // 1.3 - Dashboard Screen
  const DashboardScreen = () => (
    <div className="screen-container dashboard">
      <div className="bg-pattern"></div>
      
      <header className="dashboard-header">
        <div className="header-logo">Academix</div>
        <div className="header-actions">
          <div className={`status-indicator ${isOnline ? 'online' : ''}`}>
            {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
            {isOnline ? 'En línea' : 'Sin conexión'}
          </div>
          <button className="icon-btn">
            <Menu size={20} />
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <div className="nav-items">
          <div className="nav-item active" onClick={() => setCurrentScreen('library')}>
            <BookOpen size={18} />
            Biblioteca
          </div>
          <div className="nav-item">
            <Heart size={18} />
            Favoritos
          </div>
          <div className="nav-item">
            <FileText size={18} />
            Mis Notas
          </div>
          <div className="nav-item">
            <ClipboardList size={18} />
            Exámenes
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        <section className="welcome-section">
          <h2>¡Bienvenido de vuelta!</h2>
          <p>Continúa tu aprendizaje donde lo dejaste</p>
        </section>

        <section className="search-section">
          <div className="search-bar">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Buscar recursos, temas o autores..."
            />
          </div>
        </section>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="icon">
              <BookOpen size={24} />
            </div>
            <h3>Recursos</h3>
            <div className="value">89</div>
          </div>
          <div className="stat-card">
            <div className="icon">
              <Heart size={24} />
            </div>
            <h3>Favoritos</h3>
            <div className="value">12</div>
          </div>
          <div className="stat-card">
            <div className="icon">
              <FileText size={24} />
            </div>
            <h3>Notas</h3>
            <div className="value">27</div>
          </div>
          <div className="stat-card">
            <div className="icon">
              <ClipboardList size={24} />
            </div>
            <h3>Exámenes</h3>
            <div className="value">8</div>
          </div>
        </div>

        <section className="resources-section">
          <h3>Recursos Destacados</h3>
          {resources.slice(0, 3).map(resource => (
            <div key={resource.id} className="resource-card">
              <div className="resource-info">
                <h4>{resource.title}</h4>
                <div className="resource-meta">
                  <span>{resource.topic} • {resource.subtopic}</span>
                  <span>{resource.type === 'PDF' ? `${resource.pages} páginas` : resource.duration}</span>
                </div>
                <span className={`difficulty-badge ${resource.difficulty.toLowerCase()}`}>
                  {resource.difficulty}
                </span>
              </div>
              <div className="resource-actions">
                <button className={`action-btn ${resource.isFavorite ? 'favorite' : ''}`}>
                  <Heart size={18} fill={resource.isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button className="action-btn">
                  <Download size={18} />
                </button>
                <button className="action-btn">
                  <Eye size={18} />
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );

  // 1.4 - Library Screen
  const LibraryScreen = () => (
    <div className="screen-container dashboard">
      <div className="bg-pattern"></div>
      
      <header className="dashboard-header">
        <div className="header-logo">Academix</div>
        <div className="header-actions">
          <div className={`status-indicator ${isOnline ? 'online' : ''}`}>
            {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
            {isOnline ? 'En línea' : 'Sin conexión'}
          </div>
          <button className="icon-btn">
            <Menu size={20} />
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <div className="nav-items">
          <div className="nav-item active">
            <BookOpen size={18} />
            Biblioteca
          </div>
          <div className="nav-item" onClick={() => setCurrentScreen('dashboard')}>
            <Heart size={18} />
            Favoritos
          </div>
          <div className="nav-item">
            <FileText size={18} />
            Mis Notas
          </div>
          <div className="nav-item">
            <ClipboardList size={18} />
            Exámenes
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        <section className="search-section">
          <div className="search-bar">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Buscar por tema, texto o etiquetas..."
              onClick={() => setCurrentScreen('search')}
            />
          </div>
        </section>

        <div className="library-header">
          <h2>Biblioteca Virtual</h2>
          <button className="filter-btn" onClick={() => setCurrentScreen('search')}>
            Filtrar por dificultad
          </button>
        </div>

        <div className="topics-grid">
          {topics.map(topic => (
            <div key={topic.id} className="topic-card">
              <h3>{topic.name}</h3>
              <div className="topic-meta">
                <span>{topic.resources} recursos</span>
                <span className={`difficulty-badge ${topic.difficulty.toLowerCase()}`}>
                  {topic.difficulty}
                </span>
              </div>
              <div className="subtopics-list">
                {topic.subtopics.map((subtopic, idx) => (
                  <span key={idx} className="subtopic-tag">
                    {subtopic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <section className="resources-section">
          <h3>Recursos Recientes</h3>
          {resources.map(resource => (
            <div 
              key={resource.id} 
              className="resource-card"
              onClick={() => {
                setSelectedResource(resource);
                setCurrentScreen('detail');
              }}
            >
              <div className="resource-info">
                <h4>{resource.title}</h4>
                <div className="resource-meta">
                  <span>{resource.topic} • {resource.subtopic}</span>
                  <span>{resource.type === 'PDF' ? `${resource.pages} páginas` : resource.duration}</span>
                </div>
                <span className={`difficulty-badge ${resource.difficulty.toLowerCase()}`}>
                  {resource.difficulty}
                </span>
              </div>
              <div className="resource-actions">
                <button className={`action-btn ${resource.isFavorite ? 'favorite' : ''}`}>
                  <Heart size={18} fill={resource.isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button className="action-btn">
                  <Download size={18} />
                </button>
                <button className="action-btn">
                  <Eye size={18} />
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );

  // 1.5 - Search and Filters Screen
  const SearchScreen = () => {
    const [selectedTags, setSelectedTags] = React.useState([]);
    const allTags = ['derivadas', 'límites', 'mecánica', 'fuerzas', 'nomenclatura', 'orgánica', 'análisis', 'crítica'];
    
    const toggleTag = (tag) => {
      setSelectedTags(prev => 
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
      );
    };

    return (
      <div className="screen-container dashboard">
        <div className="bg-pattern"></div>
        
        <header className="dashboard-header">
          <div className="header-logo">Academix</div>
          <div className="header-actions">
            <div className={`status-indicator ${isOnline ? 'online' : ''}`}>
              {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
              {isOnline ? 'En línea' : 'Sin conexión'}
            </div>
            <button className="icon-btn" onClick={() => setCurrentScreen('library')}>
              <X size={20} />
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <section className="search-section">
            <div className="search-bar">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Buscar recursos educativos..."
                autoFocus
              />
            </div>
          </section>

          <div className="filters-panel">
            <div className="filters-header">
              <h3>Filtros de Búsqueda</h3>
              <button className="clear-filters">Limpiar filtros</button>
            </div>

            <div className="filter-group">
              <label>Tema</label>
              <select className="filter-select">
                <option value="">Todos los temas</option>
                <option value="matematicas">Matemáticas</option>
                <option value="fisica">Física</option>
                <option value="quimica">Química</option>
                <option value="literatura">Literatura</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Subtema</label>
              <select className="filter-select">
                <option value="">Todos los subtemas</option>
                <option value="algebra">Álgebra</option>
                <option value="calculo">Cálculo</option>
                <option value="mecanica">Mecánica</option>
                <option value="organica">Química Orgánica</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Nivel de Dificultad</label>
              <select className="filter-select">
                <option value="">Todos los niveles</option>
                <option value="basico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Etiquetas</label>
              <div className="tags-filter">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={`tag-chip ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="search-results-header">
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 700 }}>
              Resultados
            </h3>
            <span className="results-count">{resources.length} recursos encontrados</span>
          </div>

          <section className="resources-section">
            {resources.map(resource => (
              <div 
                key={resource.id} 
                className="resource-card"
                onClick={() => {
                  setSelectedResource(resource);
                  setCurrentScreen('detail');
                }}
              >
                <div className="resource-info">
                  <h4>{resource.title}</h4>
                  <div className="resource-meta">
                    <span>{resource.topic} • {resource.subtopic}</span>
                    <span>{resource.type === 'PDF' ? `${resource.pages} páginas` : resource.duration}</span>
                    <span>Por {resource.author}</span>
                  </div>
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className={`difficulty-badge ${resource.difficulty.toLowerCase()}`}>
                      {resource.difficulty}
                    </span>
                    {resource.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="subtopic-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="resource-actions">
                  <button className={`action-btn ${resource.isFavorite ? 'favorite' : ''}`}>
                    <Heart size={18} fill={resource.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button className="action-btn">
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    );
  };

  // 1.6 - Resource Detail Screen
  const ResourceDetailScreen = () => {
    if (!selectedResource) return null;

    const handleTextSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      if (text && text.length > 0) {
        setSelectedText(text);
        if (userRole === 'premium') {
          setShowAIAssistant(true);
        }
      }
    };

    return (
      <div className="screen-container dashboard">
        <div className="bg-pattern"></div>
        
        <header className="dashboard-header">
          <div className="header-logo">Academix</div>
          <div className="header-actions">
            <div className={`status-indicator ${isOnline ? 'online' : ''}`}>
              {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
              {isOnline ? 'En línea' : 'Sin conexión'}
            </div>
            <button className="icon-btn" onClick={() => setCurrentScreen('library')}>
              <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
        </header>

        <main className="dashboard-content detail-container">
          <div className="detail-header">
            <h1>{selectedResource.title}</h1>
            
            <div className="detail-meta">
              <span>{selectedResource.topic} • {selectedResource.subtopic}</span>
              <span>{selectedResource.type === 'PDF' ? `${selectedResource.pages} páginas` : selectedResource.duration}</span>
              <span>Por {selectedResource.author}</span>
              <span className={`difficulty-badge ${selectedResource.difficulty.toLowerCase()}`}>
                {selectedResource.difficulty}
              </span>
            </div>

            <div className="detail-actions">
              <button 
                className={`action-btn-large favorite ${selectedResource.isFavorite ? 'active' : ''}`}
              >
                <Heart size={18} fill={selectedResource.isFavorite ? 'currentColor' : 'none'} />
                {selectedResource.isFavorite ? 'En Favoritos' : 'Agregar a Favoritos'}
              </button>
              
              {(userRole === 'premium' || selectedResource.type === 'PDF') && (
                <button className="action-btn-large secondary">
                  <Download size={18} />
                  Descargar
                </button>
              )}

              {userRole === 'premium' && (
                <span className="premium-badge">
                  <Star size={14} fill="currentColor" />
                  Premium
                </span>
              )}
            </div>
          </div>

          <div 
            className="content-viewer" 
            onMouseUp={handleTextSelection}
          >
            <p>{selectedResource.content}</p>
            <br />
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <br />
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            {userRole === 'premium' && (
              <div style={{ 
                marginTop: '2rem', 
                padding: '1rem', 
                background: 'rgba(41, 175, 193, 0.1)', 
                borderRadius: '10px',
                fontSize: '0.9rem',
                color: 'var(--secondary)'
              }}>
                💡 <strong>Tip Premium:</strong> Selecciona cualquier texto para recibir asistencia inteligente contextual.
              </div>
            )}
          </div>
        </main>

        <div className={`ai-assistant-panel ${showAIAssistant ? 'open' : ''}`}>
          <div className="ai-panel-header">
            <h3>Asistencia Inteligente</h3>
            <button className="close-btn" onClick={() => setShowAIAssistant(false)}>
              <X size={18} />
            </button>
          </div>

          {selectedText && (
            <div className="selected-text-box">
              "{selectedText}"
            </div>
          )}

          <div className="ai-response">
            <p>
              <strong>Explicación contextual:</strong><br /><br />
              Este concepto se refiere a los fundamentos matemáticos que permiten entender cómo las funciones cambian en relación con sus variables. Es particularmente útil para resolver problemas de optimización y modelar fenómenos del mundo real.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // 1.7 - Favorites Screen
  const FavoritesScreen = () => {
    const favoriteResources = resources.filter(r => r.isFavorite);

    return (
      <div className="screen-container dashboard">
        <div className="bg-pattern"></div>
        
        <header className="dashboard-header">
          <div className="header-logo">Academix</div>
          <div className="header-actions">
            <div className={`status-indicator ${isOnline ? 'online' : ''}`}>
              {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
              {isOnline ? 'En línea' : 'Sin conexión'}
            </div>
            <button className="icon-btn">
              <Menu size={20} />
            </button>
          </div>
        </header>

        <nav className="dashboard-nav">
          <div className="nav-items">
            <div className="nav-item" onClick={() => setCurrentScreen('library')}>
              <BookOpen size={18} />
              Biblioteca
            </div>
            <div className="nav-item active">
              <Heart size={18} />
              Favoritos
            </div>
            <div className="nav-item" onClick={() => setCurrentScreen('notes')}>
              <FileText size={18} />
              Mis Notas
            </div>
            <div className="nav-item">
              <ClipboardList size={18} />
              Exámenes
            </div>
          </div>
        </nav>

        <main className="dashboard-content">
          <div className="library-header">
            <h2>Mis Favoritos</h2>
            <span style={{ color: 'var(--medium-gray)', fontSize: '1rem' }}>
              {favoriteResources.length} recursos guardados
            </span>
          </div>

          {favoriteResources.length > 0 ? (
            <div className="favorites-grid">
              {favoriteResources.map(resource => (
                <div key={resource.id} className="favorite-card">
                  <button className="remove-favorite">
                    <X size={18} />
                  </button>
                  
                  <h4>{resource.title}</h4>
                  
                  <div className="resource-meta">
                    <span>{resource.topic} • {resource.subtopic}</span>
                    <span>{resource.type === 'PDF' ? `${resource.pages} páginas` : resource.duration}</span>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`difficulty-badge ${resource.difficulty.toLowerCase()}`}>
                      {resource.difficulty}
                    </span>
                    {resource.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="subtopic-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                    <button 
                      className="action-btn"
                      onClick={() => {
                        setSelectedResource(resource);
                        setCurrentScreen('detail');
                      }}
                    >
                      <Eye size={18} />
                    </button>
                    <button className="action-btn">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Heart size={64} />
              <h3>No tienes favoritos aún</h3>
              <p>Explora la biblioteca y guarda tus recursos preferidos</p>
              <button 
                className="btn-primary" 
                style={{ marginTop: '1.5rem', maxWidth: '300px' }}
                onClick={() => setCurrentScreen('library')}
              >
                Explorar Biblioteca
              </button>
            </div>
          )}
        </main>
      </div>
    );
  };

  // 1.8 - Personal Notes Screen
  const NotesScreen = () => {
    const [showNoteModal, setShowNoteModal] = React.useState(false);
    const [noteForm, setNoteForm] = React.useState({ title: '', content: '', resourceId: null });

    const handleCreateNote = () => {
      setNoteForm({ title: '', content: '', resourceId: null });
      setSelectedNote(null);
      setIsEditingNote(false);
      setShowNoteModal(true);
    };

    const handleEditNote = (note) => {
      setNoteForm({ title: note.title, content: note.content, resourceId: note.resourceId });
      setSelectedNote(note);
      setIsEditingNote(true);
      setShowNoteModal(true);
    };

    const handleSaveNote = () => {
      if (isEditingNote) {
        setNotes(notes.map(n => 
          n.id === selectedNote.id 
            ? { ...n, ...noteForm, date: new Date().toISOString().split('T')[0] }
            : n
        ));
      } else {
        const newNote = {
          id: notes.length + 1,
          ...noteForm,
          date: new Date().toISOString().split('T')[0],
          isPinned: false
        };
        setNotes([newNote, ...notes]);
      }
      setShowNoteModal(false);
    };

    const handleDeleteNote = (noteId) => {
      setNotes(notes.filter(n => n.id !== noteId));
    };

    return (
      <div className="screen-container dashboard">
        <div className="bg-pattern"></div>
        
        <header className="dashboard-header">
          <div className="header-logo">Academix</div>
          <div className="header-actions">
            <div className={`status-indicator ${isOnline ? 'online' : ''}`}>
              {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
              {isOnline ? 'En línea' : 'Sin conexión'}
            </div>
            <button className="icon-btn">
              <Menu size={20} />
            </button>
          </div>
        </header>

        <nav className="dashboard-nav">
          <div className="nav-items">
            <div className="nav-item" onClick={() => setCurrentScreen('library')}>
              <BookOpen size={18} />
              Biblioteca
            </div>
            <div className="nav-item" onClick={() => setCurrentScreen('favorites')}>
              <Heart size={18} />
              Favoritos
            </div>
            <div className="nav-item active">
              <FileText size={18} />
              Mis Notas
            </div>
            <div className="nav-item">
              <ClipboardList size={18} />
              Exámenes
            </div>
          </div>
        </nav>

        <main className="dashboard-content">
          <div className="notes-header">
            <h2>Mis Notas</h2>
            <button className="btn-create-note" onClick={handleCreateNote}>
              <FileText size={18} />
              Nueva Nota
            </button>
          </div>

          {notes.length > 0 ? (
            <div className="notes-grid">
              {notes.map(note => (
                <div key={note.id} className={`note-card ${note.isPinned ? 'pinned' : ''}`}>
                  <div className="note-header">
                    <h4>{note.title}</h4>
                    <div className="note-actions">
                      <button 
                        className="note-action-btn"
                        onClick={() => handleEditNote(note)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="note-action-btn delete"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p className="note-content">{note.content}</p>

                  <div className="note-footer">
                    <span>{note.date}</span>
                    {note.resourceId && (
                      <a 
                        href="#" 
                        className="note-resource-link"
                        onClick={(e) => {
                          e.preventDefault();
                          const resource = resources.find(r => r.id === note.resourceId);
                          if (resource) {
                            setSelectedResource(resource);
                            setCurrentScreen('detail');
                          }
                        }}
                      >
                        📎 {note.resourceTitle}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FileText size={64} />
              <h3>No tienes notas aún</h3>
              <p>Crea tu primera nota para organizar tu aprendizaje</p>
              <button 
                className="btn-primary" 
                style={{ marginTop: '1.5rem', maxWidth: '300px' }}
                onClick={handleCreateNote}
              >
                Crear Primera Nota
              </button>
            </div>
          )}
        </main>

        {showNoteModal && (
          <div className="note-modal" onClick={() => setShowNoteModal(false)}>
            <div className="note-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="note-modal-header">
                <h3>{isEditingNote ? 'Editar Nota' : 'Nueva Nota'}</h3>
                <button className="close-btn" onClick={() => setShowNoteModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form className="note-form" onSubmit={(e) => { e.preventDefault(); handleSaveNote(); }}>
                <div className="form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    className="note-input"
                    placeholder="Título de la nota..."
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Contenido</label>
                  <textarea
                    className="note-input note-textarea"
                    placeholder="Escribe tu nota aquí..."
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Asociar con Recurso (Opcional)</label>
                  <select 
                    className="filter-select"
                    value={noteForm.resourceId || ''}
                    onChange={(e) => setNoteForm({ ...noteForm, resourceId: e.target.value ? parseInt(e.target.value) : null })}
                  >
                    <option value="">Ninguno</option>
                    {resources.map(resource => (
                      <option key={resource.id} value={resource.id}>
                        {resource.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="note-form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowNoteModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save">
                    {isEditingNote ? 'Guardar Cambios' : 'Crear Nota'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 1.9 - Publish Notes Screen
  const PublishNotesScreen = () => {
    const [selectedNoteToPublish, setSelectedNoteToPublish] = React.useState(null);
    const [published, setPublished] = React.useState(false);

    const handlePublish = () => {
      setPublished(true);
      setTimeout(() => {
        setCurrentScreen('notes');
      }, 2000);
    };

    return (
      <div className="screen-container dashboard">
        <div className="bg-pattern"></div>
        
        <header className="dashboard-header">
          <div className="header-logo">Academix</div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setCurrentScreen('notes')}>
              <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
        </header>

        <main className="dashboard-content publish-container">
          <h2 style={{ 
            fontFamily: 'Playfair Display, serif', 
            fontSize: '2rem', 
            color: 'var(--primary)',
            marginBottom: '1.5rem',
            animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both'
          }}>
            Publicar Nota a la Comunidad
          </h2>

          {published && (
            <div className="success-banner">
              <CheckCircle size={24} />
              <div>
                <strong>¡Nota publicada exitosamente!</strong>
                <br />
                <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  Tu nota ahora es visible para toda la comunidad de Academix
                </span>
              </div>
            </div>
          )}

          <div className="publish-card">
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>
              Selecciona una nota
            </h3>
            <select 
              className="filter-select"
              value={selectedNoteToPublish?.id || ''}
              onChange={(e) => {
                const note = notes.find(n => n.id === parseInt(e.target.value));
                setSelectedNoteToPublish(note);
              }}
            >
              <option value="">-- Selecciona una nota --</option>
              {notes.map(note => (
                <option key={note.id} value={note.id}>
                  {note.title}
                </option>
              ))}
            </select>
          </div>

          {selectedNoteToPublish && (
            <>
              <div className="publish-card">
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                  Vista previa
                </h3>
                <div className="publish-preview">
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    {selectedNoteToPublish.title}
                  </h4>
                  <p style={{ lineHeight: 1.7, color: 'var(--text)' }}>
                    {selectedNoteToPublish.content}
                  </p>
                  {selectedNoteToPublish.resourceId && (
                    <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--secondary)' }}>
                      📎 Asociada con: {selectedNoteToPublish.resourceTitle}
                    </div>
                  )}
                </div>

                <div className="visibility-indicator">
                  <Eye size={20} />
                  <div>
                    <strong>Visibilidad Comunitaria</strong>
                    <br />
                    <span style={{ fontSize: '0.85rem' }}>
                      Esta nota será visible para todos los usuarios de Academix
                    </span>
                  </div>
                </div>

                <div className="publish-actions">
                  <button 
                    className="btn-cancel"
                    onClick={() => setCurrentScreen('notes')}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={handlePublish}
                    disabled={published}
                  >
                    {published ? 'Publicando...' : 'Publicar Nota'}
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    );
  };

  // 1.10 - Exams List Screen
  const ExamsScreen = () => {
    return (
      <div className="screen-container dashboard">
        <div className="bg-pattern"></div>
        
        <header className="dashboard-header">
          <div className="header-logo">Academix</div>
          <div className="header-actions">
            <div className={`status-indicator ${isOnline ? 'online' : ''}`}>
              {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
              {isOnline ? 'En línea' : 'Sin conexión'}
            </div>
            <button className="icon-btn">
              <Menu size={20} />
            </button>
          </div>
        </header>

        <nav className="dashboard-nav">
          <div className="nav-items">
            <div className="nav-item" onClick={() => setCurrentScreen('library')}>
              <BookOpen size={18} />
              Biblioteca
            </div>
            <div className="nav-item" onClick={() => setCurrentScreen('favorites')}>
              <Heart size={18} />
              Favoritos
            </div>
            <div className="nav-item" onClick={() => setCurrentScreen('notes')}>
              <FileText size={18} />
              Mis Notas
            </div>
            <div className="nav-item active">
              <ClipboardList size={18} />
              Exámenes
            </div>
          </div>
        </nav>

        <main className="dashboard-content">
          <div className="library-header">
            <h2>Exámenes por Tema</h2>
            <span style={{ color: 'var(--medium-gray)', fontSize: '1rem' }}>
              {exams.length} exámenes disponibles
            </span>
          </div>

          <div className="exams-grid">
            {exams.map(exam => (
              <div 
                key={exam.id} 
                className={`exam-card ${exam.completed ? 'completed' : ''}`}
                onClick={() => {
                  if (!exam.completed) {
                    setSelectedExam(exam);
                    setCurrentQuestion(0);
                    setExamAnswers({});
                    setCurrentScreen('exam-execution');
                  } else {
                    setExamResult({ score: exam.score, total: exam.questions });
                    setCurrentScreen('exam-results');
                  }
                }}
              >
                <h4>{exam.title}</h4>
                
                <div className="exam-meta">
                  <span>{exam.topic} • {exam.subtopic}</span>
                  <span>{exam.questions} preguntas</span>
                  <span>{exam.duration}</span>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className={`difficulty-badge ${exam.difficulty.toLowerCase()}`}>
                    {exam.difficulty}
                  </span>
                  {exam.completed && (
                    <span className="exam-score">{exam.score}%</span>
                  )}
                </div>

                <button 
                  className="btn-primary" 
                  style={{ marginTop: '1.5rem', width: '100%' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!exam.completed) {
                      setSelectedExam(exam);
                      setCurrentQuestion(0);
                      setExamAnswers({});
                      setCurrentScreen('exam-execution');
                    }
                  }}
                >
                  {exam.completed ? 'Ver Resultados' : 'Comenzar Examen'}
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  };

  // 1.11 - Exam Execution Screen
  const ExamExecutionScreen = () => {
    if (!selectedExam) return null;

    const progress = ((currentQuestion + 1) / examQuestions.length) * 100;

    const handleAnswerSelect = (optionIndex) => {
      setExamAnswers({
        ...examAnswers,
        [currentQuestion]: optionIndex
      });
    };

    const handleNext = () => {
      if (currentQuestion < examQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    };

    const handlePrevious = () => {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      }
    };

    const handleFinish = () => {
      // Calculate score
      let correct = 0;
      examQuestions.forEach((q, index) => {
        if (examAnswers[index] === q.correctAnswer) {
          correct++;
        }
      });
      const score = Math.round((correct / examQuestions.length) * 100);
      
      setExamResult({
        score,
        total: examQuestions.length,
        correct,
        incorrect: examQuestions.length - correct
      });
      
      // Update exam status
      setExams(exams.map(e => 
        e.id === selectedExam.id 
          ? { ...e, completed: true, score }
          : e
      ));
      
      setCurrentScreen('exam-results');
    };

    const currentQ = examQuestions[currentQuestion];

    return (
      <div className="screen-container dashboard">
        <div className="bg-pattern"></div>
        
        <header className="dashboard-header">
          <div className="header-logo">Academix</div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setCurrentScreen('exams')}>
              <X size={20} />
            </button>
          </div>
        </header>

        <main className="dashboard-content exam-container">
          <div className="exam-progress">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', color: 'var(--primary)', fontWeight: 700 }}>
                {selectedExam.title}
              </h3>
              <span style={{ color: 'var(--medium-gray)', fontSize: '0.95rem' }}>
                Pregunta {currentQuestion + 1} de {examQuestions.length}
              </span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="question-card">
            <div className="question-number">
              Pregunta {currentQuestion + 1}
            </div>
            <div className="question-text">
              {currentQ.question}
            </div>

            <div className="options-list">
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className={`option-item ${examAnswers[currentQuestion] === index ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="option-radio"></div>
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="exam-navigation">
            <button 
              className="btn-secondary"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
              Anterior
            </button>
            
            {currentQuestion === examQuestions.length - 1 ? (
              <button 
                className="btn-finish"
                onClick={handleFinish}
              >
                Finalizar Examen
              </button>
            ) : (
              <button 
                className="btn-secondary"
                onClick={handleNext}
              >
                Siguiente
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </main>
      </div>
    );
  };

  // 1.12 - Exam Results Screen
  const ExamResultsScreen = () => {
    if (!examResult) return null;

    const getPerformanceMessage = (score) => {
      if (score >= 90) return '¡Excelente trabajo!';
      if (score >= 75) return '¡Muy bien!';
      if (score >= 60) return 'Buen esfuerzo';
      return 'Sigue practicando';
    };

    return (
      <div className="screen-container dashboard">
        <div className="bg-pattern"></div>
        
        <header className="dashboard-header">
          <div className="header-logo">Academix</div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setCurrentScreen('exams')}>
              <X size={20} />
            </button>
          </div>
        </header>

        <main className="dashboard-content exam-container">
          <div className="results-header">
            <div className="score-circle">
              <span>{examResult.score}%</span>
            </div>
            <div className="performance-indicator">
              {getPerformanceMessage(examResult.score)}
            </div>
            <p className="performance-message">
              Has completado el examen exitosamente
            </p>
          </div>

          <div className="results-summary">
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Resumen de Resultados
            </h3>
            <p style={{ color: 'var(--medium-gray)', marginBottom: '1rem' }}>
              Aquí está el desglose de tu desempeño
            </p>

            <div className="summary-stats">
              <div className="summary-stat">
                <div className="label">Total Preguntas</div>
                <div className="value">{examResult.total}</div>
              </div>
              <div className="summary-stat correct">
                <div className="label">Correctas</div>
                <div className="value">{examResult.correct}</div>
              </div>
              <div className="summary-stat incorrect">
                <div className="label">Incorrectas</div>
                <div className="value">{examResult.incorrect}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1 }}
                onClick={() => setCurrentScreen('exams')}
              >
                Ver Más Exámenes
              </button>
              <button 
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setCurrentScreen('dashboard')}
              >
                Ir al Inicio
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  };

  // 1.13 - AI Assistant Screen (Premium)
  const AIAssistantScreen = () => {
    const isPremium = userRole === 'premium';

    return (
      <div className="screen-container dashboard">
        <div className="bg-pattern"></div>
        
        <header className="dashboard-header">
          <div className="header-logo">Academix</div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setCurrentScreen('dashboard')}>
              <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
        </header>

        <main className="dashboard-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2rem',
            color: 'var(--primary)',
            marginBottom: '1.5rem',
            animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Star size={32} fill="#fbbf24" color="#fbbf24" />
            Asistencia Inteligente
          </div>

          {!isPremium ? (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
              animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 8px 24px rgba(251, 191, 36, 0.3)'
              }}>
                <Star size={48} fill="white" color="white" />
              </div>
              <h3 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                Actualiza a Premium
              </h3>
              <p style={{ color: 'var(--medium-gray)', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.7 }}>
                La Asistencia Inteligente está disponible exclusivamente para usuarios Premium. 
                Obtén explicaciones contextuales, análisis profundo de conceptos y soporte personalizado para tu aprendizaje.
              </p>
              <button className="btn-primary" style={{ maxWidth: '300px' }}>
                Obtener Premium
              </button>
            </div>
          ) : (
            <>
              <div style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
                padding: '1.25rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <Star size={20} fill="#fbbf24" color="#fbbf24" />
                  <strong style={{ color: 'var(--primary)' }}>Característica Premium Activa</strong>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', margin: 0 }}>
                  Selecciona cualquier texto en un recurso para recibir asistencia contextual
                </p>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both'
              }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                  ¿Cómo funciona?
                </h3>
                <ol style={{ paddingLeft: '1.5rem', lineHeight: 2, color: 'var(--text)' }}>
                  <li>Navega a cualquier recurso educativo</li>
                  <li>Selecciona el texto que deseas comprender mejor</li>
                  <li>La IA analizará el contexto y te proporcionará una explicación detallada</li>
                  <li>Todas tus consultas se guardan en tu historial</li>
                </ol>

                <button 
                  className="btn-primary" 
                  style={{ marginTop: '1.5rem', width: '100%' }}
                  onClick={() => {
                    setSelectedResource(resources[0]);
                    setCurrentScreen('detail');
                  }}
                >
                  Probar con un Recurso
                </button>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                marginTop: '1.5rem',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both'
              }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                  Consultas Recientes
                </h3>
                <button 
                  className="btn-secondary"
                  style={{ width: '100%' }}
                  onClick={() => setCurrentScreen('ai-history')}
                >
                  Ver Historial Completo
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    );
  };

  // 1.14 - AI History Screen
  const AIHistoryScreen = () => {
    return (
      <div className="screen-container dashboard">
        <div className="bg-pattern"></div>
        
        <header className="dashboard-header">
          <div className="header-logo">Academix</div>
          <div className="header-actions">
            <div className={`status-indicator ${isOnline ? 'online' : ''}`}>
              {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
              {isOnline ? 'En línea' : 'Sin conexión'}
            </div>
            <button className="icon-btn" onClick={() => setCurrentScreen('ai-assistant')}>
              <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
        </header>

        <main className="dashboard-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both'
          }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--primary)' }}>
              Historial de Consultas
            </h2>
            <span className="premium-badge">
              <Star size={14} fill="currentColor" />
              Premium
            </span>
          </div>

          <div className="history-timeline">
            {aiHistory.map(item => (
              <div key={item.id} className="history-item">
                <div className="history-header">
                  <div>
                    <h4>{item.query}</h4>
                    <span className="history-resource">
                      📚 {item.resourceTitle}
                    </span>
                  </div>
                  <div className="history-timestamp">
                    {item.date}
                    <br />
                    {item.time}
                  </div>
                </div>

                <div className="history-query">
                  "{item.selectedText}"
                </div>

                <div className="history-response">
                  {item.response}
                </div>
              </div>
            ))}
          </div>

          {aiHistory.length === 0 && (
            <div className="empty-state">
              <FileText size={64} />
              <h3>No hay consultas aún</h3>
              <p>Tus consultas de asistencia inteligente aparecerán aquí</p>
            </div>
          )}
        </main>
      </div>
    );
  };

  // 1.15 - User Profile Screen
  const ProfileScreen = () => {
    return (
      <div className="screen-container dashboard">
        <div className="bg-pattern"></div>
        
        <header className="dashboard-header">
          <div className="header-logo">Academix</div>
          <div className="header-actions">
            <div className={`status-indicator ${isOnline ? 'online' : ''}`}>
              {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
              {isOnline ? 'En línea' : 'Sin conexión'}
            </div>
            <button className="icon-btn" onClick={() => setCurrentScreen('dashboard')}>
              <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
        </header>

        <main className="dashboard-content profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              {userProfile.avatar}
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{userProfile.name}</h2>
              <p className="profile-email">{userProfile.email}</p>
              <span className="profile-role-badge">
                <Star size={16} fill="currentColor" />
                Usuario {userProfile.role === 'premium' ? 'Premium' : 'Estándar'}
              </span>
            </div>
          </div>

          <div className="profile-section">
            <h3>Estadísticas de Aprendizaje</h3>
            <div className="profile-stats">
              <div className="profile-stat-card">
                <div className="value">{userProfile.notesCount}</div>
                <div className="label">Notas Creadas</div>
              </div>
              <div className="profile-stat-card">
                <div className="value">{userProfile.favoritesCount}</div>
                <div className="label">Favoritos</div>
              </div>
              <div className="profile-stat-card">
                <div className="value">{userProfile.examsCompleted}</div>
                <div className="label">Exámenes Completados</div>
              </div>
            </div>
          </div>

          {userProfile.role === 'premium' && (
            <div className="profile-section">
              <h3>Estado de Suscripción Premium</h3>
              <div className="subscription-info">
                <div>
                  <div className="label">Inicio</div>
                  <div className="value">{userProfile.subscriptionStart}</div>
                </div>
                <div>
                  <div className="label">Renovación</div>
                  <div className="value">{userProfile.subscriptionEnd}</div>
                </div>
                <div>
                  <div className="label">Estado</div>
                  <div className="value" style={{ color: 'var(--success)' }}>✓ Activa</div>
                </div>
              </div>
              <p style={{ color: 'var(--medium-gray)', fontSize: '0.9rem', marginTop: '1rem' }}>
                Tu suscripción Premium te da acceso a asistencia inteligente, recursos exclusivos y herramientas avanzadas.
              </p>
            </div>
          )}

          <div className="profile-section">
            <h3>Información Personal</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input 
                  type="email" 
                  className="form-input"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                />
              </div>
              <button type="submit" className="btn-edit-profile">
                Guardar Cambios
              </button>
            </form>
          </div>

          <div className="profile-section">
            <h3>Preferencias</h3>
            <button 
              className="btn-secondary" 
              style={{ width: '100%', marginBottom: '0.75rem' }}
              onClick={() => setCurrentScreen('offline')}
            >
              Gestionar Contenido Offline
            </button>
            <button 
              className="btn-secondary" 
              style={{ width: '100%', marginBottom: '0.75rem' }}
            >
              Notificaciones
            </button>
            <button 
              className="btn-secondary" 
              style={{ width: '100%', border: '2px solid var(--error)', color: 'var(--error)' }}
              onClick={() => setCurrentScreen('login')}
            >
              Cerrar Sesión
            </button>
          </div>
        </main>
      </div>
    );
  };

  // 1.16 - Offline Mode Screen
  const OfflineScreen = () => {
    return (
      <div className="screen-container dashboard">
        <div className="bg-pattern"></div>
        
        <header className="dashboard-header">
          <div className="header-logo">Academix</div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setCurrentScreen('profile')}>
              <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both'
          }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--primary)' }}>
              Contenido Offline
            </h2>
            <button 
              className="icon-btn"
              onClick={() => setIsOnline(!isOnline)}
              title={isOnline ? 'Simular modo offline' : 'Volver a modo online'}
            >
              {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
            </button>
          </div>

          {!isOnline && (
            <div className="offline-banner">
              <WifiOff size={24} />
              <div>
                <strong>Modo Offline Activo</strong>
                <br />
                <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  Puedes acceder a tus recursos descargados y notas guardadas
                </span>
              </div>
            </div>
          )}

          <div className="offline-stats">
            <div className="offline-stat-card">
              <div className="icon">
                <Download size={24} />
              </div>
              <h3>Recursos Descargados</h3>
              <div className="value">{offlineResources.length}</div>
            </div>
            <div className="offline-stat-card">
              <div className="icon">
                <FileText size={24} />
              </div>
              <h3>Notas Disponibles</h3>
              <div className="value">{notes.length}</div>
            </div>
          </div>

          <h3 style={{ 
            fontSize: '1.5rem', 
            color: 'var(--primary)', 
            marginBottom: '1.5rem',
            animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both'
          }}>
            Recursos Descargados
          </h3>

          {offlineResources.map(resource => (
            <div key={resource.id} className="offline-resource-card">
              <div className="offline-resource-info">
                <h4>{resource.title}</h4>
                <div className="offline-resource-meta">
                  <span>{resource.topic}</span>
                  <span>{resource.size}</span>
                  <span>Descargado: {resource.downloadDate}</span>
                  <span className="subtopic-tag">{resource.type}</span>
                </div>
              </div>
              <div className="resource-actions">
                <button className="action-btn">
                  <Eye size={18} />
                </button>
                <button className="action-btn delete">
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}

          {offlineResources.length === 0 && (
            <div className="empty-state">
              <Download size={64} />
              <h3>No hay recursos descargados</h3>
              <p>Descarga recursos desde la biblioteca para acceder sin conexión</p>
              <button 
                className="btn-primary" 
                style={{ marginTop: '1.5rem', maxWidth: '300px' }}
                onClick={() => setCurrentScreen('library')}
              >
                Ir a la Biblioteca
              </button>
            </div>
          )}

          <div className="storage-indicator">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Almacenamiento Usado</span>
              <span style={{ color: 'var(--medium-gray)' }}>7.3 MB / 100 MB</span>
            </div>
            <div className="storage-bar">
              <div className="storage-fill" style={{ width: '7.3%' }}></div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      
      {currentScreen === 'register' && <RegisterScreen />}
      {currentScreen === 'login' && <LoginScreen />}
      {currentScreen === 'dashboard' && <DashboardScreen />}
      {currentScreen === 'library' && <LibraryScreen />}
      {currentScreen === 'search' && <SearchScreen />}
      {currentScreen === 'detail' && <ResourceDetailScreen />}
      {currentScreen === 'favorites' && <FavoritesScreen />}
      {currentScreen === 'notes' && <NotesScreen />}
      {currentScreen === 'publish-notes' && <PublishNotesScreen />}
      {currentScreen === 'exams' && <ExamsScreen />}
      {currentScreen === 'exam-execution' && <ExamExecutionScreen />}
      {currentScreen === 'exam-results' && <ExamResultsScreen />}
      {currentScreen === 'ai-assistant' && <AIAssistantScreen />}
      {currentScreen === 'ai-history' && <AIHistoryScreen />}
      {currentScreen === 'profile' && <ProfileScreen />}
      {currentScreen === 'offline' && <OfflineScreen />}

      <div className="screen-nav">
        <button 
          className={currentScreen === 'register' ? 'active' : ''}
          onClick={() => setCurrentScreen('register')}
        >
          1.1
        </button>
        <button 
          className={currentScreen === 'login' ? 'active' : ''}
          onClick={() => setCurrentScreen('login')}
        >
          1.2
        </button>
        <button 
          className={currentScreen === 'dashboard' ? 'active' : ''}
          onClick={() => setCurrentScreen('dashboard')}
        >
          1.3
        </button>
        <button 
          className={currentScreen === 'library' ? 'active' : ''}
          onClick={() => setCurrentScreen('library')}
        >
          1.4
        </button>
        <button 
          className={currentScreen === 'search' ? 'active' : ''}
          onClick={() => setCurrentScreen('search')}
        >
          1.5
        </button>
        <button 
          className={currentScreen === 'detail' ? 'active' : ''}
          onClick={() => {
            if (!selectedResource) setSelectedResource(resources[0]);
            setCurrentScreen('detail');
          }}
        >
          1.6
        </button>
        <button 
          className={currentScreen === 'favorites' ? 'active' : ''}
          onClick={() => setCurrentScreen('favorites')}
        >
          1.7
        </button>
        <button 
          className={currentScreen === 'notes' ? 'active' : ''}
          onClick={() => setCurrentScreen('notes')}
        >
          1.8
        </button>
        <button 
          className={currentScreen === 'publish-notes' ? 'active' : ''}
          onClick={() => setCurrentScreen('publish-notes')}
        >
          1.9
        </button>
        <button 
          className={currentScreen === 'exams' ? 'active' : ''}
          onClick={() => setCurrentScreen('exams')}
        >
          1.10
        </button>
        <button 
          className={currentScreen === 'exam-execution' ? 'active' : ''}
          onClick={() => {
            if (!selectedExam) setSelectedExam(exams[0]);
            setCurrentScreen('exam-execution');
          }}
        >
          1.11
        </button>
        <button 
          className={currentScreen === 'exam-results' ? 'active' : ''}
          onClick={() => {
            if (!examResult) setExamResult({ score: 85, total: 10, correct: 8, incorrect: 2 });
            setCurrentScreen('exam-results');
          }}
        >
          1.12
        </button>
        <button 
          className={currentScreen === 'ai-assistant' ? 'active' : ''}
          onClick={() => setCurrentScreen('ai-assistant')}
        >
          1.13
        </button>
        <button 
          className={currentScreen === 'ai-history' ? 'active' : ''}
          onClick={() => setCurrentScreen('ai-history')}
        >
          1.14
        </button>
        <button 
          className={currentScreen === 'profile' ? 'active' : ''}
          onClick={() => setCurrentScreen('profile')}
        >
          1.15
        </button>
        <button 
          className={currentScreen === 'offline' ? 'active' : ''}
          onClick={() => setCurrentScreen('offline')}
        >
          1.16
        </button>
      </div>
    </>
  );
};

export default AcademixScreens;