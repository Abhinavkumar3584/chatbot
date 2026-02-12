import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown, Search, Menu, FileText, Send } from 'lucide-react'
import apiService from '../services/api'
import { useLayout } from '../contexts/LayoutContext'
import PropTypes from 'prop-types'

const EmbeddedSearchBar = ({ onSendMessage, isLoading }) => {
  const { isMobile, toggleSidebar, togglePyq } = useLayout()
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [showDropdown, setShowDropdown] = useState(false)
  const [availableClasses, setAvailableClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('All Classes')
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true)
  const [isLoadingClasses, setIsLoadingClasses] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [answerLengthIndex, setAnswerLengthIndex] = useState(2)
  const subjectDropdownRef = useRef(null)
  const classDropdownRef = useRef(null)
  const textareaRef = useRef(null)

  const answerLengthModes = [
    { value: 'very_short', label: 'Very Short' },
    { value: 'short', label: 'Short' },
    { value: 'normal', label: 'Normal' },
    { value: 'explanatory', label: 'Explanatory' }
  ]

  // Load available subjects from Pinecone
  const loadAvailableSubjects = async () => {
    setIsLoadingSubjects(true)
    try {
      console.log('🔍 EmbeddedSearchBar: Loading available subjects...')
      const response = await apiService.getBooks()
      console.log('📚 EmbeddedSearchBar: Books response:', response)
      
      const indexedBooks = response.filter(book => book.total_chunks > 0)
      console.log('✅ EmbeddedSearchBar: Indexed books:', indexedBooks)
      
      // Create subject list with indexed subjects only
      const subjects = ['All Subjects'] // Always include "All Subjects"
      indexedBooks.forEach(book => {
        // Extract subject name from title (e.g., "NCERT Geography" -> "Geography")
        const subjectName = book.title.replace('NCERT ', '')
        if (!subjects.includes(subjectName)) {
          subjects.push(subjectName)
        }
      })
      
      console.log('🎯 EmbeddedSearchBar: Final subjects list:', subjects)
      setAvailableSubjects(subjects)
    } catch (error) {
      console.error('❌ EmbeddedSearchBar: Failed to load available subjects:', error)
      // Fallback to show only "All Subjects" if API fails
      setAvailableSubjects(['All Subjects'])
    } finally {
      setIsLoadingSubjects(false)
    }
  }

  // Load class options for class-specific retrieval
  const loadClassOptions = async () => {
    setIsLoadingClasses(true)
    try {
      const response = await apiService.getClassOptions()
      const classList = Array.isArray(response?.classes) ? response.classes : []
      const classes = ['All Classes', ...classList.map((item) => item.label)]
      setAvailableClasses(classes)
    } catch (error) {
      console.error('❌ EmbeddedSearchBar: Failed to load class options:', error)
      setAvailableClasses(['All Classes'])
    } finally {
      setIsLoadingClasses(false)
    }
  }

  // Load subjects on component mount
  useEffect(() => {
    loadAvailableSubjects()
    loadClassOptions()
  }, [])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (classDropdownRef.current && !classDropdownRef.current.contains(event.target)) {
        setShowClassDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject)
    setShowDropdown(false)
  }

  const handleClassSelect = (selectedClassLabel) => {
    setSelectedClass(selectedClassLabel)
    setShowClassDropdown(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const query = inputValue.trim()
    if (!query || isLoading) return
    
    // Convert subject name to the format expected by the API
    let subjectId = 'all'
    if (selectedSubject !== 'All Subjects') {
      subjectId = selectedSubject.toLowerCase()
    }
    
    let selectedClassValue = null
    if (selectedClass !== 'All Classes') {
      const classNumMatch = selectedClass.match(/(6|7|8|9|10|11|12)/)
      if (classNumMatch) {
        selectedClassValue = `class-${classNumMatch[1]}`
      }
    }

    const answerLength = answerLengthModes[answerLengthIndex]?.value || 'normal'

    onSendMessage(query, {
      subject: subjectId,
      selectedClass: selectedClassValue,
      answerLength
    })
    setInputValue('')
    requestAnimationFrame(adjustTextareaHeight)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const adjustTextareaHeight = useCallback(() => {
    if (!textareaRef.current) return
    const el = textareaRef.current
    el.style.height = 'auto'
    const viewportLimit = window.innerHeight * 0.3
    const maxHeight = isMobile ? viewportLimit : Math.min(viewportLimit, 180)
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [isMobile])

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue, adjustTextareaHeight])

  return (
    <div className="w-full max-w-none mx-auto px-2">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl shadow-sm p-1.5"
        style={{
          backgroundColor: '#FFFFFF',
          border: isMobile ? 'none' : '1px solid #E3E7ED'
        }}
      >
        <div className="px-2 pb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium" style={{ color: '#52616B' }}>Answer Length</span>
            <span className="text-[11px] font-semibold" style={{ color: '#3A7CA5' }}>
              {answerLengthModes[answerLengthIndex]?.label}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={answerLengthModes.length - 1}
            step={1}
            value={answerLengthIndex}
            onChange={(e) => setAnswerLengthIndex(Number(e.target.value))}
            className="w-full"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between mt-1">
            {answerLengthModes.map((mode, idx) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => setAnswerLengthIndex(idx)}
                className="text-[10px] px-1 py-0.5 rounded"
                style={{
                  color: answerLengthIndex === idx ? '#1F2933' : '#6B7280',
                  fontWeight: answerLengthIndex === idx ? 600 : 400,
                  backgroundColor: answerLengthIndex === idx ? 'rgba(58, 124, 165, 0.12)' : 'transparent'
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {!isMobile ? (
          <div className="flex items-center space-x-1.5">
            {/* Subject Dropdown */}
            <div className="relative flex-shrink-0" ref={subjectDropdownRef}>
            <button 
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center justify-between space-x-1 px-2 py-1.5 rounded-md text-xs hover:opacity-90 transition-opacity min-w-[64px] max-w-[120px]"
              style={{ 
                backgroundColor: '#3A7CA5', 
                color: '#FFFFFF' 
              }}
              disabled={isLoadingSubjects}
            >
              <span className="whitespace-nowrap truncate text-xs">
                {isLoadingSubjects ? 'Loading...' : 
                 selectedSubject === 'All Subjects' ? 'All' : 
                 selectedSubject.length > 8 ? selectedSubject.substring(0, 8) + '...' : 
                 selectedSubject}
              </span>
              <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${
                showDropdown ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && !isLoadingSubjects && (
              <div className="absolute bottom-full left-0 mb-1 w-40 rounded-md shadow-lg z-[60]" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E7ED' }}>
                <div className="py-1">
                  {availableSubjects.map((subject, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSubjectSelect(subject)}
                      className="w-full text-left px-2 py-1.5 text-xs transition-colors"
                      style={{
                        backgroundColor: selectedSubject === subject ? 'rgba(58, 124, 165, 0.12)' : 'transparent',
                        color: '#1F2933',
                        fontWeight: selectedSubject === subject ? '600' : '400'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedSubject !== subject) {
                          e.currentTarget.style.backgroundColor = 'rgba(58, 124, 165, 0.08)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSubject !== subject) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{subject}</span>
                        {subject !== 'All Subjects' && (
                          <span className="text-xs font-medium" style={{ color: '#3A7CA5' }}>✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Footer info */}
                <div className="px-2 py-1" style={{ borderTop: '1px solid #E3E7ED' }}>
                  <div className="text-xs" style={{ color: '#52616B' }}>
                    {availableSubjects.length - 1} indexed subjects
                  </div>
                </div>
              </div>
            )}
          </div>

            {/* Class Dropdown */}
            <div className="relative flex-shrink-0" ref={classDropdownRef}>
              <button
                type="button"
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className="flex items-center justify-between space-x-1 px-2 py-1.5 rounded-md text-xs hover:opacity-90 transition-opacity min-w-[78px] max-w-[110px]"
                style={{
                  backgroundColor: '#0E7490',
                  color: '#FFFFFF'
                }}
                disabled={isLoadingClasses}
              >
                <span className="whitespace-nowrap truncate text-xs">
                  {isLoadingClasses ? 'Loading...' : selectedClass === 'All Classes' ? 'Class' : selectedClass.replace('Class ', 'C-')}
                </span>
                <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${
                  showClassDropdown ? 'rotate-180' : ''
                }`} />
              </button>

              {showClassDropdown && !isLoadingClasses && (
                <div className="absolute bottom-full left-0 mb-1 w-36 rounded-md shadow-lg z-[60]" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E7ED' }}>
                  <div className="py-1">
                    {availableClasses.map((classLabel, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleClassSelect(classLabel)}
                        className="w-full text-left px-2 py-1.5 text-xs transition-colors"
                        style={{
                          backgroundColor: selectedClass === classLabel ? 'rgba(14, 116, 144, 0.14)' : 'transparent',
                          color: '#1F2933',
                          fontWeight: selectedClass === classLabel ? '600' : '400'
                        }}
                      >
                        {classLabel}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Input - Takes remaining space */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  requestAnimationFrame(adjustTextareaHeight)
                }}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question..."
                className="w-full px-2 py-1.5 text-xs rounded-md focus:outline-none focus:ring-1 focus:border-transparent resize-none"
                style={{
                  backgroundColor: '#FAFBFC',
                  border: '1px solid #E3E7ED',
                  color: '#1F2933',
                  caretColor: '#3A7CA5',
                  minHeight: 32,
                  maxHeight: '180px',
                  transition: 'height 0.12s ease-out'
                }}
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            {/* Search Button - Compact (Desktop/Tablet) */}
            <button 
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="flex-shrink-0 p-1.5 rounded-md transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: '#3A7CA5',
                color: '#FFFFFF'
              }}
            >
              <Search className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Top row: input */}
            <div className="w-full">
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  requestAnimationFrame(adjustTextareaHeight)
                }}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question..."
                className="w-full px-2 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:border-transparent resize-none placeholder:text-gray-400"
                style={{
                  backgroundColor: '#FAFBFC',
                  border: 'none',
                  color: '#1F2933',
                  caretColor: '#3A7CA5',
                  minHeight: 40,
                  maxHeight: '30vh',
                  transition: 'height 0.12s ease-out'
                }}
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            {/* Middle row: subject + class selectors */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1" ref={subjectDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex w-full items-center justify-between space-x-1 px-2 py-1.5 rounded-md text-xs hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: '#3A7CA5',
                    color: '#FFFFFF'
                  }}
                  disabled={isLoadingSubjects}
                >
                  <span className="whitespace-nowrap truncate text-xs">
                    {isLoadingSubjects ? 'Loading...' :
                     selectedSubject === 'All Subjects' ? 'All Subjects' :
                     selectedSubject.length > 14 ? selectedSubject.substring(0, 14) + '...' :
                     selectedSubject}
                  </span>
                  <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${
                    showDropdown ? 'rotate-180' : ''
                  }`} />
                </button>
                {showDropdown && !isLoadingSubjects && (
                  <div className="absolute bottom-full left-0 mb-1 w-40 rounded-md shadow-lg z-[60]" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E7ED' }}>
                    <div className="py-1">
                      {availableSubjects.map((subject, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSubjectSelect(subject)}
                          className="w-full text-left px-2 py-1.5 text-xs transition-colors"
                          style={{
                            backgroundColor: selectedSubject === subject ? 'rgba(58, 124, 165, 0.12)' : 'transparent',
                            color: '#1F2933',
                            fontWeight: selectedSubject === subject ? '600' : '400'
                          }}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative w-[42%]" ref={classDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowClassDropdown(!showClassDropdown)}
                  className="flex w-full items-center justify-between space-x-1 px-2 py-1.5 rounded-md text-xs hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: '#0E7490',
                    color: '#FFFFFF'
                  }}
                  disabled={isLoadingClasses}
                >
                  <span className="whitespace-nowrap truncate text-xs">
                    {isLoadingClasses ? 'Loading...' : selectedClass}
                  </span>
                  <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${
                    showClassDropdown ? 'rotate-180' : ''
                  }`} />
                </button>
                {showClassDropdown && !isLoadingClasses && (
                  <div className="absolute bottom-full right-0 mb-1 w-36 rounded-md shadow-lg z-[60]" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E7ED' }}>
                    <div className="py-1">
                      {availableClasses.map((classLabel, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleClassSelect(classLabel)}
                          className="w-full text-left px-2 py-1.5 text-xs transition-colors"
                          style={{
                            backgroundColor: selectedClass === classLabel ? 'rgba(14, 116, 144, 0.14)' : 'transparent',
                            color: '#1F2933',
                            fontWeight: selectedClass === classLabel ? '600' : '400'
                          }}
                        >
                          {classLabel}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom row: actions */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={toggleSidebar}
                className="flex-shrink-0 p-2 rounded-md transition-colors"
                style={{ backgroundColor: '#F6F7F9', border: '1px solid #E3E7ED', color: '#1F2933' }}
                aria-label="Open sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={togglePyq}
                className="flex-shrink-0 p-2 rounded-md transition-colors"
                style={{ backgroundColor: '#F6F7F9', border: '1px solid #E3E7ED', color: '#1F2933' }}
                aria-label="Open PYQ"
              >
                <FileText className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="flex-shrink-0 p-2 rounded-md transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#3A7CA5', color: '#FFFFFF' }}
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default EmbeddedSearchBar

EmbeddedSearchBar.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
}
