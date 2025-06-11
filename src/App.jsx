import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useMemo } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';
import PrivateRoute from './components/PrivateRoute';
import TopBar from './components/TopBar';
import { Box } from '@mui/material';

function App() {
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: isDarkMode ? '#90caf9' : '#2196f3',
          },
          secondary: {
            main: isDarkMode ? '#f48fb1' : '#f50057',
          },
          background: {
            default: isDarkMode ? '#121212' : '#f8f9fa',
            paper: isDarkMode ? '#1e1e1e' : '#ffffff',
          },
          text: {
            primary: isDarkMode ? '#e0e0e0' : '#1a1a1a',
            secondary: isDarkMode ? '#a0a0a0' : '#666666',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 600,
          },
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [isDarkMode]
  );

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {isAuthenticated && <TopBar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3 },
              mt: isAuthenticated ? '120px' : 0,
              pt: isAuthenticated ? { xs: 4, sm: 5 } : { xs: 2, sm: 3 },
              minHeight: isAuthenticated ? 'calc(100vh - 120px)' : '100vh',
              overflowY: 'auto',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(145deg, #121212 0%, #1e1e1e 100%)'
                : 'linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)',
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <TodoList />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
