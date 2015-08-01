var path = require('path');

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

var Sequelize = require('sequelize');

var sequelize = new Sequelize(DB_name, user, pwd,
                      {
                        dialect: protocol,
                        protocol: protocol,
                        port: port,
                        host: host,
                        storage: storage, // solo SQLite (.env)
                        omitNull: true // solo Postgres
                      }
                    );

var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
var Tema = sequelize.import(path.join(__dirname, 'tema'));

//Tema.hasMany(Quiz, { foreignKey: 'tema', allowNull: false });
//Quiz.belongsTo(Tema, { as: 'tema', constraints: false });

exports.Quiz = Quiz;
exports.Tema = Tema;

sequelize.sync({force: true}).then(function() {
  Tema.count().then(function (count){
    if(count === 0) {
      Tema.create({ codigo: 'otro',
                    nombre: 'Otro'
                  });
      Tema.create({ codigo: 'humanidades',
                    nombre: 'Humanidades'
                  });
      Tema.create({ codigo: 'ocio',
                    nombre: 'Ocio'
                  });
      Tema.create({ codigo: 'ciencia',
                    nombre: 'Ciencia'
                  });
      Tema.create({ codigo: 'tecnologia',
                    nombre: 'Tecnologia'
                  })
          .then(function(){console.log('Tabla Tema inicializada')});
    };
  });

  Quiz.count().then(function (count){
    if(count === 0) {
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma',
                    tema: 'otro'
                  });
      Quiz.create({ pregunta: 'Capital de Portugal',
                    respuesta: 'Lisboa',
                    tema: 'otro'
                  })
          .then(function(){console.log('Tabla Quiz inicializada')});
    };
  });
});
