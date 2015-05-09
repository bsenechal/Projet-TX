'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Maps = new Module('maps');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Maps.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Maps.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Maps.menus.add({
    title: 'maps example page',
    link: 'maps example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Maps.aggregateAsset('css', 'maps.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Maps.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Maps.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Maps.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Maps;
});
