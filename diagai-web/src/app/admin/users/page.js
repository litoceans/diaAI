'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
  Skeleton,
  Alert,
  Snackbar,
  TableSortLabel
} from '@mui/material';
import {
  Search,
  MoreVertical,
  UserCog,
  Shield,
  Ban,
  Download,
  Filter,
  Mail,
  Trash2,
  Plus,
  CreditCard
} from 'lucide-react';
import { adminApi } from '@/services/adminApi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false);
  const [creditsAmount, setCreditsAmount] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
        sort_by: sortBy,
        sort_order: sortOrder
      });
      setUsers(data.users);
      setTotalUsers(data.total);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchQuery, sortBy, sortOrder]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleCreditsDialogOpen = () => {
    setCreditsDialogOpen(true);
    handleMenuClose();
  };

  const handleCreditsDialogClose = () => {
    setCreditsDialogOpen(false);
    setCreditsAmount('');
  };

  const handleUpdateCredits = async () => {
    try {
      await adminApi.updateUserCredits(selectedUser._id, parseInt(creditsAmount));
      setSnackbar({
        open: true,
        message: 'Credits updated successfully',
        severity: 'success'
      });
      fetchUsers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'
      });
    } finally {
      handleCreditsDialogClose();
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      await adminApi.deleteUser(selectedUser._id);
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
      fetchUsers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'
      });
    } finally {
      handleMenuClose();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Users Management</Typography>
        <TextField
          placeholder="Search users..."
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'email'}
                    direction={sortBy === 'email' ? sortOrder : 'asc'}
                    onClick={() => handleSort('email')}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'credits'}
                    direction={sortBy === 'credits' ? sortOrder : 'asc'}
                    onClick={() => handleSort('credits')}
                  >
                    Credits
                  </TableSortLabel>
                </TableCell>
                <TableCell>Projects</TableCell>
                <TableCell>Diagrams</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'created_at'}
                    direction={sortBy === 'created_at' ? sortOrder : 'asc'}
                    onClick={() => handleSort('created_at')}
                  >
                    Joined
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from(new Array(rowsPerPage)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton animation="wave" /></TableCell>
                    <TableCell><Skeleton animation="wave" /></TableCell>
                    <TableCell><Skeleton animation="wave" /></TableCell>
                    <TableCell><Skeleton animation="wave" /></TableCell>
                    <TableCell><Skeleton animation="wave" /></TableCell>
                    <TableCell><Skeleton animation="wave" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Alert severity="error">{error}</Alert>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.credits}
                        size="small"
                        color={user.credits > 0 ? "success" : "error"}
                      />
                    </TableCell>
                    <TableCell>{user.total_projects}</TableCell>
                    <TableCell>{user.total_diagrams}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, user)}
                      >
                        <MoreVertical size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalUsers}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleCreditsDialogOpen}>
          <CreditCard size={16} style={{ marginRight: 8 }} />
          Update Credits
        </MenuItem>
        <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
          Delete User
        </MenuItem>
      </Menu>

      <Dialog open={creditsDialogOpen} onClose={handleCreditsDialogClose}>
        <DialogTitle>Update User Credits</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Credits Amount"
            type="number"
            fullWidth
            value={creditsAmount}
            onChange={(e) => setCreditsAmount(e.target.value)}
            helperText="Enter a positive number to add credits, negative to subtract"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreditsDialogClose}>Cancel</Button>
          <Button onClick={handleUpdateCredits} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
