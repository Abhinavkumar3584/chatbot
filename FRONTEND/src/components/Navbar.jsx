import React, { useState, useEffect, lazy, Suspense } from 'react'
import { LogIn, UserPlus, Home, BarChart3, Info, Phone, LogOut, Target } from 'lucide-react'
import { AppBar, Toolbar, Box, Typography, Button, Avatar, Stack, Container, Chip } from '@mui/material'
import { alpha } from '@mui/material/styles'
const AuthModal = lazy(() => import('./AuthModal'))
const AboutUsModal = lazy(() => import('./AboutUsModal'))
const ContactModal = lazy(() => import('./ContactModal'))
const EditProfileModal = lazy(() => import('./EditProfileModal'))
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
    backgroundColor: active ? 'primary.main' : 'transparent',
    color: 'text.primary',
    fontWeight: 700,
    fontSize: { xs: '0.6rem', sm: '0.75rem' },
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: active ? 'primary.main' : 'action.hover'
    }
  })

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        border: '1px solid #808080',
        borderRadius: 1,
        top: 8,
        left: 8,
        right: 8,
        width: 'calc(100% - 16px)',
        height: 56,
        zIndex: (theme) => theme.zIndex.appBar + 10,
        overflow: 'hidden'
      }}
    >
      <Toolbar disableGutters sx={{ minHeight: 56, height: 56, display: 'flex', alignItems: 'center', px: 0 }}>
        <Container maxWidth={false} disableGutters sx={{ px: { xs: 0.5, sm: 0.75, md: 1 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', minWidth: 0, height: '100%' }}>
            {/* Left side - App name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0, height: '100%' }}>
              <img
                src="/mg.png"
                alt="MG Logo"
                width={36}
                height={36}
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
                    color: 'primary.main',
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                  whiteSpace: 'nowrap'
                }}
              >
                GYAN SETU
              </Typography>
            </Box>

            {/* Center - Navigation */}
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', minWidth: 0, overflow: 'hidden', height: '100%', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, backgroundColor: 'rgba(255,255,255,0.9)', px: { sm: 0.75, md: 1, lg: 1.5 }, py: 0.25, borderRadius: 2, boxShadow: 1, overflow: 'hidden', height: 'fit-content' }}>
                <Button onClick={() => onViewChange('chat')} startIcon={<Home size={14} />} sx={navButtonSx(currentView === 'chat')}>
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Home</Box>
                </Button>
                <Button onClick={() => onViewChange('dashboard')} startIcon={<BarChart3 size={14} />} sx={navButtonSx(currentView === 'dashboard')}>
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Dashboard</Box>
                </Button>
                <Button onClick={() => onViewChange('pyq-practice')} startIcon={<Target size={14} />} sx={navButtonSx(currentView === 'pyq-practice')}>
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>PYQ Practice</Box>
                </Button>
                <Button onClick={() => setShowAboutModal(true)} startIcon={<Info size={14} />} sx={navButtonSx(false)}>
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>About Us</Box>
                </Button>
                <Button onClick={() => setShowContactModal(true)} startIcon={<Phone size={14} />} sx={navButtonSx(false)}>
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Contact</Box>
                </Button>
              </Box>
            </Box>

            {/* Right side - Clock and User actions */}
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flexShrink: 0, height: '100%' }}>
              <Box sx={{ display: { xs: 'none', lg: 'flex' } }}>
                <Clock />
              </Box>
              <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
                <Clock isMobile={true} />
              </Box>
              {loadTimeMs !== null && (
                <Chip
                  size="small"
                  label={`${loadTimeMs}ms`}
                  sx={{
                    display: { xs: 'none', lg: 'flex' },
                    fontSize: '0.65rem',
                    height: 20,
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.18),
                      color: 'text.primary'
                  }}
                />
              )}

              {currentUser ? (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Button
                    onClick={() => setShowEditProfile(true)}
                    size="small"
                    variant="text"
                    sx={{
                      minWidth: 0,
                        color: 'text.primary',
                      px: 0.5,
                        '&:hover': { backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12) }
                    }}
                  >
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: '0.75rem' }}>
                      {getUserInitials(currentUser.displayName)}
                    </Avatar>
                    <Typography
                      variant="caption"
                        sx={{ ml: 0.75, color: 'primary.main', display: { xs: 'none', lg: 'inline' }, fontWeight: 600 }}
                    >
                      {currentUser.displayName || currentUser.email}
                    </Typography>
                  </Button>
                  <Button
                    onClick={handleLogout}
                    size="small"
                    variant="contained"
                    color="error"
                    startIcon={<LogOut size={12} />}
                    sx={{ borderRadius: 999, fontSize: '0.7rem', px: 1, py: 0.25 }}
                  >
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Logout</Box>
                  </Button>
                </Stack>
              ) : (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Button
                    onClick={() => handleAuthClick('login')}
                    size="small"
                    variant="contained"
                      startIcon={<LogIn size={14} />}
                      sx={{ backgroundColor: 'secondary.main', color: 'secondary.contrastText', borderRadius: 999, fontSize: '0.7rem', px: 1, py: 0.25, '&:hover': { backgroundColor: 'secondary.dark' } }}
                  >
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Log In</Box>
                  </Button>
                    <Button
                    onClick={() => handleAuthClick('signup')}
                    size="small"
                    variant="contained"
                      startIcon={<UserPlus size={14} />}
                      sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', borderRadius: 999, fontSize: '0.7rem', px: 1, py: 0.25, '&:hover': { backgroundColor: 'primary.dark' } }}
                  >
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Sign up</Box>
                  </Button>
                </Stack>
              )}
            </Stack>
          </Box>
        </Container>
      </Toolbar>

      <Suspense fallback={null}>
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
      </Suspense>
    </AppBar>
  )
}

export default Navbar
