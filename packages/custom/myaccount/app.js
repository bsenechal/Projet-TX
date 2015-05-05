'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Myaccount = new Module('myaccount');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Myaccount.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Myaccount.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Myaccount.menus.add({
    title: 'My Account',
    link: 'My Account',
    roles: ['authenticated'],
    menu: 'main'
  });

  Myaccount.aggregateAsset('css', 'myaccount.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Myaccount.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Myaccount.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Myaccount.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Myaccount;
});
