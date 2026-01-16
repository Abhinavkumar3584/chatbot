
import React, { useState, useEffect } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { LayoutProvider } from './contexts/LayoutContext'
import { SearchHistoryProvider } from './contexts/SearchHistoryContext'
import { AuthProvider } from './contexts/AuthContext'
import { DashboardProvider } from './contexts/DashboardContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ChatSection from './components/ChatSection'
import PYQSection from './components/PYQSection'
import Dashboard from './components/Dashboard'
import PYQPractice from './components/PYQPractice'
import QuizSection from './components/QuizSection'
import EligibilitySection from './components/EligibilitySection'
import SyllabusSection from './components/SyllabusSection'
import GDTopicsSection from './components/GDTopicsSection'

const muiTheme = createTheme({
  palette: {
    primary: { main: '#BAFF39' },
    text: { primary: '#000000' },
    background: { default: '#f5f5f5', paper: '#ffffff' }
  },
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    button: { textTransform: 'none', fontWeight: 600 }
  },
  shape: { borderRadius: 8 }
})

function AppContent() {
  const [currentView, setCurrentView] = useState('chat') // 'chat', 'dashboard', 'pyq-practice', 'eligibility', 'syllabus', 'quiz', 'gd-topics'
  const { theme } = useTheme()

  // Function to handle view changes
  const handleViewChange = (view) => {
    setCurrentView(view)
  }

  // Listen for events from sidebar
  useEffect(() => {
    const handleSwitchToPyqPractice = () => {
      setCurrentView('pyq-practice')
    }

    const handleSwitchToEligibility = () => {
      setCurrentView('eligibility')
    }

    const handleSwitchToSyllabus = () => {
      setCurrentView('syllabus')
    }

    const handleSwitchToQuiz = () => {
      setCurrentView('quiz')
    }

    const handleSwitchToGDTopics = () => {
      setCurrentView('gd-topics')
    }

    window.addEventListener('switchToPyqPractice', handleSwitchToPyqPractice)
    window.addEventListener('switchToEligibility', handleSwitchToEligibility)
    window.addEventListener('switchToSyllabus', handleSwitchToSyllabus)
    window.addEventListener('switchToQuiz', handleSwitchToQuiz)
    window.addEventListener('switchToGDTopics', handleSwitchToGDTopics)
    
    return () => {
      window.removeEventListener('switchToPyqPractice', handleSwitchToPyqPractice)
      window.removeEventListener('switchToEligibility', handleSwitchToEligibility)
      window.removeEventListener('switchToSyllabus', handleSwitchToSyllabus)
      window.removeEventListener('switchToQuiz', handleSwitchToQuiz)
      window.removeEventListener('switchToGDTopics', handleSwitchToGDTopics)
    }
  }, [])

  return (
    <div 
      className="h-screen overflow-hidden transition-colors duration-300 -mb-3"
      style={{ 
        backgroundColor: '#f5f5f5'
      }}
    >
      <Navbar onViewChange={handleViewChange} currentView={currentView} />
      <div className="flex flex-col md:flex-row pt-16 h-full">
        <Sidebar />
        {currentView === 'dashboard' ? (
          <Dashboard />
        ) : currentView === 'pyq-practice' ? (
          <PYQPractice />
        ) : currentView === 'eligibility' ? (
          <EligibilitySection />
        ) : currentView === 'syllabus' ? (
          <SyllabusSection />
        ) : currentView === 'quiz' ? (
          <QuizSection />
        ) : currentView === 'gd-topics' ? (
          <GDTopicsSection />
        ) : (
          <>
            <ChatSection />
            <PYQSection />
          </>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <LayoutProvider>
            <SearchHistoryProvider>
              <DashboardProvider>
                <MuiThemeProvider theme={muiTheme}>
                  <AppContent />
                </MuiThemeProvider>
              </DashboardProvider>
            </SearchHistoryProvider>
          </LayoutProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
