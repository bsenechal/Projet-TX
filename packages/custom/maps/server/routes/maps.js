'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Maps, app, auth, database) {

  app.get('/maps/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/maps/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/maps/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/maps/example/render', function(req, res, next) {
    Maps.render('index', {
      package: 'maps'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
