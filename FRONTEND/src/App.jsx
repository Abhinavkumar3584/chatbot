
import React, { useState, useEffect, Suspense, lazy } from 'react'
import { Box, Skeleton } from '@mui/material'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { LayoutProvider } from './contexts/LayoutContext'
import { SearchHistoryProvider } from './contexts/SearchHistoryContext'
import { AuthProvider } from './contexts/AuthContext'
import { DashboardProvider } from './contexts/DashboardContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import ChatSection from './components/ChatSection'

const Sidebar = lazy(() => import('./components/Sidebar'))
const PYQSection = lazy(() => import('./components/PYQSection'))
const Dashboard = lazy(() => import('./components/Dashboard'))
const PYQPractice = lazy(() => import('./components/PYQPractice'))
const QuizSection = lazy(() => import('./components/QuizSection'))
const EligibilitySection = lazy(() => import('./components/EligibilitySection'))
const SyllabusSection = lazy(() => import('./components/SyllabusSection'))
const GDTopicsSection = lazy(() => import('./components/GDTopicsSection'))

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
      className="h-screen overflow-hidden transition-colors duration-300"
      style={{ 
        backgroundColor: '#f5f5f5'
      }}
    >
      <Navbar onViewChange={handleViewChange} currentView={currentView} />
      <div className="flex flex-col md:flex-row h-full" style={{ paddingTop: 72 }}>
        <Suspense
          fallback={
            <Box sx={{ width: 240, p: 2 }}>
              <Skeleton variant="rounded" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="rounded" height={16} sx={{ mb: 1 }} />
              <Skeleton variant="rounded" height={16} sx={{ mb: 1 }} />
              <Skeleton variant="rounded" height={16} sx={{ mb: 1 }} />
              <Skeleton variant="rounded" height={16} />
            </Box>
          }
        >
          <Sidebar />
        </Suspense>
        {currentView === 'dashboard' ? (
          <Suspense
            fallback={
              <Box sx={{ flex: 1, p: 2 }}>
                <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={200} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={200} />
              </Box>
            }
          >
            <Dashboard />
          </Suspense>
        ) : currentView === 'pyq-practice' ? (
          <Suspense
            fallback={
              <Box sx={{ flex: 1, p: 2 }}>
                <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={300} />
              </Box>
            }
          >
            <PYQPractice />
          </Suspense>
        ) : currentView === 'eligibility' ? (
          <Suspense
            fallback={
              <Box sx={{ flex: 1, p: 2 }}>
                <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={300} />
              </Box>
            }
          >
            <EligibilitySection />
          </Suspense>
        ) : currentView === 'syllabus' ? (
          <Suspense
            fallback={
              <Box sx={{ flex: 1, p: 2 }}>
                <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={300} />
              </Box>
            }
          >
            <SyllabusSection />
          </Suspense>
        ) : currentView === 'quiz' ? (
          <Suspense
            fallback={
              <Box sx={{ flex: 1, p: 2 }}>
                <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={300} />
              </Box>
            }
          >
            <QuizSection />
          </Suspense>
        ) : currentView === 'gd-topics' ? (
          <Suspense
            fallback={
              <Box sx={{ flex: 1, p: 2 }}>
                <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={300} />
              </Box>
            }
          >
            <GDTopicsSection />
          </Suspense>
        ) : (
          <>
            <ChatSection />
            <Suspense
              fallback={
                <Box sx={{ width: 450, p: 2 }}>
                  <Skeleton variant="rounded" height={40} sx={{ mb: 2 }} />
                  <Skeleton variant="rounded" height={160} sx={{ mb: 2 }} />
                  <Skeleton variant="rounded" height={160} />
                </Box>
              }
            >
              <PYQSection />
            </Suspense>
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
