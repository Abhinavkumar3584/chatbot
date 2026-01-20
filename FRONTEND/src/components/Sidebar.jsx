import { useState, useEffect, useCallback, lazy, Suspense, useMemo } from 'react'
import { MessageCircle, Search, BookOpen, FileText, Lightbulb, Trash2, Clock, Target, CheckCircle, PenTool, MessagesSquare } from 'lucide-react'
import { Box, Paper, Stack, Typography, Button, IconButton, Divider } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useLayout } from '../contexts/LayoutContext'
import { useSearchHistory } from '../contexts/SearchHistoryContext'
import { useAuth } from '../contexts/AuthContext'
const HelpSupportModal = lazy(() => import('./HelpSupportModal'))
const WhatsNewModal = lazy(() => import('./WhatsNewModal'))
import apiService from '../services/api'
import { ChevronFirst } from './icons/ChevronFirst'
import { CircleHelp } from './icons/CircleHelp'
import { Network } from './icons/Network'

const Sidebar = () => {
  const { sidebarVisible, toggleSidebar, isMobile } = useLayout()
  const { guestChatHistory, deleteGuestChat } = useSearchHistory()
  const { currentUser, getChatHistory, createNewChat, deleteChat } = useAuth()
  const [books, setBooks] = useState([])
  const [insertedPyqs, setInsertedPyqs] = useState([])
  const [chatHistory, setChatHistory] = useState([])
  const [showBooksModal, setShowBooksModal] = useState(false)
  const [showPyqsModal, setShowPyqsModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false)
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)
  const [comingSoonFeature, setComingSoonFeature] = useState('')
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)
  const [isLoadingPyqs, setIsLoadingPyqs] = useState(false)
  const [isLoadingChats, setIsLoadingChats] = useState(false)
  const [chatError, setChatError] = useState('')

  // Load chat history
  const loadChatHistory = useCallback(async () => {
    if (!currentUser) {
      console.log('❌ No currentUser, skipping chat history load')
      return
    }
    
    console.log('📂 Loading chat history for user:', currentUser.uid)
    setIsLoadingChats(true)
    setChatError('')
    try {
      const chats = await getChatHistory()
      console.log('✅ Loaded chats:', chats.length, chats)
      setChatHistory(chats)
    } catch (error) {
      console.error('❌ Failed to load chat history:', error)
      setChatError('Failed to load chat history')
    } finally {
      setIsLoadingChats(false)
    }
  }, [currentUser, getChatHistory])

  // Handle new chat creation
  const handleNewChat = async () => {
    console.log('🆕 New chat button clicked')
    try {
      if (currentUser) {
        // Instantly create a new chat in Firebase with placeholder title
        const chatId = await createNewChat('New Chat')
        await loadChatHistory() // Refresh sidebar
        window.dispatchEvent(new CustomEvent('newChat', { detail: { chatId } }))
        console.log('✅ Created and dispatched newChat event for authenticated user, chatId:', chatId)
      } else {
        // For guests, create a new guest chat session
        const guestChatId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        window.dispatchEvent(new CustomEvent('newChat', { detail: { chatId: guestChatId } }))
        console.log('✅ Dispatched newChat event for guest user with ID:', guestChatId)
      }
    } catch (error) {
      console.error('❌ Failed to create new chat:', error)
    }
  }

  // Handle chat selection
  const handleChatSelect = (chat) => {
    console.log('💬 Chat selected:', chat.title, 'chatId:', chat.id)
    // For guest chats, we need to load messages from the stored chat data
    if (chat.id.startsWith('guest-')) {
      // Load guest chat messages directly
      console.log('👤 Loading guest chat:', chat.id)
      window.dispatchEvent(new CustomEvent('loadGuestChat', { 
        detail: { 
          chatId: chat.id, 
          title: chat.title, 
          messages: chat.messages || [] 
        } 
      }))
    } else {
      // Emit event to load authenticated user chat messages from backend
      console.log('👤 Loading authenticated user chat:', chat.id)
      window.dispatchEvent(new CustomEvent('loadChat', { detail: { chatId: chat.id, title: chat.title } }))
    }
  }

  // Handle chat deletion
  const handleDeleteChat = async (chatId, event) => {
    event.stopPropagation() // Prevent triggering chat selection
    
    // Show confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')
    if (!confirmDelete) return
    
    if (chatId.startsWith('guest-')) {
      deleteGuestChat(chatId)
      console.log('🗑️ Deleted guest chat:', chatId)
    } else {
      // For authenticated users, delete from Firebase
      try {
        await deleteChat(chatId)
        console.log('🗑️ Deleted user chat from Firebase:', chatId)
        // Refresh the chat list
        await loadChatHistory()
      } catch (error) {
        console.error('❌ Failed to delete chat:', error)
        setChatError('Failed to delete chat')
        return
      }
    }
    
    // If the deleted chat was currently active, clear the chat section
    window.dispatchEvent(new CustomEvent('chatDeleted', { detail: { chatId } }))
  }

  // Format chat title from first message
  const formatChatTitle = useCallback((chat) => {
    // If chat has a custom title that's not "New Chat", use it
    if (chat.title && chat.title !== 'New Chat') {
      return chat.title
    }
    
    // Otherwise, use first 50 characters of the first message
    if (chat.firstMessage) {
      return chat.firstMessage.length > 50 
        ? chat.firstMessage.substring(0, 50) + '...' 
        : chat.firstMessage
    }
    
    // Fallback
    return 'Untitled Chat'
  }, [])

  const guestChats = useMemo(() => guestChatHistory || [], [guestChatHistory])
  const userChats = useMemo(() => chatHistory || [], [chatHistory])

  const loadBooks = useCallback(async () => {
    setIsLoadingBooks(true)
    try {
      const books = await apiService.getBooks()
      setBooks(books || [])
    } catch (error) {
      console.error('Failed to load books:', error)
    } finally {
      setIsLoadingBooks(false)
    }
  }, [])

  const loadInsertedPyqs = useCallback(async () => {
    setIsLoadingPyqs(true)
    try {
      const pyqs = await apiService.getInsertedPyqs()
      setInsertedPyqs(pyqs || [])
    } catch (error) {
      console.error('Failed to load inserted PYQs:', error)
    } finally {
      setIsLoadingPyqs(false)
    }
  }, [])

  const handleBooksClick = useCallback(() => {
    setShowBooksModal(true)
    loadBooks()
  }, [loadBooks])

  const handlePyqsClick = useCallback(() => {
    setShowPyqsModal(true)
    loadInsertedPyqs()
  }, [loadInsertedPyqs])

  const handleHelpClick = () => {
    setShowHelpModal(true)
  }

  const handleWhatsNewClick = () => {
    setShowWhatsNewModal(true)
  }

  const handlePyqPracticeClick = () => {
    // Emit event to switch to PYQ practice view
    window.dispatchEvent(new CustomEvent('switchToPyqPractice'))
  }

  const handleEligibilityClick = () => {
    // Show coming soon modal
    setComingSoonFeature('Check Eligibility')
    setShowComingSoonModal(true)
  }

  const handleSyllabusClick = () => {
    // Show coming soon modal
    setComingSoonFeature('Exam Syllabus')
    setShowComingSoonModal(true)
  }

  const handleQuizClick = () => {
    // Emit event to switch to quiz view
    window.dispatchEvent(new CustomEvent('switchToQuiz'))
  }

  const handleGDTopicsClick = () => {
    // Show coming soon modal
    setComingSoonFeature('AI for GD Topics')
    setShowComingSoonModal(true)
  }

  // Load books and inserted PYQs on component mount
  useEffect(() => {
    loadBooks()
    loadInsertedPyqs()
  }, [loadBooks, loadInsertedPyqs])

  // Load chat history when user changes
  useEffect(() => {
    if (currentUser) {
      console.log('👤 User changed, loading chat history for:', currentUser.email)
      loadChatHistory()
    } else {
      console.log('👤 No user, clearing chat history')
      setChatHistory([])
    }
  }, [currentUser, loadChatHistory])

  // Listen for refresh chat list events
  useEffect(() => {
    const handleRefreshChatList = () => {
      if (currentUser) {
        loadChatHistory()
      }
    }

    window.addEventListener('refreshChatList', handleRefreshChatList)
    
    return () => {
      window.removeEventListener('refreshChatList', handleRefreshChatList)
    }
  }, [currentUser, loadChatHistory])

  return (
    <>
      {sidebarVisible && isMobile && (
        <div
          className="md:hidden fixed top-14 left-0 right-0 bottom-0 bg-black/40 backdrop-blur-sm z-[150]"
          onClick={toggleSidebar}
        />
      )}
      {/* Full Sidebar */}
      {sidebarVisible && (
       <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            left: isMobile ? 0 : 8,
            top: isMobile ? 56 : 72,
            bottom: isMobile ? 0 : 8,
            width: isMobile ? '85vw' : { xs: 220, sm: 240, md: 260 },
            zIndex: isMobile ? 160 : 30,
            borderRadius: isMobile ? 0 : 1,
            border: '1px solid #808080',
            backgroundColor: '#ffffff',
            color: '#000000',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Toggle Button and Sign-in Notice */}
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              {!currentUser ? (
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    color: 'text.primary',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  Sign in to sync your conversations
                </Typography>
              ) : (
                <Box />
              )}
              <IconButton onClick={toggleSidebar} size="small" title="Hide Sidebar" sx={{ color: '#000000' }}>
                <ChevronFirst width={15} height={15} strokeWidth={2} stroke={'#000000'} />
              </IconButton>
            </Box>

            {/* Top section - New Chat */}
            <Box sx={{ px: 2, pb: 2 }}>
              <Button
                onClick={handleNewChat}
                fullWidth
                variant="contained"
                title="Start a new conversation"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  py: 1,
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <animated-icons
                    src="https://animatedicons.co/get-icon?name=plus&style=minimalistic&token=3a3309ff-41ae-42ce-97d0-5767a4421b43"
                    trigger="loop-on-hover"
                    attributes='{"variationThumbColour":"#536DFE","variationName":"Two Tone","variationNumber":2,"numberOfGroups":2,"backgroundIsGroup":false,"strokeWidth":4,"defaultColours":{"group-1":"#000000","group-2":"#000000FF","background":"#FFFFFF00"}}'
                    height="20"
                    width="20"
                  ></animated-icons>
                  <span>New Chat</span>
                </Box>
              </Button>
            </Box>

            {/* Chat History Section - Scrollable */}
            <div className="flex-1 overflow-y-auto px-2 pb-2 sidebar-chat-history">
              <div className="space-y-1">
                {/* Show guest chats if not authenticated or no user chats */}
                {!currentUser && guestChats.length === 0 ? (
                  <div className="text-center py-6">
                    <MessageCircle 
                      className="w-10 h-10 mx-auto mb-2 transition-colors duration-300" 
                      style={{ 
                        color: '#000000',
                        opacity: 0.5
                      }}
                    />
                    <p 
                      className="text-xs transition-colors duration-300"
                      style={{ 
                        color: '#000000',
                        opacity: 0.7
                      }}
                    >
                      Start a conversation to see your chat history
                    </p>
                  </div>
                ) : !currentUser && guestChats.length > 0 ? (
                  <>
                    <div 
                      className="text-xs mb-2 px-2 font-medium transition-colors duration-300" 
                      style={{ color: '#000000' }}
                    >
                      Recent Conversations
                    </div>
                    {guestChats.map((chat) => (
                      <div
                        key={chat.id}
                        className="w-full text-left p-2 rounded-lg transition-colors group relative"
                        style={{ color: '#000000' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(58, 124, 165, 0.12)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div className="flex items-start space-x-2" onClick={() => handleChatSelect(chat)}>
                          <MessageCircle 
                            className="w-3 h-3 mt-0.5 transition-colors" 
                            style={{ 
                              color: '#000000',
                              opacity: 0.6
                            }} 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate">
                              {formatChatTitle(chat)}
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                              <span 
                                className="text-xs" 
                                style={{ 
                                  color: '#000000',
                                  opacity: 0.5
                                }}
                              >
                                {chat.messageCount || 0} messages
                              </span>
                              <span 
                                className="text-xs" 
                                style={{ 
                                  color: '#000000',
                                  opacity: 0.4
                                }}
                              >
                                {new Date(chat.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Delete button */}
                        <button
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          className="absolute top-1 right-1 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                          title="Delete chat"
                        >
                          <Trash2 className="w-2.5 h-2.5 text-red-400 hover:text-red-300" />
                        </button>
                      </div>
                    ))}
                  </>
                ) : currentUser && isLoadingChats ? (
                  <div className="text-center py-6">
                    <div 
                      className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto mb-2"
                      style={{ borderColor: '#808080' }}
                    ></div>
                    <p 
                      className="text-xs"
                      style={{ color: '#000000', opacity: 0.7 }}
                    >
                      Loading chats...
                    </p>
                  </div>
                ) : currentUser && chatError ? (
                  <div className="text-center py-6">
                    <MessageCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
                    <p className="text-red-400 text-xs">{chatError}</p>
                    <button 
                      onClick={loadChatHistory}
                      className="mt-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : currentUser && userChats.length === 0 ? (
                  <div className="text-center py-6">
                    <MessageCircle 
                      className="w-10 h-10 mx-auto mb-2"
                      style={{ color: '#000000', opacity: 0.5 }}
                    />
                    <p 
                      className="text-xs"
                      style={{ color: '#000000', opacity: 0.7 }}
                    >
                      No conversations yet
                    </p>
                    <p 
                      className="text-xs mt-0.5"
                      style={{ color: '#000000', opacity: 0.5 }}
                    >
                      Start chatting to see your history here
                    </p>
                  </div>
                ) : currentUser && userChats.length > 0 ? (
                  <>
                    <div 
                      className="text-xs mb-2 px-2 font-medium" 
                      style={{ color: '#000000' }}
                    >
                      Recent Conversations
                    </div>
                    {userChats.map((chat) => (
                      <div
                        key={chat.id}
                        className="w-full text-left p-2 rounded-lg transition-colors group relative"
                        style={{ color: '#000000' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(58, 124, 165, 0.12)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div className="flex items-start space-x-2" onClick={() => handleChatSelect(chat)}>
                          <MessageCircle 
                            className="w-3 h-3 mt-0.5 transition-colors" 
                            style={{ color: '#000000', opacity: 0.6 }} 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate">
                              {formatChatTitle(chat)}
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                              <span 
                                className="text-xs" 
                                style={{ color: '#000000', opacity: 0.5 }}
                              >
                                {chat.messageCount || 0} messages
                              </span>
                              <span 
                                className="text-xs" 
                                style={{ color: '#000000', opacity: 0.4 }}
                              >
                                {chat.updatedAt ? (
                                  typeof chat.updatedAt.toLocaleDateString === 'function' 
                                    ? chat.updatedAt.toLocaleDateString()
                                    : new Date(chat.updatedAt).toLocaleDateString()
                                ) : 'Recently'}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Delete button */}
                        <button
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          className="absolute top-1 right-1 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                          title="Delete chat"
                        >
                          <Trash2 className="w-2.5 h-2.5 text-red-400 hover:text-red-300" />
                        </button>
                      </div>
                    ))}
                  </>
                ) : null}
              </div>
            </div>

            {/* Bottom section - Fixed at bottom */}
            <Box sx={{ p: 2 }}>
              <Divider sx={{ borderColor: '#808080', mb: 1.5 }} />
              {/* New buttons */}
              <Stack spacing={1}>
                <Button onClick={handleGDTopicsClick} variant="contained" startIcon={<MessagesSquare className="w-4 h-4" />} sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', '&:hover': { backgroundColor: 'primary.dark' } }}>
                  AI for GD Topics
                </Button>
                <Button onClick={handleEligibilityClick} variant="contained" startIcon={<CheckCircle className="w-4 h-4" />} sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', '&:hover': { backgroundColor: 'primary.dark' } }}>
                  Check Eligibility
                </Button>
                <Button onClick={handleSyllabusClick} variant="contained" startIcon={<Network width={16} height={16} strokeWidth={2} stroke={'#000000'} />} sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', '&:hover': { backgroundColor: 'primary.dark' } }}>
                  Exam Syllabus
                </Button>
                <Button onClick={handleQuizClick} variant="contained" startIcon={<PenTool className="w-4 h-4" />} sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', '&:hover': { backgroundColor: 'primary.dark' } }}>
                  Attempt Quiz
                </Button>
                <Button onClick={handlePyqPracticeClick} variant="contained" startIcon={<Target className="w-4 h-4" />} sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', '&:hover': { backgroundColor: 'primary.dark' } }}>
                  PYQ Practice
                </Button>
                <Button onClick={handleBooksClick} variant="contained" startIcon={<BookOpen className="w-4 h-4" />} sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', '&:hover': { backgroundColor: 'primary.dark' } }}>
                  Inserted Books
                </Button>
                <Button onClick={handlePyqsClick} variant="contained" startIcon={<FileText className="w-4 h-4" />} sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', '&:hover': { backgroundColor: 'primary.dark' } }}>
                  Inserted PYQs
                </Button>
                <Button onClick={handleWhatsNewClick} variant="contained" startIcon={<Lightbulb className="w-4 h-4" />} sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', '&:hover': { backgroundColor: 'primary.dark' } }}>
                  What&apos;s New
                </Button>
                <Button onClick={handleHelpClick} variant="contained" startIcon={<CircleHelp width={16} height={16} strokeWidth={2} stroke={'#000000'} />} sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', '&:hover': { backgroundColor: 'primary.dark' } }}>
                  Help & Support
                </Button>
              </Stack>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Collapsed Sidebar (Icon Bar) */}
      {!sidebarVisible && (
        <>
          {/* Mobile sidebar trigger moved to ask bar */}
          <Paper
            elevation={3}
            sx={{
              display: { xs: 'none', md: 'flex' },
              position: 'fixed',
              left: 8,
              top: 72,
              bottom: 8,
              width: 40,
              zIndex: 30,
              borderRadius: 1,
              border: '1px solid #808080',
              backgroundColor: '#ffffff',
              color: '#000000',
              overflow: 'hidden',
              flexDirection: 'column'
            }}
          >
            {/* Toggle Button */}
            <Box sx={{ p: 0.5, display: 'flex', justifyContent: 'center' }}>
              <IconButton onClick={toggleSidebar} size="small" title="Show Sidebar" sx={{ color: '#000000', transform: 'scaleX(-1)' }}>
                <ChevronFirst width={15} height={15} strokeWidth={2} stroke="#000000" />
              </IconButton>
            </Box>

              {/* Icon Menu */}
            <div className="flex-1 flex flex-col items-center space-y-2 p-1">
              <button 
                className="p-1 rounded-lg transition-colors"
                style={{ color: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(58, 124, 165, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="New Chat"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button 
                className="p-1 rounded-lg transition-colors"
                style={{ color: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(58, 124, 165, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            {/* Bottom Icons */}
            <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Divider sx={{ borderColor: '#808080', width: '100%' }} />
              {/* New buttons */}
              <button 
                onClick={handleGDTopicsClick}
                className="p-1 rounded-lg transition-colors"
                style={{ color: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(58, 124, 165, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="AI for GD Topics"
              >
                <MessagesSquare className="w-4 h-4" />
              </button>
              <button 
                onClick={handleEligibilityClick}
                className="p-1 rounded-lg transition-colors"
                style={{ color: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(58, 124, 165, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Check Exams Eligibility and Attempts"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button 
                onClick={handleSyllabusClick}
                className="p-1 rounded-lg transition-colors"
                style={{ color: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(58, 124, 165, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Exam Syllabus"
              >
                <Network width={16} height={16} strokeWidth={2} stroke={'#000000'} />
              </button>
              <button 
                onClick={handleQuizClick}
                className="p-1 rounded-lg transition-colors"
                style={{ color: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(58, 124, 165, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Attempt Quiz"
              >
                <PenTool className="w-4 h-4" />
              </button>
              
              {/* Existing buttons */}
              <button 
                onClick={handlePyqPracticeClick}
                className="p-1 rounded-lg transition-colors"
                style={{ color: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(58, 124, 165, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="PYQ Practice"
              >
                <Target className="w-4 h-4" />
              </button>
              <button 
                onClick={handleBooksClick}
                className="p-1 rounded-lg transition-colors"
                style={{ color: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(58, 124, 165, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Inserted Books"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button 
                onClick={handlePyqsClick}
                className="p-1 rounded-lg transition-colors"
                style={{ color: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(58, 124, 165, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Inserted PYQs"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button 
                onClick={handleWhatsNewClick}
                className="p-1 rounded-lg transition-colors"
                style={{ color: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(186, 255, 57, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="What's New"
              >
                <Lightbulb className="w-4 h-4" />
              </button>
              <button 
                onClick={handleHelpClick}
                className="p-1 rounded-lg transition-colors"
                style={{ color: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(186, 255, 57, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Help & Support"
              >
                <CircleHelp width={16} height={16} strokeWidth={2} stroke={'#000000'} />
              </button>
            </Box>
          </Paper>
        </>
      )}

      {/* Books Modal */}
      {showBooksModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setShowBooksModal(false) }}
        >
          <div
            className="bg-white rounded-lg p-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto m-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Inserted Books</h2>
              <button 
                onClick={() => setShowBooksModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            {isLoadingBooks ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-1 text-gray-600 text-sm">Loading books...</p>
              </div>
            ) : books.filter(b => b.total_chunks > 0).length === 0 ? (
              <div className="text-center py-6">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No books with content found</p>
                <p className="text-gray-500 text-xs mt-1">Only books with indexed content are displayed</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Summary stats */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-800 font-medium">
                      📚 {books.filter(b => b.total_chunks > 0).length} Active Books
                    </span>
                    <span className="text-blue-600">
                      📄 Total Chunks: {books.filter(b => b.total_chunks > 0).reduce((sum, b) => sum + b.total_chunks, 0)}
                    </span>
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Showing only books with indexed content
                  </div>
                </div>

                {books.filter(book => book.total_chunks > 0).map((book, index) => (
                  <div key={index} className="border border-green-200 bg-green-50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-base">{book.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2 text-sm">{book.description}</p>
                    
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Namespace:</span>
                        <span className="font-mono bg-gray-100 px-1 rounded">{book.namespace}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chunks:</span>
                        <span className="font-semibold">{book.total_chunks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Classes:</span>
                        <span>{book.classes.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span>{book.last_updated}</span>
                      </div>
                    </div>
                    
                    {book.topics && book.topics.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Key Topics:</div>
                        <div className="flex flex-wrap gap-1">
                          {book.topics.slice(0, 3).map((topic, topicIndex) => (
                            <span 
                              key={topicIndex}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                          {book.topics.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{book.topics.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inserted PYQs Modal */}
      {showPyqsModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPyqsModal(false) }}
        >
          <div
            className="bg-white rounded-lg p-4 max-w-3xl w-full max-h-[80vh] overflow-y-auto m-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Inserted PYQs</h2>
              <button 
                onClick={() => setShowPyqsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            {isLoadingPyqs ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-1 text-gray-600 text-sm">Loading inserted PYQs...</p>
              </div>
            ) : insertedPyqs.filter(p => p.total_questions > 0).length === 0 ? (
              <div className="text-center py-6">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No PYQs with questions found</p>
                <p className="text-gray-500 text-xs mt-1">Only PYQs with actual questions are displayed</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Summary stats */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-purple-800 font-medium">
                      📝 {insertedPyqs.filter(p => p.total_questions > 0).length} Active PYQs
                    </span>
                    <span className="text-purple-600">
                      🗂️ Total Questions: {insertedPyqs.filter(p => p.total_questions > 0).reduce((sum, p) => sum + p.total_questions, 0)}
                    </span>
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    Showing only PYQs with actual question data
                  </div>
                </div>

                {insertedPyqs.filter(pyq => pyq.total_questions > 0).map((pyq, index) => (
                  <div key={index} className="border border-green-200 bg-green-50 rounded-lg p-2">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm">{pyq.main_exam}</h3>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      {/* Sub Exam Name */}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sub Exam:</span>
                        <span className="font-medium text-gray-800 text-right max-w-[65%]">{pyq.sub_exam}</span>
                      </div>
                      
                      {/* Available Years */}
                      {pyq.years && pyq.years.length > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Years:</span>
                          <div className="flex flex-wrap gap-1 justify-end max-w-[65%]">
                            {pyq.years.slice(0, 3).map((year, yearIndex) => (
                              <span 
                                key={yearIndex}
                                className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded"
                              >
                                {year}
                              </span>
                            ))}
                            {pyq.years.length > 3 && (
                              <span className="text-xs text-gray-400">+{pyq.years.length - 3}</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Available Terms */}
                      {pyq.terms && pyq.terms.length > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Terms:</span>
                          <div className="flex flex-wrap gap-1 justify-end max-w-[65%]">
                            {pyq.terms.map((term, termIndex) => (
                              <span 
                                key={termIndex}
                                className="text-xs bg-orange-100 text-orange-800 px-1 py-0.5 rounded"
                              >
                                {term}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Last Updated */}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium text-gray-800">{pyq.last_updated}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Suspense fallback={null}>
        {/* Help & Support Modal */}
        <HelpSupportModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />
        
        {/* What's New Modal */}
        <WhatsNewModal
          isOpen={showWhatsNewModal}
          onClose={() => setShowWhatsNewModal(false)}
        />
      </Suspense>

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setShowComingSoonModal(false) }}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center transform transition-all duration-300 ease-out animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              ×
            </button>

            {/* Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Clock className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Coming Soon! 🚀
            </h2>

            {/* Feature Name */}
            <p className="text-lg font-semibold text-gray-700 mb-4">
              {comingSoonFeature}
            </p>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              We&apos;re working hard to bring you this amazing feature. Stay tuned for updates!
            </p>

            {/* Decorative Elements */}
            <div className="flex justify-center space-x-2 mb-6">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
