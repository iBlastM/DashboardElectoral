const Admin = require('./Admin');
const Pin = require('./Pin');

// ── Relaciones ──
Admin.hasMany(Pin, { foreignKey: 'admin_id', as: 'pins' });
Pin.belongsTo(Admin, { foreignKey: 'admin_id', as: 'admin' });

module.exports = { Admin, Pin };
