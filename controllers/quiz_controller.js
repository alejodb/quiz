var models = require('../models/models.js');

exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if(quiz) {
        req.quiz = quiz;
        next();
      }
      else {
        next(new Error('No existe quizId='+quizId));
      }
    }
  ).catch(
    function(error) {
      next(error);
    }
  );
};

// GET /quizes
exports.index = function (req, res) {
  models.Quiz.findAll().then(
    function(quizes) {
      res.render('quizes/index.ejs', {quizes: quizes, errors: null});
    }
  ).catch(
    function(error) {
      next(error);
    });
};

// GET /quizes/:id
exports.show = function(req, res) {
    res.render('quizes/show', { quiz: req.quiz, errors: null});
};

// GET /quizes/answer
exports.answer = function (req, res) {
    if(req.query.respuesta === req.quiz.respuesta) {
      res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto', errors: null});
    } else {
      res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto', errors: null});
    }
  };

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea objeto quiz
    {pregunta: "", respuesta: ""}
  );

  res.render('quizes/new', {quiz: quiz, errors: null});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  errors = quiz.validate();
    if (errors) {
      console.log(errors);
        res.render('quizes/new', {quiz: quiz, errors: errors});
      } else {
        // guarda en BD los campos pregunta y respuesta de quiz
        quiz.save({fields: ["pregunta", "respuesta"]}).then(
          function() {
            res.redirect('/quizes');
          })
      }
};
