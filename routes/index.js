var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: null});
});

router.get('/author', function(req, res) {
  res.render('author', { nombre: 'Alejandro', foto: '/images/bart2.gif', errors: null });
});

// Definición de rutas de sesión
router.get('/login', sessionController.new); // formulario login
router.post('/login', sessionController.create); // crea sesión
router.get('/logout', sessionController.destroy); // destruir sesión

// Autoload de comandos
router.param('quizId', quizController.load); // autoload :quizId
router.param('commentId', commentController.load); // autoload :commentId

// Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
// Entrar a crear quiz
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
// Crear quiz
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
// Entrar a editar quiz
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
// Actualizar quiz
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
// Eliminar quiz
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

module.exports = router;
