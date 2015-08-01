module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tema',
    { codigo: {
        type: DataTypes.STRING,
      },
      nombre: {
        type: DataTypes.STRING,
      }
    }
  );
}
