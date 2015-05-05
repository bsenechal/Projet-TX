'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Deals = new Module('deals');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Deals.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Deals.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Deals.menus.add({
    'title': 'Deals',
    'link': 'all deals'
  });
  Deals.menus.add({
    'roles': ['authenticated'],
    'title': 'Create New Deal',
    'link': 'create deal'
  });

  //Deals.aggregateAsset('js','/packages/system/public/services/menus.js', {group:'footer', absolute:true, weight:-9999});
  //Deals.aggregateAsset('js', 'test.js', {group: 'footer', weight: -1});

  /*
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Deals.settings({'someSetting':'some value'},function (err, settings) {
      //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Deals.settings({'anotherSettings':'some value'});

    // Get settings. Retrieves latest saved settings
    Deals.settings(function (err, settings) {
      //you now have the settings object
    });
    */
  Deals.aggregateAsset('css', 'deals.css');

  return Deals;
});
