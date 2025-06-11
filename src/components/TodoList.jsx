import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Autocomplete,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  FormControlLabel,
} from '@mui/material';
import { 
  Delete, 
  Edit, 
  Add, 
  Star, 
  StarBorder, 
  DeleteSweep, 
  FilterList,
  Search,
  Sort,
  CalendarToday,
  PriorityHigh,
  Description,
  Category,
  BarChart,
  FileDownload,
  FileUpload,
  ExpandMore,
  ExpandLess,
  Info,
  Close,
  Check,
} from '@mui/icons-material';
import { setTodos, addTodo, updateTodo, deleteTodo, toggleImportant } from '../store/todoSlice';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

// Predefined categories
const CATEGORIES = [
  'Work',
  'Personal',
  'Shopping',
  'Health',
  'Education',
  'Finance',
  'Home',
  'Other'
];

function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [filter, setFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState({});
  const [showStats, setShowStats] = useState(false);
  const [showExtraOptions, setShowExtraOptions] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [editingForm, setEditingForm] = useState({
    text: '',
    dueDate: null,
    priority: 'medium',
    category: '',
    description: ''
  });
  const dispatch = useDispatch();
  const { todos } = useSelector((state) => state.todos);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      dispatch(setTodos(JSON.parse(savedTodos)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      important: priority === 'high',
      createdAt: new Date().toISOString(),
      dueDate: dueDate ? dueDate.toISOString() : null,
      category: category,
      description: description,
    };

    dispatch(addTodo(todo));
    setNewTodo('');
    setDueDate(null);
    setPriority('medium');
    setCategory('');
    setDescription('');
    setShowExtraOptions(false);
  };

  const handleToggleTodo = (todo) => {
    dispatch(updateTodo({ 
      ...todo, 
      completed: !todo.completed,
      completedAt: !todo.completed ? new Date().toISOString() : null 
    }));
  };

  const handleDeleteTodo = (todoId) => {
    dispatch(deleteTodo(todoId));
  };

  const handleEditTodo = (todo) => {
    if (editingTodo === todo.id) {
      dispatch(updateTodo({ 
        ...todo, 
        text: editingForm.text,
        important: editingForm.priority === 'high',
        dueDate: editingForm.dueDate ? editingForm.dueDate.toISOString() : null,
        category: editingForm.category,
        description: editingForm.description
      }));
      setEditingTodo(null);
      setEditingForm({
        text: '',
        dueDate: null,
        priority: 'medium',
        category: '',
        description: ''
      });
    } else {
      setEditingTodo(todo.id);
      setEditingForm({
        text: todo.text,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
        priority: todo.important ? 'high' : 'medium',
        category: todo.category || '',
        description: todo.description || ''
      });
    }
  };

  const handleToggleImportant = (todoId) => {
    dispatch(toggleImportant(todoId));
  };

  // Sort todos: important first, then by completion status
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.important !== b.important) return b.important ? 1 : -1;
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (value) => {
    setFilter(value);
    handleFilterClose();
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (value) => {
    setSortBy(value);
    handleSortClose();
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'date': return 'Sort by Date';
      case 'priority': return 'Sort by Priority';
      case 'alphabetical': return 'Sort Alphabetically';
      default: return 'Sort by Date';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Medium';
    }
  };

  // Sort and filter todos
  const filteredAndSortedTodos = sortedTodos
    .filter(todo => {
      // Filter by completion status
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .filter(todo => {
      // Filter by search query
      if (!searchQuery) return true;
      return todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      // Sort by selected criteria
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium'];
        case 'alphabetical':
          return a.text.localeCompare(b.text);
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClearAll = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmClearAll = () => {
    dispatch(setTodos([]));
    setOpenConfirmDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
  };

  const getFilterLabel = () => {
    switch (filter) {
      case 'all': return 'All Tasks';
      case 'active': return 'Active Tasks';
      case 'completed': return 'Completed Tasks';
      default: return 'All Tasks';
    }
  };

  const handleExportTodos = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'todos.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportTodos = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTodos = JSON.parse(e.target.result);
          dispatch(setTodos(importedTodos));
        } catch (error) {
          console.error('Error importing todos:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const toggleDescription = (todoId) => {
    setShowDescription(prev => ({
      ...prev,
      [todoId]: !prev[todoId]
    }));
  };

  // Calculate statistics
  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
    important: todos.filter(todo => todo.important).length,
    byPriority: {
      high: todos.filter(todo => todo.priority === 'high').length,
      medium: todos.filter(todo => todo.priority === 'medium').length,
      low: todos.filter(todo => todo.priority === 'low').length,
    },
    byCategory: CATEGORIES.reduce((acc, cat) => {
      acc[cat] = todos.filter(todo => todo.category === cat).length;
      return acc;
    }, {}),
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
        overflowY: 'auto',
      }}
    >
      <Container 
        maxWidth={false} 
        sx={{ 
          height: '100%',
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2, md: 4 },
        }}
      >
        <Stack spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
          <Zoom in={true}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 1.5, sm: 2, md: 3 },
                borderRadius: 2,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                height: { xs: 'calc(100vh - 40px)', sm: 'calc(100vh - 60px)', md: 'calc(100vh - 80px)' },
                maxHeight: { xs: 'calc(100vh - 40px)', sm: 'calc(100vh - 60px)', md: 'calc(100vh - 80px)' },
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: { xs: 1, sm: 2 }, 
                py: { xs: 0.5, sm: 1 },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Typography 
                  variant="h5" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 500,
                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    letterSpacing: '0.5px',
                    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)'
                      : 'linear-gradient(45deg, #2196f3 30%, #f50057 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  My Todo List
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1, sm: 1.5 }, 
                  alignItems: 'center',
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: { xs: 'space-between', sm: 'flex-end' }
                }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      width: showSearch || searchFocused ? { xs: '100%', sm: '250px' } : '36px',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={() => !showSearch && setSearchFocused(true)}
                    onMouseLeave={() => !showSearch && setSearchFocused(false)}
                  >
                    <TextField
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSearch(true)}
                      onBlur={() => {
                        if (!searchQuery) {
                          setShowSearch(false);
                        }
                      }}
                      size="small"
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          transition: 'all 0.3s ease',
                          width: showSearch || searchFocused ? '100%' : '0',
                          opacity: showSearch || searchFocused ? 1 : 0,
                          height: '36px',
                        },
                      }}
                    />
                    <Tooltip title="Search Tasks">
                      <IconButton
                        onClick={() => {
                          setShowSearch(!showSearch);
                          if (!showSearch) {
                            setSearchFocused(true);
                          }
                        }}
                        size="small"
                        sx={{
                          position: 'absolute',
                          right: 0,
                          color: showSearch ? theme.palette.primary.main : theme.palette.text.secondary,
                          '&:hover': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        <Search />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
                    <Button
                      variant="outlined"
                      startIcon={<BarChart sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />}
                      onClick={() => setShowStats(!showStats)}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        px: { xs: 1, sm: 1.2 },
                        py: 0.5,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        minWidth: 'auto',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Stats
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<FileDownload sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />}
                      onClick={handleExportTodos}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        px: { xs: 1, sm: 1.2 },
                        py: 0.5,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        minWidth: 'auto',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Export
                    </Button>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<FileUpload sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        px: { xs: 1, sm: 1.2 },
                        py: 0.5,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        minWidth: 'auto',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Import
                      <input
                        type="file"
                        hidden
                        accept=".json"
                        onChange={handleImportTodos}
                      />
                    </Button>
                  </Box>
                </Box>
              </Box>

              {showStats && (
                <Card sx={{ mb: 4, background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Task Statistics</Typography>
                      <IconButton
                        onClick={() => setShowStats(false)}
                        size="small"
                        sx={{
                          color: theme.palette.text.secondary,
                          '&:hover': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom>Overview</Typography>
                        <Box>
                          <Typography>Total Tasks: {stats.total}</Typography>
                          <Typography>Completed: {stats.completed}</Typography>
                          <Typography>Active: {stats.active}</Typography>
                          <Typography>Important: {stats.important}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom>By Priority</Typography>
                        <Box>
                          <Typography>High: {stats.byPriority.high}</Typography>
                          <Typography>Medium: {stats.byPriority.medium}</Typography>
                          <Typography>Low: {stats.byPriority.low}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom>By Category</Typography>
                        <Box>
                          {Object.entries(stats.byCategory).map(([cat, count]) => (
                            <Typography key={cat}>{cat}: {count}</Typography>
                          ))}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom>Completion Rate</Typography>
                        <Box sx={{ width: '100%', mt: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={(stats.completed / stats.total) * 100} 
                            sx={{ height: 10, borderRadius: 5 }}
                          />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {Math.round((stats.completed / stats.total) * 100)}% Complete
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}

              <Box 
                component="form" 
                onSubmit={handleAddTodo}
                sx={{ 
                  mb: { xs: 2, sm: 3 }, 
                  display: 'flex', 
                  gap: { xs: 1, sm: 2 }, 
                  flexDirection: { xs: 'column', sm: 'row' },
                  width: '100%',
                  position: 'sticky',
                  top: { xs: '120px', sm: '140px' },
                  zIndex: 1,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                    : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                  pb: { xs: 1, sm: 2 },
                  pt: { xs: 1, sm: 2 },
                  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                <TextField
                  fullWidth
                  label="Add new todo"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Additional Options">
                          <IconButton
                            onClick={() => setShowExtraOptions(!showExtraOptions)}
                            size="small"
                            sx={{
                              color: showExtraOptions ? theme.palette.primary.main : theme.palette.text.secondary,
                              '&:hover': {
                                color: theme.palette.primary.main,
                              },
                            }}
                          >
                            <Info />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1, sm: 2 }, 
                  width: { xs: '100%', sm: 'auto' },
                  flexDirection: { xs: 'row', sm: 'row' }
                }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    startIcon={<Add />}
                    sx={{
                      borderRadius: 1,
                      textTransform: 'none',
                      px: { xs: 1.5, sm: 2 },
                      minWidth: { xs: '50%', sm: 'auto' },
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
                    {editingTodo ? 'Update' : 'Add'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteSweep />}
                    onClick={handleClearAll}
                    sx={{
                      borderRadius: 1,
                      textTransform: 'none',
                      px: { xs: 1.5, sm: 2 },
                      minWidth: { xs: '50%', sm: 'auto' },
                      borderColor: theme.palette.error.main,
                      color: theme.palette.error.main,
                    }}
                  >
                    Clear All
                  </Button>
                </Box>
              </Box>

              {showExtraOptions && (
                <Fade in={showExtraOptions}>
                  <Box 
                    sx={{ 
                      mb: 2,
                      display: 'flex',
                      gap: 2,
                      flexDirection: isMobile ? 'column' : 'row',
                      width: '100%',
                      flexWrap: 'wrap',
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Due Date (Optional)"
                        value={dueDate}
                        onChange={(newValue) => setDueDate(newValue)}
                        slotProps={{
                          textField: {
                            sx: {
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                              },
                            }
                          }
                        }}
                      />
                    </LocalizationProvider>
                    <Autocomplete
                      value={category}
                      onChange={(event, newValue) => setCategory(newValue)}
                      options={CATEGORIES}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Category (Optional)"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                            },
                          }}
                        />
                      )}
                      sx={{ minWidth: 120 }}
                    />
                    <TextField
                      label="Description (Optional)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      multiline
                      rows={1}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                        },
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={priority === 'high'}
                          onChange={(e) => setPriority(e.target.checked ? 'high' : 'medium')}
                          sx={{
                            color: theme.palette.secondary.main,
                            '&.Mui-checked': {
                              color: theme.palette.secondary.main,
                            },
                          }}
                        />
                      }
                      label="Mark as Important"
                      sx={{
                        color: theme.palette.text.primary,
                      }}
                    />
                  </Box>
                </Fade>
              )}

              <List 
                sx={{ 
                  width: '100%',
                  overflowY: 'auto',
                  flex: 1,
                  px: 1,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    borderRadius: '4px',
                    '&:hover': {
                      background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    },
                  },
                }}
              >
                {filteredAndSortedTodos.map((todo) => (
                  <Fade in={true} timeout={500} key={todo.id}>
                    <ListItem
                      sx={{
                        bgcolor: 'background.paper',
                        mb: 2,
                        borderRadius: 1,
                        transition: 'all 0.3s ease',
                        border: todo.important ? `2px solid ${theme.palette.secondary.main}` : 'none',
                        '&:hover': {
                          transform: 'translateX(8px)',
                          bgcolor: 'action.hover',
                        },
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                        <Checkbox
                          checked={todo.completed}
                          onChange={() => handleToggleTodo(todo)}
                          sx={{
                            color: theme.palette.primary.main,
                            '&.Mui-checked': {
                              color: theme.palette.secondary.main,
                            },
                          }}
                        />
                        <ListItemText
                          primary={
                            <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              {editingTodo === todo.id ? (
                                <TextField
                                  fullWidth
                                  value={editingForm.text}
                                  onChange={(e) => setEditingForm(prev => ({ ...prev, text: e.target.value }))}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 1,
                                    },
                                  }}
                                />
                              ) : (
                                <Typography
                                  component="span"
                                  sx={{
                                    textDecoration: todo.completed ? 'line-through' : 'none',
                                    color: todo.completed ? 'text.secondary' : 'text.primary',
                                    fontSize: '1rem',
                                    fontWeight: todo.important ? 600 : 400,
                                  }}
                                >
                                  {todo.text}
                                </Typography>
                              )}
                              {todo.category && (
                                <Chip
                                  label={todo.category}
                                  size="small"
                                  icon={<Category sx={{ fontSize: '1rem' }} />}
                                  sx={{
                                    backgroundColor: theme.palette.primary.main,
                                    color: 'white',
                                    fontWeight: 500,
                                  }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box component="div" sx={{ mt: 0.5 }}>
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  color: 'text.secondary',
                                  fontSize: '0.75rem',
                                  mb: 0.5,
                                }}
                              >
                                Created: {formatDate(todo.createdAt)}
                              </Typography>
                              {todo.dueDate && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    color: theme.palette.warning.main,
                                    fontSize: '0.75rem',
                                    mb: 0.5,
                                  }}
                                >
                                  Due: {formatDate(todo.dueDate)}
                                </Typography>
                              )}
                              {todo.completed && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    color: theme.palette.secondary.main,
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                  }}
                                >
                                  Completed: {formatDate(todo.completedAt)}
                                </Typography>
                              )}
                              {showDescription[todo.id] && todo.description && (
                                <Typography
                                  component="div"
                                  variant="body2"
                                  sx={{
                                    mt: 1,
                                    p: 1,
                                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                    borderRadius: 1,
                                  }}
                                >
                                  {todo.description}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          {todo.description && (
                            <Tooltip title={showDescription[todo.id] ? "Hide Description" : "Show Description"}>
                              <IconButton
                                edge="end"
                                aria-label="description"
                                onClick={() => toggleDescription(todo.id)}
                                sx={{ 
                                  mr: 1,
                                  color: showDescription[todo.id] ? theme.palette.primary.main : theme.palette.text.secondary,
                                  '&:hover': {
                                    color: theme.palette.primary.main,
                                  },
                                }}
                              >
                                <Info />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title={todo.important ? "Mark as not important" : "Mark as important"}>
                            <IconButton
                              edge="end"
                              aria-label="important"
                              onClick={() => handleToggleImportant(todo.id)}
                              sx={{ 
                                mr: 1,
                                color: todo.important ? theme.palette.secondary.main : 'text.secondary',
                                '&:hover': {
                                  color: theme.palette.secondary.main,
                                },
                              }}
                            >
                              {todo.important ? <Star /> : <StarBorder />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={editingTodo === todo.id ? "Save Changes" : "Edit"}>
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              onClick={() => handleEditTodo(todo)}
                              sx={{ 
                                mr: 1,
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  color: theme.palette.primary.dark,
                                },
                              }}
                            >
                              {editingTodo === todo.id ? <Check /> : <Edit />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleDeleteTodo(todo.id)}
                              sx={{ 
                                color: theme.palette.error.main,
                                '&:hover': {
                                  color: theme.palette.error.dark,
                                },
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </Box>
                      {editingTodo === todo.id && (
                        <Fade in={true}>
                          <Box 
                            sx={{ 
                              mt: 2,
                              display: 'flex',
                              gap: 2,
                              flexDirection: isMobile ? 'column' : 'row',
                              width: '100%',
                              flexWrap: 'wrap',
                              pl: 6,
                            }}
                          >
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                label="Due Date (Optional)"
                                value={editingForm.dueDate}
                                onChange={(newValue) => setEditingForm(prev => ({ ...prev, dueDate: newValue }))}
                                slotProps={{
                                  textField: {
                                    sx: {
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                      },
                                    }
                                  }
                                }}
                              />
                            </LocalizationProvider>
                            <Autocomplete
                              value={editingForm.category}
                              onChange={(event, newValue) => setEditingForm(prev => ({ ...prev, category: newValue }))}
                              options={CATEGORIES}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Category (Optional)"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 1,
                                    },
                                  }}
                                />
                              )}
                              sx={{ minWidth: 120 }}
                            />
                            <TextField
                              label="Description (Optional)"
                              value={editingForm.description}
                              onChange={(e) => setEditingForm(prev => ({ ...prev, description: e.target.value }))}
                              multiline
                              rows={1}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 1,
                                },
                              }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={editingForm.priority === 'high'}
                                  onChange={(e) => setEditingForm(prev => ({ 
                                    ...prev, 
                                    priority: e.target.checked ? 'high' : 'medium' 
                                  }))}
                                  sx={{
                                    color: theme.palette.secondary.main,
                                    '&.Mui-checked': {
                                      color: theme.palette.secondary.main,
                                    },
                                  }}
                                />
                              }
                              label="Mark as Important"
                              sx={{
                                color: theme.palette.text.primary,
                              }}
                            />
                          </Box>
                        </Fade>
                      )}
                    </ListItem>
                  </Fade>
                ))}
              </List>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleFilterClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                      : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                    borderRadius: 1,
                  },
                }}
              >
                <MenuItem 
                  onClick={() => handleFilterSelect('all')}
                  selected={filter === 'all'}
                  sx={{
                    color: theme.palette.text.primary,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(144, 202, 249, 0.08)'
                        : 'rgba(33, 150, 243, 0.08)',
                    },
                  }}
                >
                  All Tasks
                </MenuItem>
                <MenuItem 
                  onClick={() => handleFilterSelect('active')}
                  selected={filter === 'active'}
                  sx={{
                    color: theme.palette.text.primary,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(144, 202, 249, 0.08)'
                        : 'rgba(33, 150, 243, 0.08)',
                    },
                  }}
                >
                  Active Tasks
                </MenuItem>
                <MenuItem 
                  onClick={() => handleFilterSelect('completed')}
                  selected={filter === 'completed'}
                  sx={{
                    color: theme.palette.text.primary,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(144, 202, 249, 0.08)'
                        : 'rgba(33, 150, 243, 0.08)',
                    },
                  }}
                >
                  Completed Tasks
                </MenuItem>
              </Menu>

              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={handleSortClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                      : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                    borderRadius: 1,
                  },
                }}
              >
                <MenuItem 
                  onClick={() => handleSortSelect('date')}
                  selected={sortBy === 'date'}
                  sx={{
                    color: theme.palette.text.primary,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(144, 202, 249, 0.08)'
                        : 'rgba(33, 150, 243, 0.08)',
                    },
                  }}
                >
                  Sort by Date
                </MenuItem>
                <MenuItem 
                  onClick={() => handleSortSelect('priority')}
                  selected={sortBy === 'priority'}
                  sx={{
                    color: theme.palette.text.primary,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(144, 202, 249, 0.08)'
                        : 'rgba(33, 150, 243, 0.08)',
                    },
                  }}
                >
                  Sort by Priority
                </MenuItem>
                <MenuItem 
                  onClick={() => handleSortSelect('alphabetical')}
                  selected={sortBy === 'alphabetical'}
                  sx={{
                    color: theme.palette.text.primary,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(144, 202, 249, 0.08)'
                        : 'rgba(33, 150, 243, 0.08)',
                    },
                  }}
                >
                  Sort Alphabetically
                </MenuItem>
              </Menu>

              <Dialog
                open={openConfirmDialog}
                onClose={handleCloseDialog}
                PaperProps={{
                  sx: {
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                      : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                    borderRadius: 2,
                  },
                }}
              >
                <DialogTitle sx={{ 
                  color: theme.palette.error.main,
                  fontWeight: 600,
                }}>
                  Clear All Tasks
                </DialogTitle>
                <DialogContent>
                  <DialogContentText sx={{ 
                    color: theme.palette.text.primary,
                    fontSize: '1rem',
                  }}>
                    Are you sure you want to delete all tasks? This action cannot be undone.
                  </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                  <Button 
                    onClick={handleCloseDialog}
                    sx={{
                      color: theme.palette.text.primary,
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirmClearAll}
                    variant="contained"
                    color="error"
                    sx={{
                      textTransform: 'none',
                      px: 3,
                      '&:hover': {
                        backgroundColor: theme.palette.error.dark,
                      },
                    }}
                  >
                    Delete All
                  </Button>
                </DialogActions>
              </Dialog>
            </Paper>
          </Zoom>
        </Stack>
      </Container>
    </Box>
  );
}

export default TodoList; 