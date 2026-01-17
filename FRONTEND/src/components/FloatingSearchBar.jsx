import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useLayout } from '../contexts/LayoutContext'
import apiService from '../services/api'

const FloatingSearchBar = () => {
  const { theme } = useTheme()
  const { pyqVisible } = useLayout()
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef(null)

  // Load available subjects from Pinecone
  const loadAvailableSubjects = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 FloatingSearchBar: Loading available subjects...')
      const response = await apiService.getBooks()
      console.log('📚 FloatingSearchBar: Books response:', response)
      
      const indexedBooks = response.filter(book => book.total_chunks > 0)
      console.log('✅ FloatingSearchBar: Indexed books:', indexedBooks)
      
      // Create subject list with indexed subjects only
      const subjects = ['All Subjects'] // Always include "All Subjects"
      indexedBooks.forEach(book => {
        // Extract subject name from title (e.g., "NCERT Geography" -> "Geography")
        const subjectName = book.title.replace('NCERT ', '')
        if (!subjects.includes(subjectName)) {
          subjects.push(subjectName)
        }
      })
      
      console.log('🎯 FloatingSearchBar: Final subjects list:', subjects)
      setAvailableSubjects(subjects)
    } catch (error) {
      console.error('❌ FloatingSearchBar: Failed to load available subjects:', error)
      // Fallback to show only "All Subjects" if API fails
      setAvailableSubjects(['All Subjects'])
    } finally {
      setIsLoading(false)
    }
  }

  // Load subjects on component mount
  useEffect(() => {
    loadAvailableSubjects()
  }, [])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
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

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 px-4">
      <div className="rounded-lg shadow-lg p-3 w-full max-w-xs sm:max-w-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E7ED' }}>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          {/* Subject Dropdown */}
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center justify-between w-full sm:w-auto space-x-2 px-3 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
              style={{ 
                backgroundColor: '#3A7CA5', 
                color: '#FFFFFF' 
              }}
              disabled={isLoading}
            >
              <span className="whitespace-nowrap">
                {isLoading ? 'Loading...' : selectedSubject}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                showDropdown ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && !isLoading && (
              <div className="absolute top-full left-0 mt-1 w-full min-w-[140px] rounded-lg shadow-lg z-50" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E7ED' }}>
                <div className="py-1">
                  {availableSubjects.map((subject, index) => (
                    <button
                      key={index}
                      onClick={() => handleSubjectSelect(subject)}
                      className="w-full text-left px-3 py-2 text-sm transition-colors"
                      style={{ 
                        color: '#1F2933',
                        backgroundColor: selectedSubject === subject ? 'rgba(58, 124, 165, 0.08)' : 'transparent',
                        fontWeight: selectedSubject === subject ? '600' : 'normal'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(58, 124, 165, 0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedSubject === subject ? 'rgba(58, 124, 165, 0.08)' : 'transparent'}
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
                <div className="px-3 py-2" style={{ borderTop: '1px solid #E3E7ED' }}>
                  <div className="text-xs" style={{ color: '#52616B' }}>
                    {availableSubjects.length - 1} indexed subjects
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="flex-1 relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search Question..."
              className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{
                backgroundColor: '#FAFBFC',
                color: '#1F2933',
                border: '1px solid #E3E7ED',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid #3A7CA5'
                e.target.style.boxShadow = '0 0 0 2px rgba(58, 124, 165, 0.15)'
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid #E3E7ED'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Search Button */}
          <button 
            className="w-full sm:w-auto p-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: '#3A7CA5',
              color: '#FFFFFF'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#2F6B8E'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#3A7CA5'
            }}
          >
            <Search className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default FloatingSearchBar
