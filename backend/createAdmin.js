// backend/createAdmin.js
// Ejecuta este script con: node createAdmin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Tu modelo de usuario
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  phone: String,
  address: String,
  avatar: String,
  googleId: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/tu_base_de_datos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function createAdmin() {
  try {
    // Verificar si ya existe
    const existingAdmin = await User.findOne({ email: 'admin@nova.com' });
    
    if (existingAdmin) {
      console.log('❌ El admin ya existe');
      
      // Actualizar a admin si no lo es
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Usuario actualizado a admin');
      }
      
      process.exit(0);
      return;
    }

    // Crear nuevo admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = new User({
      name: 'Administrador',
      email: 'admin@nova.com',
      password: hashedPassword,
      role: 'admin',
      phone: '1234567890',
      address: 'Dirección Admin'
    });

    await admin.save();
    
    console.log('✅ Admin creado exitosamente!');
    console.log('📧 Email: admin@nova.com');
    console.log('🔑 Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();