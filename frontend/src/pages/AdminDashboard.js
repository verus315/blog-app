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