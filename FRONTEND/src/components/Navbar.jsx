import React, { useState, useEffect } from 'react'
import { LogIn, UserPlus, Home, BarChart3, Info, Phone, LogOut, Target } from 'lucide-react'
import { AppBar, Toolbar, Box, Typography, Button, Avatar, Stack, Container, Chip } from '@mui/material'
import AuthModal from './AuthModal'
import AboutUsModal from './AboutUsModal'
import ContactModal from './ContactModal'
import EditProfileModal from './EditProfileModal'
import Clock from './Clock'
import { useAuth } from '../contexts/AuthContext'

const Navbar = ({ onViewChange, currentView }) => {
  const { currentUser, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [loadTimeMs, setLoadTimeMs] = useState(null)

  // Close modal when user becomes authenticated
  useEffect(() => {
    if (currentUser && showAuthModal) {
      console.log('User authenticated, closing modal:', currentUser.email)
      setShowAuthModal(false)
    }
  }, [currentUser, showAuthModal])

  // Also close modal when user changes (additional safety)
  useEffect(() => {
    if (currentUser) {
      setShowAuthModal(false)
    }
  }, [currentUser])

  // Listen for custom event to open auth modal from other components
  useEffect(() => {
    const handleOpenAuthModal = (event) => {
      const mode = event.detail?.mode || 'login'
      setAuthMode(mode)
      setShowAuthModal(true)
    }

    window.addEventListener('openAuthModal', handleOpenAuthModal)
    
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal)
    }
  }, [])

  const handleAuthClick = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const getUserInitials = (displayName) => {
    if (!displayName) return 'U'
    const names = displayName.split(' ')
    return names.length > 1 
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase()
  }

  useEffect(() => {
    const computeLoadTime = () => {
      const entry = performance.getEntriesByType('navigation')[0]
      if (entry && entry.duration) {
        setLoadTimeMs(Math.round(entry.duration))
        return
      }
      if (performance.timing) {
        const timing = performance.timing
        const duration = timing.loadEventEnd - timing.navigationStart
        if (duration > 0) {
          setLoadTimeMs(Math.round(duration))
        }
      }
    }

    if (document.readyState === 'complete') {
      computeLoadTime()
    } else {
      const onLoad = () => computeLoadTime()
      window.addEventListener('load', onLoad)
      return () => window.removeEventListener('load', onLoad)
    }
  }, [])

  const navButtonSx = (active) => ({
    px: { xs: 0.5, sm: 1, md: 1.5 },
    py: { xs: 0.25, sm: 0.5 },
    borderRadius: active ? 2 : 1.5,
    backgroundColor: active ? '#BAFF39' : 'transparent',
    color: '#000000',
    fontWeight: 700,
    fontSize: { xs: '0.6rem', sm: '0.75rem' },
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: active ? '#BAFF39' : 'rgba(0, 0, 0, 0.04)'
    }
  })

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        border: '1px solid #808080',
        borderRadius: 2,
        top: 4,
        left: 4,
        right: 4,
        zIndex: 50
      }}
    >
      <Toolbar disableGutters sx={{ minHeight: 56 }}>
        <Container maxWidth={false} disableGutters sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', minWidth: 0 }}>
            {/* Left side - App name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <img
                src="/mg.png"
                alt="MG Logo"
                width={44}
                height={44}
                style={{
                  objectFit: 'contain',
                  filter: 'brightness(0) saturate(100%) invert(88%) sepia(56%) saturate(839%) hue-rotate(20deg) brightness(104%) contrast(102%)'
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  color: '#BAFF39',
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                  whiteSpace: 'nowrap'
                }}
              >
                GYAN SETU
              </Typography>
            </Box>

            {/* Center - Navigation */}
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, backgroundColor: 'rgba(255,255,255,0.9)', px: { sm: 1, md: 2, lg: 3 }, py: 1, borderRadius: 2, boxShadow: 1 }}>
                <Button onClick={() => onViewChange('chat')} startIcon={<Home size={12} />} sx={navButtonSx(currentView === 'chat')}>
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Home</Box>
                </Button>
                <Button onClick={() => onViewChange('dashboard')} startIcon={<BarChart3 size={12} />} sx={navButtonSx(currentView === 'dashboard')}>
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Dashboard</Box>
                </Button>
                <Button onClick={() => onViewChange('pyq-practice')} startIcon={<Target size={12} />} sx={navButtonSx(currentView === 'pyq-practice')}>
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>PYQ Practice</Box>
                </Button>
                <Button onClick={() => setShowAboutModal(true)} startIcon={<Info size={12} />} sx={navButtonSx(false)}>
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>About Us</Box>
                </Button>
                <Button onClick={() => setShowContactModal(true)} startIcon={<Phone size={12} />} sx={navButtonSx(false)}>
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Contact</Box>
                </Button>
              </Box>
            </Box>

            {/* Right side - Clock and User actions */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Clock />
              </Box>
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <Clock isMobile={true} />
              </Box>
              {loadTimeMs !== null && (
                <Chip
                  size="small"
                  label={`Load: ${loadTimeMs}ms`}
                  sx={{
                    fontSize: '0.7rem',
                    height: 22,
                    backgroundColor: 'rgba(186, 255, 57, 0.2)',
                    color: '#000000'
                  }}
                />
              )}

              {currentUser ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Button
                    onClick={() => setShowEditProfile(true)}
                    size="small"
                    variant="text"
                    sx={{
                      minWidth: 0,
                      color: '#000000',
                      px: 0.5,
                      '&:hover': { backgroundColor: 'rgba(186, 255, 57, 0.15)' }
                    }}
                  >
                    <Avatar sx={{ width: 24, height: 24, bgcolor: '#BAFF39', color: '#000000', fontSize: '0.75rem' }}>
                      {getUserInitials(currentUser.displayName)}
                    </Avatar>
                    <Typography
                      variant="caption"
                      sx={{ ml: 0.75, color: '#BAFF39', display: { xs: 'none', md: 'inline' }, fontWeight: 600 }}
                    >
                      {currentUser.displayName || currentUser.email}
                    </Typography>
                  </Button>
                  <Button
                    onClick={handleLogout}
                    size="small"
                    variant="contained"
                    color="error"
                    startIcon={<LogOut size={14} />}
                    sx={{ borderRadius: 999, fontSize: '0.75rem' }}
                  >
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Logout</Box>
                  </Button>
                </Stack>
              ) : (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Button
                    onClick={() => handleAuthClick('login')}
                    size="small"
                    variant="contained"
                    startIcon={<LogIn size={14} />}
                    sx={{ backgroundColor: '#1f2937', borderRadius: 999, fontSize: '0.75rem', '&:hover': { backgroundColor: '#374151' } }}
                  >
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Log In</Box>
                  </Button>
                  <Button
                    onClick={() => handleAuthClick('signup')}
                    size="small"
                    variant="contained"
                    startIcon={<UserPlus size={14} />}
                    sx={{ backgroundColor: '#BAFF39', color: '#000000', borderRadius: 999, fontSize: '0.75rem', '&:hover': { backgroundColor: '#B0F236' } }}
                  >
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Sign up</Box>
                  </Button>
                </Stack>
              )}
            </Stack>
          </Box>
        </Container>
      </Toolbar>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      <AboutUsModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </AppBar>
  )
}

export default Navbar
