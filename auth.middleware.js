const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Configuração do JWT
const JWT_SECRET = process.env.JWT_SECRET || 'secgenesis-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Middleware de autenticação
exports.authenticate = async (req, res, next) => {
  try {
    // Verificar se o token está presente no header
    const token = req.header('x-auth-token');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acesso negado. Token não fornecido.' 
      });
    }
    
    // Verificar e decodificar o token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar o usuário pelo ID
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuário não encontrado ou token inválido.' 
      });
    }
    
    // Verificar se o usuário está ativo
    if (!user.active) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuário desativado. Contate o administrador.' 
      });
    }
    
    // Adicionar o usuário ao objeto de requisição
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expirado. Faça login novamente.' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro no servidor. Tente novamente mais tarde.' 
    });
  }
};

// Middleware para verificar permissões de admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso negado. Permissão de administrador necessária.' 
    });
  }
  
  next();
};

// Middleware para verificar permissões de organizador ou admin
exports.isOrganizerOrAdmin = (req, res, next) => {
  if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso negado. Permissão de organizador ou administrador necessária.' 
    });
  }
  
  next();
};

// Middleware para verificar permissões de segurança, organizador ou admin
exports.isSecurityOrAbove = (req, res, next) => {
  if (!['security', 'organizer', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso negado. Permissão insuficiente.' 
    });
  }
  
  next();
};

// Função para gerar token JWT
exports.generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};
