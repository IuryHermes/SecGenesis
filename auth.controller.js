const User = require('../models/user.model');
const { generateToken } = require('../middleware/auth.middleware');

// Controlador de autenticação
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está em uso.'
      });
    }

    // Criar novo usuário
    const user = new User({
      name,
      email,
      password,
      role: role || 'organizer', // Padrão: organizador
      phone
    });

    // Salvar usuário
    await user.save();

    // Gerar token JWT
    const token = generateToken(user);

    // Retornar resposta
    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário. Tente novamente mais tarde.'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o email e senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça email e senha.'
      });
    }

    // Buscar usuário pelo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.'
      });
    }

    // Verificar se o usuário está ativo
    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'Usuário desativado. Contate o administrador.'
      });
    }

    // Verificar senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.'
      });
    }

    // Atualizar último login
    user.lastLogin = Date.now();
    await user.save();

    // Gerar token JWT
    const token = generateToken(user);

    // Retornar resposta
    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login. Tente novamente mais tarde.'
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // O usuário já está disponível em req.user graças ao middleware de autenticação
    res.status(200).json({
      success: true,
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Erro ao obter perfil:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter perfil. Tente novamente mais tarde.'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const userId = req.user._id;

    // Verificar se o email já está em uso por outro usuário
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Este email já está em uso.'
        });
      }
    }

    // Atualizar usuário
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        name: name || req.user.name,
        phone: phone || req.user.phone,
        email: email || req.user.email,
        updatedAt: Date.now()
      },
      { new: true }
    );

    // Retornar resposta
    res.status(200).json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user: updatedUser.toJSON()
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil. Tente novamente mais tarde.'
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Buscar usuário
    const user = await User.findById(userId);

    // Verificar senha atual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta.'
      });
    }

    // Atualizar senha
    user.password = newPassword;
    await user.save();

    // Retornar resposta
    res.status(200).json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao alterar senha:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao alterar senha. Tente novamente mais tarde.'
    });
  }
};
