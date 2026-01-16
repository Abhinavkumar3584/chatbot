import React, { useState, useEffect, useMemo } from 'react'
import { ChevronDown, FileText, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Box, Paper, Stack, Typography, IconButton, Chip, Divider, Button, Menu, MenuItem } from '@mui/material'
import { useLayout } from '../contexts/LayoutContext'
import { useDashboard } from '../contexts/DashboardContext'
import apiService from '../services/api'
import { ChevronFirst } from './icons/ChevronFirst'

const PYQSection = () => {
  const { pyqVisible, togglePyq } = useLayout()
  const { trackInteraction } = useDashboard()
  const [searchResults, setSearchResults] = useState([])
  const [lastSearchQuery, setLastSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [selectedExam, setSelectedExam] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [showImportantOnly, setShowImportantOnly] = useState(false) // Filter for important questions only
  const [examAnchorEl, setExamAnchorEl] = useState(null)
  const [subjectAnchorEl, setSubjectAnchorEl] = useState(null)
  const [filteredQuestions, setFilteredQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState({}) // Track user selections for each question
  const [expandedExplanations, setExpandedExplanations] = useState({}) // Track expanded explanations
  const [importantQuestions, setImportantQuestions] = useState(new Set()) // Track important/bookmarked questions

  const isExamMenuOpen = Boolean(examAnchorEl)
  const isSubjectMenuOpen = Boolean(subjectAnchorEl)

  // Load available exams and subjects from current search results only
  const [availableExams, setAvailableExams] = useState([])
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [loadingFilters, setLoadingFilters] = useState(false)
  
  // Dynamic exam and subject lists from search results only
  const exams = [
    { id: 'all', name: 'All Exams' },
    ...availableExams.map(exam => ({ id: exam.toLowerCase(), name: exam }))
  ]

  const subjects = [
    { id: 'all', name: 'All Subjects' },
    ...availableSubjects.map(subject => ({ id: subject.toLowerCase(), name: subject }))
  ]

  // Extract unique exams and subjects from search results
  const extractFiltersFromResults = (questions) => {
    const uniqueExams = new Set()
    const uniqueSubjects = new Set()
    
    questions.forEach(question => {
      // Extract exam name
      const examName = question.metadata?.exam_name || question.metadata?.exam || question.exam_name || ''
      if (examName && examName.trim()) {
        uniqueExams.add(examName.trim())
      }
      
      // Extract subject
      const subject = question.metadata?.subject || question.subject || ''
      if (subject && subject.trim()) {
        uniqueSubjects.add(subject.trim())
      }
    })
    
    return {
      exams: Array.from(uniqueExams).sort(),
      subjects: Array.from(uniqueSubjects).sort()
    }
  }

  // Load filter options and total questions count
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Get total questions for display only
        const response = await apiService.getTotalQuestions()
        setTotalQuestions(response.total_questions || 0)
        
        console.log(`✅ Total questions in database: ${response.total_questions || 0}`)
        
      } catch (error) {
        console.error('Failed to load initial data:', error)
      }
    }
    
    loadInitialData()
  }, [])

  // Listen for MCQ results from chat searches
  useEffect(() => {
    const handleMcqResults = (event) => {
      const { mcqs, query } = event.detail
      setSearchResults(mcqs)
      setLastSearchQuery(query)
      
      // Extract filters from search results
      if (mcqs && mcqs.length > 0) {
        setLoadingFilters(true)
        const { exams, subjects } = extractFiltersFromResults(mcqs)
        setAvailableExams(exams)
        setAvailableSubjects(subjects)
        setLoadingFilters(false)
        
        console.log(`🔍 Search: "${query}" - Found ${mcqs.length} questions`)
        console.log(`📊 Available filters: ${exams.length} exams, ${subjects.length} subjects`)
        console.log(`📋 Exams: ${exams.join(', ')}`)
        console.log(`📚 Subjects: ${subjects.join(', ')}`)
      } else {
        // No results, clear filters
        setAvailableExams([])
        setAvailableSubjects([])
        setLoadingFilters(false)
      }
      
      applyFilters(mcqs)
    }

    const handleNewChat = () => {
      // Reset all PYQ state when a new chat is started
      setSearchResults([])
      setLastSearchQuery('')
      setFilteredQuestions([])
      setUserAnswers({})
      setExpandedExplanations({})
      setSelectedExam('all')
      setSelectedSubject('all')
      setShowImportantOnly(false)
      // Clear available filters since no search has been made
      setAvailableExams([])
      setAvailableSubjects([])
      setLoadingFilters(false)
      console.log('🔄 PYQ Section reset for new chat')
    }

    const handleLoadChat = () => {
      // Reset PYQ state when loading an existing chat (similar to new chat)
      setSearchResults([])
      setLastSearchQuery('')
      setFilteredQuestions([])
      setUserAnswers({})
      setExpandedExplanations({})
      setSelectedExam('all')
      setSelectedSubject('all')
      setShowImportantOnly(false)
      // Clear available filters since no search has been made
      setAvailableExams([])
      setAvailableSubjects([])
      setLoadingFilters(false)
      console.log('🔄 PYQ Section reset for loaded chat')
    }

    const handleLoadGuestChat = () => {
      // Reset PYQ state when loading a guest chat
      setSearchResults([])
      setLastSearchQuery('')
      setFilteredQuestions([])
      setUserAnswers({})
      setExpandedExplanations({})
      setSelectedExam('all')
      setSelectedSubject('all')
      setShowImportantOnly(false)
      // Clear available filters since no search has been made
      setAvailableExams([])
      setAvailableSubjects([])
      setLoadingFilters(false)
      console.log('🔄 PYQ Section reset for loaded guest chat')
    }

    window.addEventListener('newMcqResults', handleMcqResults)
    window.addEventListener('newChat', handleNewChat)
    window.addEventListener('loadChat', handleLoadChat)
    window.addEventListener('loadGuestChat', handleLoadGuestChat)
    return () => {
      window.removeEventListener('newMcqResults', handleMcqResults)
      window.removeEventListener('newChat', handleNewChat)
      window.removeEventListener('loadChat', handleLoadChat)
      window.removeEventListener('loadGuestChat', handleLoadGuestChat)
    }
  }, [])

  // Apply filters to current search results
  const applyFilters = (questions = searchResults) => {
    let filtered = [...questions]
    
    if (selectedExam !== 'all') {
      filtered = filtered.filter(q => {
        const examName = q.metadata?.exam_name || q.metadata?.exam || q.exam_name || ''
        return examName.toLowerCase() === selectedExam.toLowerCase()
      })
    }
    
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(q => {
        const subject = q.metadata?.subject || q.subject || ''
        return subject.toLowerCase() === selectedSubject.toLowerCase()
      })
    }

    // Filter for important questions only
    if (showImportantOnly) {
      filtered = filtered.filter(q => {
        const questionId = q.id || `fallback_${questions.indexOf(q)}`
        return importantQuestions.has(questionId)
      })
    }
    
    setFilteredQuestions(filtered)
  }

  // Apply filters whenever filters change for search results
  useEffect(() => {
    // Only apply filters if we have search results (from chat)
    if (searchResults.length > 0) {
      applyFilters()
    }
  }, [selectedExam, selectedSubject, showImportantOnly, searchResults, importantQuestions])

  // Function to refresh questions
  const refreshQuestions = () => {
    // This will trigger the useEffect to reload questions
    setSelectedExam(selectedExam)
  }

  // Handle option selection
  const handleOptionSelect = (questionId, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }))
    
    // Find the question to check if answer is correct
    const question = searchResults.find(q => q.id === questionId)
    if (question) {
      const isCorrect = optionIndex === question.correct_answer
      const questionSubject = question.subject || question.metadata?.subject || 'Others'
      
      // Track MCQ attempt with correct/wrong tracking
      if (isCorrect) {
        trackInteraction('mcq_correct', {
          questionId: questionId,
          subject: questionSubject,
          exam: question.exam_name || question.metadata?.exam_name || 'Unknown',
          selectedOption: optionIndex,
          correctOption: question.correct_answer
        })
      } else {
        trackInteraction('mcq_wrong', {
          questionId: questionId,
          subject: questionSubject,
          exam: question.exam_name || question.metadata?.exam_name || 'Unknown',
          selectedOption: optionIndex,
          correctOption: question.correct_answer
        })
      }
      
      console.log(`✅ MCQ ${isCorrect ? 'correct' : 'wrong'} answer tracked for subject: ${questionSubject}`)
    }
  }

  // Reset user answers when new search results come in
  useEffect(() => {
    setUserAnswers({})
    setExpandedExplanations({})
  }, [searchResults])

  // Handle explanation toggle
  const toggleExplanation = (questionId) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  // Handle important question toggle
  const toggleImportantQuestion = (questionId) => {
    setImportantQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  // Determine which questions to display based on search results or filtered API results
  const currentQuestions = searchResults.length > 0 ? filteredQuestions : filteredQuestions

  const progressStats = useMemo(() => {
    if (currentQuestions.length === 0 || Object.keys(userAnswers).length === 0) {
      return { correct: 0, wrong: 0, answered: 0 }
    }

    let correct = 0
    let wrong = 0

    currentQuestions.forEach((q, idx) => {
      const questionId = q.id || `fallback_${idx}`
      const userAnswer = userAnswers[questionId]
      const hasValidCorrectAnswer =
        q.correct_answer !== undefined &&
        Number.isInteger(q.correct_answer) &&
        q.correct_answer >= 0 &&
        q.correct_answer < (q.options?.length || 0)

      if (!hasValidCorrectAnswer || userAnswer === undefined) return

      if (userAnswer === q.correct_answer) {
        correct++
      } else {
        wrong++
      }
    })

    return {
      correct,
      wrong,
      answered: Object.keys(userAnswers).length
    }
  }, [currentQuestions, userAnswers])

  return (
    <>
      {/* Full PYQ Section */}
      {pyqVisible && (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            right: 8,
            top: 72,
            bottom: 8,
            width: 450,
            zIndex: 30,
            borderRadius: 2,
            border: '1px solid #808080',
            backgroundColor: '#ffffff',
            color: '#000000',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Toggle Button and Header */}
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <IconButton onClick={togglePyq} size="small" title="Hide PYQ Section" sx={{ color: '#000000', transform: 'scaleX(-1)' }}>
                <ChevronFirst width={15} height={15} strokeWidth={2} stroke={'#000000'} />
              </IconButton>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#000000' }}>
                  PYQs
                </Typography>
                <Typography variant="caption" sx={{ color: '#000000', opacity: 0.7 }}>
                  ({filteredQuestions.length} Questions)
                </Typography>
                {importantQuestions.size > 0 && (
                  <Chip
                    size="small"
                    icon={<Star className="w-3 h-3 fill-current" />}
                    label={`${importantQuestions.size} important`}
                    sx={{ backgroundColor: 'rgba(255, 146, 28, 0.15)', color: '#FF921C', fontSize: '0.7rem' }}
                  />
                )}
              </Stack>
            </Box>

            {/* Content Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', m: 1, mt: 0, minHeight: 0, backgroundColor: '#ffffff', borderRadius: 2 }}>
              {/* Sticky Header */}
              <Box
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  backgroundColor: '#ffffff',
                  borderBottom: '1px solid #d0d0d0',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8
                }}
              >
                <Box sx={{ p: 1.5 }}>

                  {/* Filters - Show only when we have search results with filter data */}
                  {!loadingFilters && searchResults.length > 0 && (availableExams.length > 0 || availableSubjects.length > 0) && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" sx={{ mb: 2 }}>
                      {/* Exam Filter */}
                      <Button
                        size="small"
                        variant="contained"
                        onClick={(event) => !loadingFilters && setExamAnchorEl(event.currentTarget)}
                        disabled={loadingFilters}
                        endIcon={<ChevronDown className="w-3 h-3" />}
                        sx={{ backgroundColor: '#BAFF39', color: '#000000', fontSize: '0.75rem', borderRadius: 999, '&:hover': { backgroundColor: '#B0F236' } }}
                      >
                        {loadingFilters ? 'Loading...' : (exams.find(e => e.id === selectedExam)?.name || 'All Exams')}
                      </Button>
                      <Menu
                        anchorEl={examAnchorEl}
                        open={isExamMenuOpen}
                        onClose={() => setExamAnchorEl(null)}
                        MenuListProps={{ dense: true }}
                        PaperProps={{ sx: { border: '1px solid #e0e0e0' } }}
                      >
                        {exams.map((exam) => (
                          <MenuItem
                            key={exam.id}
                            selected={selectedExam === exam.id}
                            onClick={() => {
                              setSelectedExam(exam.id)
                              setExamAnchorEl(null)
                            }}
                            sx={{ fontSize: '0.75rem' }}
                          >
                            {exam.name}
                          </MenuItem>
                        ))}
                      </Menu>

                      {/* Subject Filter */}
                      <Button
                        size="small"
                        variant="contained"
                        onClick={(event) => !loadingFilters && setSubjectAnchorEl(event.currentTarget)}
                        disabled={loadingFilters}
                        endIcon={<ChevronDown className="w-3 h-3" />}
                        sx={{ backgroundColor: '#BAFF39', color: '#000000', fontSize: '0.75rem', borderRadius: 999, '&:hover': { backgroundColor: '#B0F236' } }}
                      >
                        {loadingFilters ? 'Loading...' : (subjects.find(s => s.id === selectedSubject)?.name || 'All Subjects')}
                      </Button>
                      <Menu
                        anchorEl={subjectAnchorEl}
                        open={isSubjectMenuOpen}
                        onClose={() => setSubjectAnchorEl(null)}
                        MenuListProps={{ dense: true }}
                        PaperProps={{ sx: { border: '1px solid #e0e0e0' } }}
                      >
                        {subjects.map((subject) => (
                          <MenuItem
                            key={subject.id}
                            selected={selectedSubject === subject.id}
                            onClick={() => {
                              setSelectedSubject(subject.id)
                              setSubjectAnchorEl(null)
                            }}
                            sx={{ fontSize: '0.75rem' }}
                          >
                            {subject.name}
                          </MenuItem>
                        ))}
                      </Menu>

                      {/* Important Questions Filter */}
                      <Button
                        size="small"
                        variant={showImportantOnly ? 'contained' : 'outlined'}
                        onClick={() => setShowImportantOnly(!showImportantOnly)}
                        startIcon={<Star className={`w-3 h-3 ${showImportantOnly ? 'fill-current' : ''}`} />}
                        title={showImportantOnly ? 'Show all questions' : 'Show only important questions'}
                        sx={{
                          fontSize: '0.75rem',
                          borderRadius: 999,
                          backgroundColor: showImportantOnly ? '#f59e0b' : '#e5e7eb',
                          color: showImportantOnly ? '#ffffff' : '#374151',
                          borderColor: showImportantOnly ? '#f59e0b' : '#e5e7eb',
                          '&:hover': { backgroundColor: showImportantOnly ? '#d97706' : '#d1d5db' }
                        }}
                      >
                        {showImportantOnly ? 'Important' : 'All'}
                      </Button>
                    </Stack>
                  )}

                  {/* Progress */}
                  {filteredQuestions.length > 0 && Object.keys(userAnswers).length > 0 && (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap' }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#000000' }}>
                        Progress:
                      </Typography>
                      <Chip
                        size="small"
                        label={`${progressStats.correct} Correct`}
                        sx={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#16a34a', fontSize: '0.7rem' }}
                      />
                      <Chip
                        size="small"
                        label={`${progressStats.wrong} Wrong`}
                        sx={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#dc2626', fontSize: '0.7rem' }}
                      />
                      <Chip
                        size="small"
                        label={`${progressStats.answered}/${currentQuestions.length} Answered`}
                        sx={{ backgroundColor: 'rgba(0,0,0,0.06)', color: '#000000', fontSize: '0.7rem' }}
                      />
                    </Stack>
                  )}
                </Box>
              </Box>

              {/* Scrollable Content */}
              <Box className="pyq-content" sx={{ flex: 1, overflowY: 'auto', p: 1, minHeight: 0 }}>
                {/* Questions */}
                <Stack spacing={2}>
                  {!lastSearchQuery && currentQuestions.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <FileText className="w-12 h-12 mx-auto mb-2" style={{ color: '#000000', opacity: 0.4 }} />
                      <Typography variant="caption" sx={{ display: 'block', color: '#000000', opacity: 0.7 }}>
                        Search for topics to find relevant PYQs
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#000000', opacity: 0.5 }}>
                        Use the chat below to search for questions on any topic
                      </Typography>
                    </Box>
                  ) : lastSearchQuery && currentQuestions.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <FileText className="w-12 h-12 mx-auto mb-2" style={{ color: '#000000', opacity: 0.4 }} />
                      <Typography variant="caption" sx={{ display: 'block', color: '#000000', opacity: 0.7 }}>
                        No related questions found for "{lastSearchQuery}"
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#000000', opacity: 0.5 }}>
                        Try different keywords or remove filters
                      </Typography>
                    </Box>
                  ) : currentQuestions.length > 0 ? (
                    <Stack spacing={2}>
                      {currentQuestions.map((question, questionIndex) => {
                        // Use the unique ID from backend, fallback to index-based ID if needed
                        const questionId = question.id || `fallback_${questionIndex}`
                        const userAnswer = userAnswers[questionId]
                        const isCorrect = userAnswer === question.correct_answer
                        const hasAnswered = userAnswer !== undefined
                        
                        return (
                          <Paper
                            key={questionId}
                            elevation={0}
                            sx={{
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: hasAnswered ? (isCorrect ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)') : '#e5e7eb',
                              backgroundColor: '#ffffff',
                              overflow: 'hidden'
                            }}
                          >
                            {/* Question Header */}
                            <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#111827', flex: 1 }}>
                                  {question.question}
                                </Typography>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleImportantQuestion(questionId);
                                    }}
                                    title={importantQuestions.has(questionId) ? 'Remove from important' : 'Mark as important'}
                                    sx={{
                                      color: importantQuestions.has(questionId) ? '#f59e0b' : '#9ca3af',
                                      backgroundColor: importantQuestions.has(questionId) ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                                      '&:hover': { backgroundColor: 'rgba(245, 158, 11, 0.12)' }
                                    }}
                                  >
                                    <Star className={`w-4 h-4 ${importantQuestions.has(questionId) ? 'fill-current' : ''}`} />
                                  </IconButton>
                                  {hasAnswered && (
                                    <Chip
                                      size="small"
                                      label={isCorrect ? '✓' : '✗'}
                                      sx={{
                                        fontSize: '0.7rem',
                                        height: 20,
                                        backgroundColor: isCorrect ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                                        color: isCorrect ? '#16a34a' : '#dc2626'
                                      }}
                                    />
                                  )}
                                </Stack>
                              </Box>

                              {/* Options */}
                              <Stack spacing={1} sx={{ mt: 1 }}>
                                {question.options?.map((option, optionIndex) => {
                                  const isUserSelected = userAnswer === optionIndex
                                  const isCorrectAnswer = question.correct_answer === optionIndex

                                  let borderColor = '#e5e7eb'
                                  let backgroundColor = 'transparent'
                                  if (!hasAnswered) {
                                    backgroundColor = 'transparent'
                                  } else if (isUserSelected) {
                                    borderColor = isCorrect ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'
                                    backgroundColor = isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'
                                  } else if (isCorrectAnswer) {
                                    borderColor = 'rgba(34,197,94,0.4)'
                                    backgroundColor = 'rgba(34,197,94,0.08)'
                                  }

                                  return (
                                    <Box
                                      key={optionIndex}
                                      onClick={(e) => {
                                        if (!hasAnswered) {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleOptionSelect(questionId, optionIndex);
                                        }
                                      }}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        p: 1,
                                        borderRadius: 1,
                                        border: '1px solid',
                                        borderColor,
                                        backgroundColor,
                                        cursor: hasAnswered ? 'default' : 'pointer',
                                        transition: 'background-color 0.2s, border-color 0.2s',
                                        '&:hover': !hasAnswered ? { backgroundColor: '#f9fafb' } : undefined
                                      }}
                                    >
                                      <Box sx={{ mr: 1, mt: 0.25 }}>
                                        <Box
                                          sx={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: '50%',
                                            border: '1px solid',
                                            borderColor: isUserSelected ? '#3b82f6' : '#d1d5db',
                                            backgroundColor: isUserSelected ? '#3b82f6' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                          }}
                                        >
                                          {isUserSelected && <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ffffff' }} />}
                                        </Box>
                                      </Box>
                                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#111827', flex: 1 }}>
                                        {option}
                                      </Typography>
                                      {hasAnswered && isCorrectAnswer && !isUserSelected && (
                                        <Box sx={{ ml: 1 }}>
                                          <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#16a34a' }} />
                                          </Box>
                                        </Box>
                                      )}
                                    </Box>
                                  )
                                })}
                              </Stack>
                            </Box>

                            {/* Question Footer with Metadata */}
                            <Box sx={{ px: 2, py: 1.5, backgroundColor: '#f9fafb' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                                  {(question.exam_name || question.metadata?.exam_name || question.metadata?.exam) && (
                                    <Chip size="small" label={question.exam_name || question.metadata?.exam_name || question.metadata?.exam} sx={{ backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '0.7rem' }} />
                                  )}
                                  {(question.year || question.metadata?.year || question.metadata?.exam_year) && (
                                    <Chip size="small" label={question.year || question.metadata?.year || question.metadata?.exam_year} sx={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.7rem' }} />
                                  )}
                                  {(question.term || question.metadata?.term || question.metadata?.exam_term) && (
                                    <Chip size="small" label={question.term || question.metadata?.term || question.metadata?.exam_term} sx={{ backgroundColor: '#ede9fe', color: '#5b21b6', fontSize: '0.7rem' }} />
                                  )}
                                  {(question.subject || question.metadata?.subject) && (
                                    <Chip size="small" label={question.subject || question.metadata?.subject} sx={{ backgroundColor: '#ffedd5', color: '#9a3412', fontSize: '0.7rem' }} />
                                  )}
                                </Stack>

                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (hasAnswered) {
                                      toggleExplanation(questionId);
                                    }
                                  }}
                                  disabled={!hasAnswered}
                                  endIcon={hasAnswered ? <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${expandedExplanations[questionId] ? 'rotate-180' : ''}`} /> : null}
                                  sx={{
                                    fontSize: '0.75rem',
                                    color: hasAnswered ? '#2563eb' : '#9ca3af',
                                    '&:hover': { backgroundColor: hasAnswered ? 'rgba(37,99,235,0.08)' : 'transparent' }
                                  }}
                                >
                                  {hasAnswered
                                    ? (expandedExplanations[questionId] ? 'Hide Explanation' : 'Show Explanation')
                                    : 'Answer to view explanation'
                                  }
                                </Button>
                              </Box>

                              {expandedExplanations[questionId] && question.explanation && (
                                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#2563eb', display: 'block', mb: 1 }}>
                                    Explanation
                                  </Typography>
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      p: 1.5,
                                      borderRadius: 2,
                                      borderLeft: '4px solid #60a5fa',
                                      background: 'linear-gradient(90deg, #eff6ff 0%, #eef2ff 100%)'
                                    }}
                                  >
                                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#1f2937', lineHeight: 1.6 }}>
                                      {question.explanation}
                                    </Typography>
                                  </Paper>
                                </Box>
                              )}
                            </Box>
                          </Paper>
                        )
                      })}
                    </Stack>
                  ) : !lastSearchQuery ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <FileText className="w-12 h-12 mx-auto mb-2" style={{ color: '#9ca3af' }} />
                      <Typography variant="caption" sx={{ display: 'block', color: '#6b7280' }}>
                        Use the search bar below to find relevant PYQs
                      </Typography>
                    </Box>
                  ) : null}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Collapsed PYQ Section (Icon Bar) */}
      {!pyqVisible && (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            right: 8,
            top: 72,
            bottom: 8,
            width: 40,
            zIndex: 30,
            borderRadius: 2,
            border: '1px solid #808080',
            backgroundColor: '#ffffff',
            color: '#000000',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Toggle Button */}
          <Box sx={{ p: 0.5, display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={togglePyq} size="small" title="Show PYQ Section" sx={{ color: '#000000' }}>
              <ChevronFirst width={15} height={15} strokeWidth={2} stroke={'#000000'} />
            </IconButton>
          </Box>

          {/* Icon */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton
              onClick={togglePyq}
              size="small"
              title="Previous Year Questions"
              sx={{ color: '#000000', '&:hover': { backgroundColor: 'rgba(186, 255, 57, 0.15)' } }}
            >
              <FileText className="w-4 h-4" />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  )
}

export default PYQSection
