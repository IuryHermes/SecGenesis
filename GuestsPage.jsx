import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, TextField, Box, CircularProgress, Alert, Grid, Tabs, Tab, Divider, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const GuestsPage = () => {
  const { id: eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [guests, setGuests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    invited: 0,
    confirmed: 0,
    cancelled: 0,
    checkedIn: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [addGuestOpen, setAddGuestOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [bulkData, setBulkData] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState(null);
  
  const navigate = useNavigate();
  const { isOrganizer } = useAuth();

  useEffect(() => {
    fetchEventAndGuests();
  }, [eventId]);

  const fetchEventAndGuests = async () => {
    try {
      setLoading(true);
      // Buscar detalhes do evento
      const eventResponse = await axios.get(`${API_URL}/events/${eventId}`);
      setEvent(eventResponse.data.event);
      setStats(eventResponse.data.stats);
      
      // Buscar convidados do evento
      const guestsResponse = await axios.get(`${API_URL}/guests/event/${eventId}`);
      setGuests(guestsResponse.data.guests);
      setError('');
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddGuestOpen = () => {
    setAddGuestOpen(true);
  };

  const handleAddGuestClose = () => {
    setAddGuestOpen(false);
    setNewGuest({
      name: '',
      phone: '',
      email: '',
      notes: ''
    });
  };

  const handleBulkImportOpen = () => {
    setBulkImportOpen(true);
  };

  const handleBulkImportClose = () => {
    setBulkImportOpen(false);
    setBulkData('');
  };

  const handleNewGuestChange = (e) => {
    setNewGuest({
      ...newGuest,
      [e.target.name]: e.target.value
    });
  };

  const handleAddGuest = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/guests`, {
        ...newGuest,
        eventId
      });
      
      // Adicionar novo convidado à lista
      setGuests([...guests, response.data.guest]);
      
      // Atualizar estatísticas
      setStats({
        ...stats,
        total: stats.total + 1,
        pending: stats.pending + 1
      });
      
      handleAddGuestClose();
    } catch (err) {
      console.error('Erro ao adicionar convidado:', err);
      setError(err.response?.data?.message || 'Erro ao adicionar convidado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async () => {
    try {
      setLoading(true);
      
      // Processar dados em massa
      const lines = bulkData.split('\n').filter(line => line.trim());
      const guestsData = lines.map(line => {
        const [name, phone, email = '', notes = ''] = line.split(',').map(item => item.trim());
        return { name, phone, email, notes };
      });
      
      // Enviar para a API
      const response = await axios.post(`${API_URL}/guests/bulk`, {
        eventId,
        guests: guestsData
      });
      
      // Atualizar lista de convidados e estatísticas
      fetchEventAndGuests();
      handleBulkImportClose();
    } catch (err) {
      console.error('Erro ao importar convidados:', err);
      setError(err.response?.data?.message || 'Erro ao importar convidados. Verifique o formato dos dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (guest) => {
    setGuestToDelete(guest);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!guestToDelete) return;
    
    try {
      await axios.delete(`${API_URL}/guests/${guestToDelete._id}`);
      
      // Remover convidado da lista
      setGuests(guests.filter(g => g._id !== guestToDelete._id));
      
      // Atualizar estatísticas
      setStats({
        ...stats,
        total: stats.total - 1,
        [guestToDelete.status]: stats[guestToDelete.status] - 1
      });
      
      setDeleteDialogOpen(false);
      setGuestToDelete(null);
    } catch (err) {
      console.error('Erro ao excluir convidado:', err);
      setError('Não foi possível excluir o convidado. Tente novamente mais tarde.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setGuestToDelete(null);
  };

  const handleGenerateQRCode = async (guestId) => {
    try {
      await axios.post(`${API_URL}/guests/${guestId}/generate-qrcode`);
      navigate(`/qrcode/${guestId}`);
    } catch (err) {
      console.error('Erro ao gerar QR code:', err);
      setError('Não foi possível gerar o QR code. Tente novamente mais tarde.');
    }
  };

  const handleSendWhatsApp = async (guest) => {
    try {
      // Primeiro, garantir que o QR code foi gerado
      await axios.post(`${API_URL}/guests/${guest._id}/generate-qrcode`);
      
      // Redirecionar para a página de envio de WhatsApp
      navigate(`/whatsapp/${guest._id}`);
    } catch (err) {
      console.error('Erro ao preparar envio por WhatsApp:', err);
      setError('Não foi possível preparar o envio por WhatsApp. Tente novamente mais tarde.');
    }
  };

  // Filtrar convidados com base no termo de busca e na aba selecionada
  const filteredGuests = guests.filter(guest => {
    // Filtro de busca
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm) ||
      (guest.email && guest.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtro de status (aba)
    let matchesTab = true;
    if (tabValue === 1) matchesTab = guest.status === 'pending';
    if (tabValue === 2) matchesTab = guest.status === 'invited';
    if (tabValue === 3) matchesTab = guest.status === 'confirmed';
    if (tabValue === 4) matchesTab = guest.status === 'checked-in';
    if (tabValue === 5) matchesTab = guest.status === 'cancelled';
    
    return matchesSearch && matchesTab;
  });

  // Função para obter o chip de status
  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pendente" size="small" color="default" />;
      case 'invited':
        return <Chip label="Convidado" size="small" color="primary" />;
      case 'confirmed':
        return <Chip label="Confirmado" size="small" color="success" />;
      case 'checked-in':
        return <Chip label="Check-in" size="small" color="info" />;
      case 'cancelled':
        return <Chip label="Cancelado" size="small" color="error" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  if (loading && !event) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {event && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {event.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Gerenciamento de Convidados
              </Typography>
            </Box>
            {isOrganizer && (
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<PersonAddIcon />}
                  onClick={handleAddGuestOpen}
                  sx={{ mr: 1 }}
                >
                  Adicionar
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileUploadIcon />}
                  onClick={handleBulkImportOpen}
                >
                  Importar
                </Button>
              </Box>
            )}
          </Box>

          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label={`Todos (${stats.total})`} />
              <Tab label={`Pendentes (${stats.pending})`} />
              <Tab label={`Convidados (${stats.invited})`} />
              <Tab label={`Confirmados (${stats.confirmed})`} />
              <Tab label={`Check-in (${stats.checkedIn})`} />
              <Tab label={`Cancelados (${stats.cancelled})`} />
            </Tabs>
          </Paper>

          <Paper sx={{ p: 3, mb: 4 }}>
            <TextField
              fullWidth
              label="Buscar convidados"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 3 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredGuests.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <PersonAddIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Nenhum convidado encontrado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? 'Tente ajustar sua busca ou adicione novos convidados.' : 'Comece adicionando convidados ao seu evento.'}
                </Typography>
                {isOrganizer && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    onClick={handleAddGuestOpen}
                    sx={{ mt: 2 }}
                  >
                    Adicionar Convidado
                  </Button>
                )}
              </Box>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #333' }}>
                      <th style={{ textAlign: 'left', padding: '12px 16px' }}>Nome</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px' }}>Telefone</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px' }}>Status</th>
                      <th style={{ textAlign: 'center', padding: '12px 16px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuests.map((guest) => (
                      <tr key={guest._id} style={{ borderBottom: '1px solid #333' }}>
                        <td style={{ padding: '12px 16px' }}>{guest.name}</td>
                        <td style={{ padding: '12px 16px' }}>{guest.phone}</td>
                        <td style={{ padding: '12px 16px' }}>{guest.email || '-'}</td>
                        <td style={{ padding: '12px 16px' }}>{getStatusChip(guest.status)}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <IconButton
                            color="primary"
                            onClick={() => handleGenerateQRCode(guest._id)}
                            title="Gerar QR Code"
                          >
                            <QrCodeIcon />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={() => handleSendWhatsApp(guest)}
                            title="Enviar por WhatsApp"
                          >
                            <WhatsAppIcon />
                          </IconButton>
                          {isOrganizer && (
                            <>
                              <IconButton
                                color="primary"
                                onClick={() => navigate(`/guests/edit/${guest._id}`)}
                                title="Editar"
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteClick(guest)}
                                title="Excluir"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}
          </Paper>
        </>
      )}

      {/* Diálogo para adicionar convidado */}
      <Dialog open={addGuestOpen} onClose={handleAddGuestClose} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Convidado</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Nome"
                name="name"
                value={newGuest.name}
                onChange={handleNewGuestChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Telefone"
                name="phone"
                value={newGuest.phone}
                onChange={handleNewGuestChange}
                placeholder="Ex: 11999999999"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newGuest.email}
                onChange={handleNewGuestChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                name="notes"
                multiline
                rows={2}
                value={newGuest.notes}
                onChange={handleNewGuestChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <D
(Content truncated due to size limit. Use line ranges to read in chunks)