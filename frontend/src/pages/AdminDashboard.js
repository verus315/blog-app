import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
  Grid,
  Stack,
  Avatar,
  Badge
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Report as ReportIcon,
  Article as ArticleIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
  Public as PublicIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Dashboard as DashboardIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import {
  getReports,
  getReportsByStatus,
  updateReport,
  deleteReport,
  getPosts,
  deletePost,
  getUsers,
  deleteUser,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  updatePost,
  createPost,
  updateUser,
  createUser,
  getReportedComments,
  handleReportedComment
} from '../services/api';
import { alpha, useTheme } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';

const drawerWidth = 280;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reportTabValue, setReportTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useAuth();
  const [reportedComments, setReportedComments] = useState([]);
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const tabs = [
    { label: 'Dashboard', value: -1, icon: <DashboardIcon />, color: 'primary' },
    { label: 'Reports', value: 0, icon: <ReportIcon />, color: 'warning' },
    { label: 'Posts', value: 1, icon: <ArticleIcon />, color: 'info' },
    { label: 'Categories', value: 2, icon: <CategoryIcon />, color: 'success' },
    { label: 'Users', value: 3, icon: <PeopleIcon />, color: 'primary' }
  ];

  const fetchTabData = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case 0: // Reports
          const reportsResponse = reportTabValue === 0
          ? await getReports()
          : await getReportsByStatus(reportTabValue === 1 ? 'pending' : 'resolved');
        setReports(reportsResponse.data.data || []);
        break;
      case 1: // Posts
        const postsResponse = await getPosts();
        if (postsResponse.data.success) {
          setPosts(postsResponse.data.data || []);
        }
        break;
      case 2: // Categories
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse.data.data || []);
        break;
      case 3: // Users
        const usersResponse = await getUsers();
        setUsers(usersResponse.data.data || []);
        break;
    }
  } catch (err) {
    console.error('Error fetching tab data:', err);
    setError('Failed to fetch data');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (user?.role !== 'admin') {
    setError('Access denied. Admin privileges required.');
    setLoading(false);
    return;
  }
  
  const fetchAllData = async () => {
    try {
      setLoading(true);
      // Fetch all necessary data for the dashboard
      const [reportsRes, postsRes, categoriesRes, usersRes] = await Promise.all([
        getReports(),
        getPosts(),
        getCategories(),
        getUsers()
      ]);

      if (reportsRes.data.success) {
        setReports(reportsRes.data.data || []);
      }
      if (postsRes.data.success) {
        setPosts(postsRes.data.data || []);
      }
      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data || []);
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
  fetchReportedComments();
}, []); // Only run on mount

// Separate useEffect for tab-specific data
useEffect(() => {
  if (activeTab >= 0) {
    fetchTabData();
  }
}, [activeTab, reportTabValue]);

const fetchReportedComments = async () => {
  try {
    const response = await getReportedComments();
    if (response.data.success) {
      setReportedComments(response.data.data);
    }
  } catch (error) {
    console.error('Error fetching reported comments:', error);
  }
};

const handleDeleteComment = async (commentId) => {
  try {
    const response = await handleReportedComment(commentId, { action: 'delete' });
    if (response.data.success) {
      fetchReportedComments();
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
};

const handleIgnoreReport = async (commentId) => {
  try {
    const response = await handleReportedComment(commentId, { action: 'ignore' });
    if (response.data.success) {
      fetchReportedComments();
    }
  } catch (error) {
    console.error('Error ignoring report:', error);
  }
};

const handleTabChange = (value) => {
  setActiveTab(value);
  setMobileOpen(false); // Close mobile drawer when tab changes
  
  // Load categories when switching to posts tab
  if (value === 1) { // Posts tab
    const loadCategories = async () => {
      try {
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse.data.data || []);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }
};

const handleReportTabChange = (event, newValue) => {
  setReportTabValue(newValue);
};

const handleOpenDialog = (type, item = null) => {
  setDialogType(type);
  if (type === 'post') {
    if (item) {
      setFormData({
        id: item.id,
        title: item.title || '',
        content: item.content || '',
        category: item.category?._id || '',
        image: null
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: '',
        image: null
      });
    }
    setImagePreview(null);
  } else {
    setFormData(item || {});
  }
  setOpenDialog(true);
};

const handleCloseDialog = () => {
  setOpenDialog(false);
  setFormData({});
};

const handleMenuClick = (event, item) => {
  setAnchorEl(event.currentTarget);
  setSelectedItem(item);
};

const handleMenuClose = () => {
  setAnchorEl(null);
  setSelectedItem(null);
};

const handleDelete = async (type, id) => {
  if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
    try {
      switch (type) {
        case 'report':
          await deleteReport(id);
          break;
        case 'post':
          await deletePost(id);
          break;
        case 'category':
          await deleteCategory(id);
          break;
        case 'user':
          await deleteUser(id);
          break;
      }
      fetchTabData();
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
    }
  }
  handleMenuClose();
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData({ ...formData, image: file });
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    switch (dialogType) {
      case 'category':
        try {
          const categoryData = {
            name: formData.name ? formData.name.trim() : '',
            description: formData.description ? formData.description.trim() : ''
          };
          
          if (!categoryData.name || !categoryData.description) {
            setError('Name and description are required');
            return;
          }
          
          if (formData.id) {
            console.log('Updating category:', categoryData);
            await updateCategory(formData.id, categoryData);
          } else {
            console.log('Creating category:', categoryData);
            await createCategory(categoryData);
          }
          console.log('Category operation successful');
        } catch (err) {
          console.error('Category operation failed:', err);
          setError(err.response?.data?.message || 'Failed to save category');
          return;
        }
        break;
      case 'post':
        try {
          if (!formData.title?.trim() || !formData.content?.trim() || !formData.category) {
            setError('Title, content, and category are required');
            return;
          }

          const postData = new FormData();
          postData.append('title', formData.title.trim());
          postData.append('content', formData.content.trim());
          postData.append('category', formData.category);
          postData.append('status', 'published');
            
          // Add the current user as the author
          postData.append('author', user._id);
          
          if (formData.image) {
            postData.append('image', formData.image);
          }

          // Log the FormData contents for debugging
          console.log('Submitting post with data:');
          for (let pair of postData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
          }

          if (formData.id) {
            await updatePost(formData.id, postData);
          } else {
            try {
              const response = await createPost(postData);
              console.log('Post creation response:', response);
              if (response.data.success) {
                handleCloseDialog();
                // Refresh the posts list
                const postsResponse = await getPosts();
                console.log('Posts after refresh:', postsResponse.data);
                if (postsResponse.data.success) {
                  setPosts(postsResponse.data.data || []);
                }
              } else {
                setError(response.data.message || 'Failed to create post');
              }
            } catch (err) {
              console.error('Post creation error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
              });
              setError(err.response?.data?.message || 'Failed to create post');
              return;
            }
          }
        } catch (err) {
          console.error('Post operation failed:', err);
          setError(err.response?.data?.message || 'Failed to save post');
          return;
        }
        break;
      case 'user':
        try {
          const userData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            role: formData.role,
            isApproved: formData.isApproved
          };

          if (formData.id) {
            await updateUser(formData.id, userData);
          } else {
            await createUser(userData);
          }
        } catch (err) {
          console.error('User operation failed:', err);
          setError(err.response?.data?.message || 'Failed to save user');
          return;
        }
        break;
    }
  } catch (err) {
    console.error('Error submitting form:', err);
    setError(err.response?.data?.message || 'An error occurred');
  }
};

const handleUpdateUser = async (id, data) => {
  try {
    setLoading(true);
    const response = await updateUser(id, data);
    if (response.data.success) {
      // Refresh the users list
      const usersResponse = await getUsers();
      if (usersResponse.data.success) {
        setUsers(usersResponse.data.data || []);
      }
      // Show success message
      setSnackbar({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: response.data.message || 'Failed to update user',
        severity: 'error'
      });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    setSnackbar({
      open: true,
      message: err.response?.data?.message || 'Failed to update user',
      severity: 'error'
    });
  } finally {
    setLoading(false);
  }
};

const handleApproveUser = async (userId) => {
  try {
    setLoading(true);
    const response = await updateUser(userId, { isApproved: true });
    if (response.data.success) {
      // Update the users list to reflect the change
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isApproved: true } : user
      ));
      setSnackbar({
        open: true,
        message: 'User approved successfully',
        severity: 'success'
      });
    }
  } catch (err) {
    console.error('Error approving user:', err);
    setSnackbar({
      open: true,
      message: err.response?.data?.message || 'Failed to approve user',
      severity: 'error'
    });
  } finally {
    setLoading(false);
  }
};

const handleBlockUser = async (userId) => {
  await handleUpdateUser(userId, { status: 'blocked' });
};

const handleResolveReport = async (reportId) => {
  try {
    const response = await updateReport(reportId, { status: 'resolved' });
    if (response.data.success) {
      // Update the reports state immediately
      setReports(reports.map(report => 
        report.id === reportId 
          ? { ...report, status: 'resolved' }
          : report
      ));
    } else {
      setError('Failed to resolve report');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to resolve report');
  }
};

const drawer = (
  <Box sx={{ height: '100%', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' }}>
    <Toolbar sx={{ 
      px: 2,
      py: 2,
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      color: 'white'
    }}>
      <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
        Admin Panel
        </Typography>
      </Toolbar>
      <List sx={{ px: 2, py: 2, flex: 1 }}>
        {tabs.map((tab) => (
          <ListItem key={tab.value} disablePadding>
            <ListItemButton
              selected={activeTab === tab.value}
              onClick={() => handleTabChange(tab.value)}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette[tab.color || 'primary'].main, 0.1),
                  color: theme.palette[tab.color || 'primary'].main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette[tab.color || 'primary'].main, 0.15),
                  }
                }
              }}
            >
                     <ListItemIcon sx={{ 
                color: activeTab === tab.value ? theme.palette[tab.color || 'primary'].main : 'text.secondary',
                minWidth: 40
              }}>
                {tab.icon}
              </ListItemIcon>
              <ListItemText 
                primary={tab.label}
                primaryTypographyProps={{ 
                  fontWeight: activeTab === tab.value ? 600 : 400
                }}
              />
              {tab.label === 'Reports' && reports.filter(r => r.status === 'pending').length > 0 && (
                <Chip
                  size="small"
                  label={reports.filter(r => r.status === 'pending').length}
                  color="warning"
                  sx={{ ml: 1 }}
                />
              )}