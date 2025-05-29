import React from 'react';
import { Box, Container, Typography, TextField, Button, Paper, Grid, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/bg-events.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            component="h1"
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: '#00A651',
              mb: 4,
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            SecGenesis
          </Typography>
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
};

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        width: '100%',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Login
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Entre com suas credenciais para acessar o sistema
      </Typography>

      {(formError || error) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError || error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Senha"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Entrar
        </Button>
        <Grid container>
          <Grid item xs>
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/forgot-password')}
              sx={{ textTransform: 'none' }}
            >
              Esqueceu a senha?
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/register')}
              sx={{ textTransform: 'none' }}
            >
              Não tem uma conta? Registre-se
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [formError, setFormError] = useState('');
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validação básica
    if (formData.password !== formData.confirmPassword) {
      setFormError('As senhas não coincidem.');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'organizer', // Papel padrão para novos usuários
      });
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        width: '100%',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Registrar
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Crie sua conta para acessar o sistema
      </Typography>

      {(formError || error) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError || error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Nome Completo"
          name="name"
          autoComplete="name"
          autoFocus
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="phone"
          label="Telefone"
          name="phone"
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Senha"
          type="password"
          id="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirmar Senha"
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Registrar
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none' }}
            >
              Já tem uma conta? Faça login
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simulação de envio de email de recuperação
    // Em uma implementação real, isso chamaria a API
    if (email) {
      setSubmitted(true);
    } else {
      setError('Por favor, informe seu email.');
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        width: '100%',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Recuperar Senha
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Informe seu email para receber instruções de recuperação
      </Typography>

      {submitted ? (
        <>
          <Alert severity="success" sx={{ mb: 2 }}>
            Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.
          </Alert>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Voltar para Login
          </Button>
        </>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Enviar Instruções
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none' }}
              >
                Voltar para Login
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export { AuthLayout, LoginPage, RegisterPage, ForgotPasswordPage };
export default AuthLayout;
