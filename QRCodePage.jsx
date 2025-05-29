import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, Box, CircularProgress, Alert, Grid, Card, CardContent, CardActions } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import QrCodeIcon from '@mui/icons-material/QrCode';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const QRCodePage = () => {
  const { guestId } = useParams();
  const [guest, setGuest] = useState(null);
  const [event, setEvent] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [whatsappStatus, setWhatsappStatus] = useState('idle'); // idle, sending, success, error
  
  const navigate = useNavigate();
  const { isOrganizer } = useAuth();

  useEffect(() => {
    fetchGuestAndQRCode();
  }, [guestId]);

  const fetchGuestAndQRCode = async () => {
    try {
      setLoading(true);
      
      // Buscar detalhes do convidado
      const guestResponse = await axios.get(`${API_URL}/guests/${guestId}`);
      setGuest(guestResponse.data.guest);
      setEvent(guestResponse.data.event);
      
      // Gerar QR code se ainda não existir
      if (!guestResponse.data.guest.qrCodeData) {
        await axios.post(`${API_URL}/guests/${guestId}/generate-qrcode`);
      }
      
      // Buscar imagem do QR code
      const qrResponse = await axios.get(`${API_URL}/qrcodes/generate/${guestId}`, {
        responseType: 'blob'
      });
      
      // Converter blob para URL de dados
      const reader = new FileReader();
      reader.readAsDataURL(qrResponse.data);
      reader.onloadend = () => {
        setQrCodeImage(reader.result);
        setLoading(false);
      };
      
      setError('');
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Não foi possível carregar os dados do QR code. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleSendWhatsApp = async () => {
    try {
      setWhatsappStatus('sending');
      
      // Simular envio por WhatsApp (em uma implementação real, isso chamaria a API de automação)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar status do convidado para "invited"
      await axios.put(`${API_URL}/guests/${guestId}`, {
        status: 'invited'
      });
      
      // Atualizar dados do convidado localmente
      setGuest({
        ...guest,
        status: 'invited'
      });
      
      setWhatsappStatus('success');
    } catch (err) {
      console.error('Erro ao enviar WhatsApp:', err);
      setWhatsappStatus('error');
    }
  };

  const handleDownloadQRCode = () => {
    // Criar um link temporário para download
    const link = document.createElement('a');
    link.href = qrCodeImage;
    link.download = `qrcode-${guest.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !guest) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {guest && event && (
        <>
          <Paper sx={{ p: 4, mb: 4, borderLeft: '4px solid #00A651' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              QR Code do Convidado
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Evento: {event.name}
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {whatsappStatus === 'success' && (
              <Alert severity="success" sx={{ mb: 3 }}>
                QR code enviado com sucesso para o WhatsApp do convidado!
              </Alert>
            )}
            
            {whatsappStatus === 'error' && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Erro ao enviar QR code por WhatsApp. Tente novamente mais tarde.
              </Alert>
            )}
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="div" gutterBottom>
                      Informações do Convidado
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>Nome:</strong> {guest.name}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Telefone:</strong> {guest.phone}
                      </Typography>
                      {guest.email && (
                        <Typography variant="body1" gutterBottom>
                          <strong>Email:</strong> {guest.email}
                        </Typography>
                      )}
                      <Typography variant="body1" gutterBottom>
                        <strong>Status:</strong> {
                          guest.status === 'pending' ? 'Pendente' :
                          guest.status === 'invited' ? 'Convidado' :
                          guest.status === 'confirmed' ? 'Confirmado' :
                          guest.status === 'checked-in' ? 'Check-in realizado' :
                          guest.status === 'cancelled' ? 'Cancelado' : guest.status
                        }
                      </Typography>
                      {guest.notes && (
                        <Typography variant="body1" gutterBottom>
                          <strong>Observações:</strong> {guest.notes}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      startIcon={<WhatsAppIcon />}
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleSendWhatsApp}
                      disabled={whatsappStatus === 'sending' || !isOrganizer}
                    >
                      {whatsappStatus === 'sending' ? 'Enviando...' : 'Enviar por WhatsApp'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h5" component="div" gutterBottom>
                      QR Code
                    </Typography>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <img 
                          src={qrCodeImage} 
                          alt="QR Code do convidado" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '250px',
                            border: '1px solid #333',
                            padding: '8px',
                            backgroundColor: '#fff'
                          }} 
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Escaneie este QR code na entrada do evento
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      startIcon={<DownloadIcon />}
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={handleDownloadQRCode}
                      disabled={loading || !qrCodeImage}
                    >
                      Download QR Code
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
              >
                Voltar
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<QrCodeIcon />}
                onClick={() => navigate(`/events/${event._id}/guests`)}
              >
                Gerenciar Convidados
              </Button>
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default QRCodePage;
