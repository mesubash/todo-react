import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      dispatch(login());
      navigate('/');
    } else {
      setError('Please enter both email and password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(145deg, #121212 0%, #1e1e1e 100%)'
          : 'linear-gradient(145deg, #f5f5f5 0%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
      }}
    >
      <Container 
        maxWidth={false} 
        sx={{ 
          height: '100%',
          py: 4,
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Stack 
          spacing={3} 
          sx={{ 
            width: '100%', 
            maxWidth: '400px', 
            mx: 'auto',
          }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: isMobile ? 3 : 4,
              borderRadius: 2,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              width: '100%',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <LoginIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)'
                    : 'linear-gradient(45deg, #2196f3 30%, #f50057 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please sign in to continue
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  borderRadius: 1,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  py: 1.5,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)'
                    : 'linear-gradient(45deg, #2196f3 30%, #f50057 90%)',
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #64b5f6 30%, #f06292 90%)'
                      : 'linear-gradient(45deg, #1976d2 30%, #c51162 90%)',
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/register')}
                sx={{ 
                  mt: 1,
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': {
                    background: 'transparent',
                    color: 'primary.main',
                  },
                }}
              >
                Don't have an account? Register
              </Button>
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}

export default Login; 