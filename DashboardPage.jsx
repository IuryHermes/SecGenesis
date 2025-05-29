import React from 'react';
import { Box, Container, Typography, Paper, Grid, Button, Card, CardContent, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SecurityIcon from '@mui/icons-material/Security';

const DashboardPage = () => {
  const { user, isOrganizer } = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 4, borderLeft: '4px solid #00A651' }}>
        <Typography variant="h4" gutterBottom>
          Bem-vindo ao SecGenesis, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sistema de controle de acesso com QR code para eventos
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Cards de ação rápida */}
        {isOrganizer && (
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <EventIcon sx={{ fontSize: 40, color: '#00A651', mb: 2 }} />
                <Typography variant="h5" component="div" gutterBottom>
                  Criar Evento
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Crie um novo evento e comece a gerenciar seus convidados.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="large" 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate('/events/create')}
                >
                  Criar Evento
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )}

        <Grid item xs={12} md={isOrganizer ? 4 : 6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <PeopleIcon sx={{ fontSize: 40, color: '#00A651', mb: 2 }} />
              <Typography variant="h5" component="div" gutterBottom>
                Gerenciar Eventos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Visualize e gerencie seus eventos e convidados.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="large" 
                variant="contained" 
                fullWidth
                onClick={() => navigate('/events')}
              >
                Ver Eventos
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={isOrganizer ? 4 : 6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <SecurityIcon sx={{ fontSize: 40, color: '#00A651', mb: 2 }} />
              <Typography variant="h5" component="div" gutterBottom>
                Controle de Acesso
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Escaneie QR codes e controle o acesso dos convidados.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="large" 
                variant="outlined" 
                fullWidth
                onClick={() => window.open('https://expo.dev/@secgenesis/secgenesis-mobile', '_blank')}
              >
                Abrir App de Leitura
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Seção de estatísticas */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recursos do Sistema
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
              <EventIcon sx={{ fontSize: 40, color: '#00A651', mb: 1 }} />
              <Typography variant="h6">Eventos</Typography>
              <Typography variant="body2" color="text.secondary">
                Crie e gerencie múltiplos eventos
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
              <PeopleIcon sx={{ fontSize: 40, color: '#00A651', mb: 1 }} />
              <Typography variant="h6">Convidados</Typography>
              <Typography variant="body2" color="text.secondary">
                Cadastre convidados individualmente ou em lote
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
              <QrCodeIcon sx={{ fontSize: 40, color: '#00A651', mb: 1 }} />
              <Typography variant="h6">QR Codes</Typography>
              <Typography variant="body2" color="text.secondary">
                Gere QR codes únicos para cada convidado
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
              <SecurityIcon sx={{ fontSize: 40, color: '#00A651', mb: 1 }} />
              <Typography variant="h6">Segurança</Typography>
              <Typography variant="body2" color="text.secondary">
                Controle de acesso seguro e em tempo real
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;
