'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Search,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Filter,
  Image,
  Film,
} from 'lucide-react';
import { adminApi } from '@/services/adminApi';
import { useRouter } from 'next/navigation';

export default function AdminProjects() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalProjects, setTotalProjects] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getProjects({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      setProjects(response.projects);
      setTotalProjects(response.total);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, rowsPerPage, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await adminApi.deleteProject(selectedProject.id);
      setDeleteDialogOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
    }
  };

  const handleViewProject = (projectId) => {
    handleMenuClose();
    router.push(`/admin/projects/${projectId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading && projects.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ py: 4 }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h4">All Projects</Typography>
          <Button
            variant="outlined"
            startIcon={<Download size={20} />}
            onClick={() => console.log('Downloading report...')}
          >
            Export Report
          </Button>
        </Box>

        {/* Search and Filter */}
        <Paper
          component={motion.div}
          variants={itemVariants}
          sx={{ p: 2, mb: 3 }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        </Paper>

        {/* Projects Table */}
        <Paper
          component={motion.div}
          variants={itemVariants}
          sx={{ width: '100%', overflow: 'hidden' }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project Name</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell align="center">Total Diagrams</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Typography variant="body2">{project.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {project.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{project.user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {project.user.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{project.diagrams_count}</TableCell>
                    <TableCell>
                      <Chip
                        label={project.status}
                        color={project.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(project.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(project.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, project)}
                      >
                        <MoreVertical size={20} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalProjects}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewProject(selectedProject?.id)}>
          <Eye size={20} style={{ marginRight: 8 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Trash2 size={20} style={{ marginRight: 8 }} />
          Delete Project
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this project? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
