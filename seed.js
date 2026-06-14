require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./db');
const { Admin, Pin } = require('./models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL.');

    // Sincronizar tablas
    await sequelize.sync({ alter: false });
    console.log('✅ Tablas sincronizadas.');

    // Buscar admin existente
    const existe = await Admin.findOne({ where: { email: 'admin@soymetrix.com' } });
    if (existe) {
      console.log('⚠️  El admin admin@soymetrix.com ya existe. Se omite la creación.');
      console.log(`   ID: ${existe.id}, Email: ${existe.email}`);
      process.exit(0);
    }

    // Crear admin por defecto
    const hash = await bcrypt.hash('123456789', 10);
    const admin = await Admin.create({
      email: 'admin@soymetrix.com',
      password_hash: hash,
      nombre: 'Administrador Metrix'
    });

    console.log('✅ Admin creado exitosamente:');
    console.log(`   Email:    admin@soymetrix.com`);
    console.log(`   Password: 123456789`);
    console.log(`   ID:       ${admin.id}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err.message);
    process.exit(1);
  }
}

seed();
