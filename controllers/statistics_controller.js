var models = require('../models/models.js');

// GET /quizes/statistics
exports.query = function (req, res, next) {
  var filtroBusqueda = "%";
  if(req.query["search"]) {
    filtroBusqueda = "%" + req.query["search"].trim().replace(/\s/g, "%") + "%";
  }
  console.log(filtroBusqueda);
  models.Quiz.count().then(
    function(cantidadPreguntas) {

      models.Comment.count().then(
        function(cantidadComentarios) {

          models.SequelizeBD.query('select avg(cantidad) as promedio from (select "QuizId", count(*) as cantidad from "Comments" group by "QuizId") as resultado').then(
              function(promedioComentariosPregunta) {

                models.SequelizeBD.query('select count(*) as cantidad from "Quizzes" where id not in (select "QuizId" from "Comments")').then(
                  function(cantidadPreguntasSinComentarios) {

                    models.SequelizeBD.query('select count(*) as cantidad from "Quizzes" where id in (select "QuizId" from "Comments")').then(
                      function(cantidadPreguntasConComentarios) {

                        res.render('quizes/statistics.ejs', {
                          cantidadPreguntas: cantidadPreguntas,
                          cantidadComentarios: cantidadComentarios,
                          promedioComentariosPregunta: promedioComentariosPregunta[0].promedio,
                          cantidadPreguntasSinComentarios: cantidadPreguntasSinComentarios[0].cantidad,
                          cantidadPreguntasConComentarios: cantidadPreguntasConComentarios[0].cantidad,
                          errors: null});

                      }
                    ).catch(
                      function(error) {
                        next(error);
                      });
                  }
                ).catch(
                  function(error) {
                    next(error);
                  });
            }
          ).catch(
            function(error) {
              next(error);
            });
        }
      ).catch(
        function(error) {
          next(error);
        });
    }
  ).catch(
    function(error) {
      next(error);
    });
};
