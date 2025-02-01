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
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Skeleton,
  Alert,
  Snackbar,
  TableSortLabel,
  Card,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from '@mui/material';
import {
  Search,
  MoreVertical,
  Filter,
  Image,
  Trash2,
  Eye,
  Download,
  Film
} from 'lucide-react';
import { adminApi } from '@/services/adminApi';

const statusColors = {
  completed: 'success',
  failed: 'error',
  processing: 'warning',
  pending: 'info'
};

export default function AdminDiagrams() {
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDiagrams, setTotalDiagrams] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedDiagram, setSelectedDiagram] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [previewDialog, setPreviewDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchDiagrams = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getDiagrams({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
        status: statusFilter,
        type: typeFilter,
        sort_by: sortBy,
        sort_order: sortOrder
      });
      setDiagrams(data.diagrams);
      setTotalDiagrams(data.total);
    } catch (err) {
      console.error('Error fetching diagrams:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagrams();
  }, [page, rowsPerPage, searchQuery, statusFilter, typeFilter, sortBy, sortOrder]);

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

  const handleMenuClick = (event, diagram) => {
    setAnchorEl(event.currentTarget);
    setSelectedDiagram(diagram);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDiagram(null);
  };

  const handlePreviewOpen = () => {
    setPreviewDialog(true);
    handleMenuClose();
  };

  const handlePreviewClose = () => {
    setPreviewDialog(false);
  };

  const handleDeleteDiagram = async () => {
    if (!window.confirm('Are you sure you want to delete this diagram? This action cannot be undone.')) {
      return;
    }
    
    try {
      await adminApi.deleteDiagram(selectedDiagram._id);
      setSnackbar({
        open: true,
        message: 'Diagram deleted successfully',
        severity: 'success'
      });
      fetchDiagrams();
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

  const handleDownloadDiagram = () => {
    const link = document.createElement('a');
    link.href = selectedDiagram.url;
    link.download = `${selectedDiagram.title || 'diagram'}.${selectedDiagram.type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleMenuClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Diagrams Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search diagrams..."
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
          />
          <Button
            variant="outlined"
            startIcon={<Filter size={20} />}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          >
            Filter
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Preview</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'title'}
                    direction={sortBy === 'title' ? sortOrder : 'asc'}
                    onClick={() => handleSort('title')}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>User</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'type'}
                    direction={sortBy === 'type' ? sortOrder : 'asc'}
                    onClick={() => handleSort('type')}
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'status'}
                    direction={sortBy === 'status' ? sortOrder : 'asc'}
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'created_at'}
                    direction={sortBy === 'created_at' ? sortOrder : 'asc'}
                    onClick={() => handleSort('created_at')}
                  >
                    Created
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from(new Array(rowsPerPage)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="rectangular" width={50} height={50} /></TableCell>
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
                  <TableCell colSpan={7}>
                    <Alert severity="error">{error}</Alert>
                  </TableCell>
                </TableRow>
              ) : diagrams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">
                      No diagrams found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                diagrams.map((diagram) => (
                  <TableRow key={diagram._id} hover>
                    <TableCell>
                      <Card sx={{ width: 50, height: 50, cursor: 'pointer' }} onClick={() => {
                        setSelectedDiagram(diagram);
                        setPreviewDialog(true);
                      }}>
                        <CardMedia
                          component="img"
                          height="50"
                          image={diagram.thumbnail_url || diagram.url}
                          alt={diagram.title}
                          sx={{ objectFit: 'cover' }}
                        />
                      </Card>
                    </TableCell>
                    <TableCell>{diagram.title || 'Untitled'}</TableCell>
                    <TableCell>{diagram.user?.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={diagram.type === 'gif' ? <Film size={14} /> : <Image size={14} />}
                        label={diagram.type}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={diagram.status}
                        size="small"
                        color={statusColors[diagram.status]}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(diagram.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, diagram)}
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
          count={totalDiagrams}
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
        <MenuItem onClick={handlePreviewOpen}>
          <Eye size={16} style={{ marginRight: 8 }} />
          Preview
        </MenuItem>
        <MenuItem onClick={handleDownloadDiagram}>
          <Download size={16} style={{ marginRight: 8 }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleDeleteDiagram} sx={{ color: 'error.main' }}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="image">Image</MenuItem>
              <MenuItem value="gif">GIF</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Menu>

      <Dialog
        open={previewDialog}
        onClose={handlePreviewClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedDiagram?.title || 'Untitled'}
          <IconButton
            aria-label="close"
            onClick={handlePreviewClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Eye size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedDiagram && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <img
                src={selectedDiagram.url}
                alt={selectedDiagram.title}
                style={{ maxWidth: '100%', maxHeight: '70vh' }}
              />
            </Box>
          )}
        </DialogContent>
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
