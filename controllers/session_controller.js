// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next) {
  if(req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// GET /login -- Formulario de login
exports.new = function(req, res) {
  var errors = req.session.errors || null;
  req.session.errors = null;

  res.render('sessions/new', {errors: errors});
};

// POST /login -- Crear la sesión
exports.create = function(req, res) {
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user) {
    if(error) {
      req.session.errors = {"login": [error]};
      res.redirect("/login");
      return;
    }

    // Crear req.session.user y guardar campos id y username
    // La sesión se define por la existencia de: req.session.user
    req.session.user = {id:user.id, username:user.username};
    req.session.lasttransaction = new Date().getTime() / 1000;

    // Redirecciona a path anterior a login
    res.redirect(req.session.redir.toString());
  });
};

// DELETE /logout -- Destruir sesión
exports.destroy = function(req, res) {
  delete req.session.user;
  res.redirect(req.session.redir.toString()); // redirect a path anterior a login
}
