import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, Box, CircularProgress, Alert, Grid, Card, CardContent, CardActions, Stepper, Step, StepLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const WhatsAppPage = () => {
  const { guestId } = useParams();
  const [guest, setGuest] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  const navigate = useNavigate();
  const { isOrganizer } = useAuth();

  const steps = [
    'Preparando QR Code',
    'Conectando ao WhatsApp',
    'Enviando mensagem',
    'Atualizando status'
  ];

  useEffect(() => {
    fetchGuestData();
  }, [guestId]);

  const fetchGuestData = async () => {
    try {
      setLoading(true);
      
      // Buscar detalhes do convidado
      const response = await axios.get(`${API_URL}/guests/${guestId}`);
      setGuest(response.data.guest);
      setEvent(response.data.event);
      
      setError('');
    } catch (err) {
      console.error('Erro ao buscar dados do convidado:', err);
      setError('Não foi possível carregar os dados do convidado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = async () => {
    try {
      setSending(true);
      setActiveStep(0);
      setError('');
      setSuccess(false);
      
      // Etapa 1: Preparando QR Code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActiveStep(1);
      
      // Etapa 2: Conectando ao WhatsApp
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActiveStep(2);
      
      // Etapa 3: Enviando mensagem
      const response = await axios.post(`${API_URL}/whatsapp/send/${guestId}`);
      
      if (response.data.success) {
        setActiveStep(3);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess(true);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Erro ao enviar WhatsApp:', err);
      setError(err.response?.data?.message || 'Erro ao enviar mensagem por WhatsApp. Verifique se o serviço está ativo.');
      setActiveStep(prevStep => prevStep > 0 ? prevStep : 0);
    } finally {
      setSending(false);
    }
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
              Enviar QR Code por WhatsApp
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Evento: {event.name}
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                QR code enviado com sucesso para o WhatsApp do convidado!
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
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      startIcon={<WhatsAppIcon />}
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleSendWhatsApp}
                      disabled={sending || !isOrganizer}
                    >
                      {sending ? 'Enviando...' : 'Enviar por WhatsApp'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="div" gutterBottom>
                      Status do Envio
                    </Typography>
                    
                    {sending ? (
                      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mt: 3 }}>
                        {steps.map((label, index) => (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    ) : success ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                        <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                        <Typography variant="h6" align="center">
                          Mensagem enviada com sucesso!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                          O QR code foi enviado para o WhatsApp do convidado.
                        </Typography>
                      </Box>
                    ) : error ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                        <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                        <Typography variant="h6" align="center">
                          Erro no envio
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                          Ocorreu um erro ao enviar a mensagem. Tente novamente.
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                        <WhatsAppIcon sx={{ fontSize: 60, color: '#00A651', mb: 2 }} />
                        <Typography variant="h6" align="center">
                          Pronto para enviar
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                          Clique no botão "Enviar por WhatsApp" para iniciar o processo.
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
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
                onClick={() => navigate(`/qrcode/${guestId}`)}
              >
                Ver QR Code
              </Button>
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default WhatsAppPage;
