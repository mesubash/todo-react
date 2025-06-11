import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  AccountCircle,
} from '@mui/icons-material';

function TopBar({ toggleTheme, isDarkMode }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useSelector((state) => state.auth.user);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 100%)'
          : 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)',
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 2px 10px rgba(0,0,0,0.2)'
          : '0 2px 10px rgba(0,0,0,0.1)',
        height: 72,
        borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 }, height: '100%' }}>
        <Typography
          variant="h6"
          component="a"
          href="/"
          sx={{
            fontWeight: 700,
            color: theme.palette.mode === 'dark' ? '#fff' : '#1a1a1a',
            textDecoration: 'none',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)'
              : 'linear-gradient(45deg, #2196f3 30%, #f50057 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.25rem',
          }}
        >
          Todo App
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                icon={<LightMode sx={{ 
                  color: theme.palette.mode === 'dark' ? '#90caf9' : '#2196f3',
                  fontSize: '1.2rem',
                }} />}
                checkedIcon={<DarkMode sx={{ 
                  color: theme.palette.mode === 'dark' ? '#90caf9' : '#2196f3',
                  fontSize: '1.2rem',
                }} />}
                size="medium"
                sx={{
                  '& .MuiSwitch-switchBase': {
                    padding: '9px',
                    '&.Mui-checked': {
                      transform: 'translateX(20px)',
                      '& + .MuiSwitch-track': {
                        opacity: 1,
                        backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#2196f3',
                      },
                    },
                  },
                  '& .MuiSwitch-thumb': {
                    width: 18,
                    height: 18,
                    margin: 2,
                    boxShadow: 'none',
                    backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#2196f3',
                  },
                  '& .MuiSwitch-track': {
                    borderRadius: 20,
                    opacity: 1,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.3)' : 'rgba(33, 150, 243, 0.3)',
                  },
                }}
              />
            }
            label={isDarkMode ? 'Dark' : 'Light'}
            sx={{ 
              mr: 1,
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem',
                color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#1a1a1a',
                fontWeight: 500,
              },
            }}
          />

          <IconButton
            size="small"
            onClick={handleMenu}
            sx={{ 
              p: 0,
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s',
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                border: '2px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.3)' : 'rgba(33, 150, 243, 0.3)',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)'
                  : 'linear-gradient(45deg, #2196f3 30%, #f50057 90%)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 2px 8px rgba(144, 202, 249, 0.2)'
                  : '0 2px 8px rgba(33, 150, 243, 0.2)',
              }}
            >
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 20px rgba(0,0,0,0.2)'
                  : '0 4px 20px rgba(0,0,0,0.1)',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                '& .MuiMenuItem-root': {
                  fontSize: '0.875rem',
                  px: 2,
                  py: 1,
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(144, 202, 249, 0.08)'
                      : 'rgba(33, 150, 243, 0.08)',
                  },
                },
              },
            }}
          >
            <MenuItem onClick={handleClose}>
              <AccountCircle sx={{ mr: 1, fontSize: '1.2rem', color: theme.palette.mode === 'dark' ? '#90caf9' : '#2196f3' }} />
              {user?.email || 'User'}
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar; 