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
  models.Quiz.findAll(/*{ include: [models.Tema]}*/).then(
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
  models.Tema.findAll().then(
    function(temas) {
      var quiz = models.Quiz.build( // crea objeto quiz
        {pregunta: "", respuesta: "", tema: ""}
      );

      res.render('quizes/new', {quiz: quiz, temas: temas, errors: null});
    }
  ).catch(
    function(error) {
      next(error);
    });
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  var errors = quiz.validate();
    if (errors) {
      console.log(errors);
        res.render('quizes/new', {quiz: quiz, errors: errors});
      } else {
        // guarda en BD los campos pregunta y respuesta de quiz
        quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(
          function() {
            res.redirect('/quizes');
          })
      }
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  models.Tema.findAll().then(
    function(temas) {
      var quiz = req.quiz; // autoload de instancia de quiz
      res.render('quizes/edit', {quiz: quiz, temas: temas, errors: null});
    }
  ).catch(
    function(error) {
      next(error);
    });
};


// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  var errors = req.quiz.validate();
  if (errors) {
    console.log(errors);
      res.render('quizes/edit', {quiz: req.quiz, errors: errors});
    } else {
      // guarda en BD los campos pregunta y respuesta de quiz
      req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(
        function() {
          res.redirect('/quizes');
        })
    }
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then(
    function() {
      res.redirect('/quizes');
    }).catch(
      function(error) {
        next(error);
      }
    );
};
