'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Deal = mongoose.model('Deal'),
  async = require('async'),
  Tag = mongoose.model('Tag'),
//  Comment = mongoose.model('Comment'),
  _ = require('lodash');

var keyword_extractor = require("keyword-extractor");

/**
 * Find deal by id
 */
exports.deal = function(req, res, next, id) {
  Deal.load(id, function(err, deal) {
    if (err) return next(err);
    if (!deal) return next(new Error('Failed to load deal ' + id));
    req.deal = deal;
    next();
  });
};

/**
 * Create an deal
 */
exports.create = function(req, res) {
  var deal = new Deal(req.body);

  deal.user = req.user;

  async.parallel([
    function(callback) {
      tagsManager(deal, 'create');

      callback();
    },
    function(callback) {
      deal.save(function(err) {
        if (err) {
          return res.status(500).json({
            error: 'Cannot save the deal'
          });
      }
    });
      res.json(deal);
      callback();
    }
  ]);
};

/**
 * Update an deal
 */
exports.update = function(req, res) {
  var deal = req.deal;

  deal = _.extend(deal, req.body);

  async.parallel([
    function(callback) {
      tagsManager(deal, 'create');

      callback();
    },
    function(callback) {
      deal.save(function(err) {
        if (err) {
          return res.status(500).json({
            error: 'Cannot update the deal'
          });
      }
    });
      res.json(deal);
      callback();
    }
  ]);
};

/**
 * Delete an deal
 */
exports.destroy = function(req, res) {
  var deal = req.deal;

  async.parallel([
    function(callback) {
      tagsManager(deal, 'remove');

      callback();
    },
    function(callback) {
      deal.remove(function(err) {
        if (err) {
          return res.status(500).json({
            error: 'Cannot delete the deal'
          });
        }
      });
      res.json(deal);
      callback();
    }
  ]);

/*  Comment.find().remove({ parent: deal._id }).exec(function(err){
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the comments'
      });
    }
  });*/
};

/**
 * Show an deal
 */
exports.show = function(req, res) {
  res.json(req.deal);
};

/**
 * List of Deals
 */
exports.all = function(req, res) {
  Deal.find().sort('-created').populate('user', 'name username').exec(function(err, deals) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the deals'
      });
    }
    res.json(deals);

  });
};


function tagsManager(deal, action){
    var keywords = cleanText(deal.description + " " + deal.title);

    switch (action) {
      case 'create':
          async.forEachLimit(keywords, 5, function(keyword, callback) {

              // Ajout des liens vers les deals
              Tag.update({label: keyword}, {$set: { label: keyword}, $push : {deals: deal._id}}, {upsert: true}, callback);
          }, function(err) {
              if (err)
                return next(err);
          });
        break;

      case 'remove':
        for(var i in keywords){
          Tag.update({label: keywords[i]}, {$set: { label: keywords[i]}, $pull : {deals: deal._id}}, function(err) {
            if (err) {
              console.log(err);
            }
          });
        }
        Tag.remove().where('deals').size(0).exec( function(err) {
          if (err) {
            console.log(err);
          }
        });

      break;
      }
    };

    function cleanText(text){
      var tmp_keywords = keyword_extractor.extract(text, {language:"french", remove_digits: true, return_changed_case:false, remove_duplicates: true }),
          FrenchStemmer = require('../../node_modules/snowball-stemmer.jsx/dest/french-stemmer.common.js').FrenchStemmer,
          stemmer = new FrenchStemmer(),
          stemmedWord, tmp, tmp2, keywords = new Array(), word;

      for(var i in tmp_keywords){
        tmp = tmp_keywords[i].split("’");

        if (tmp.length == 1){
          word = tmp[0];
        } else {
          word = tmp[1];
        }

        tmp2 = word.split("'");
        if (tmp2.length == 1){
          word = tmp2[0];
        } else {
          word = tmp2[1];
        }

        word = word.toLowerCase();
        word = word.replace(new RegExp("\\s", 'g'),"")
                    .replace(new RegExp("[àáâãäå]", 'g'),"a")
                    .replace(new RegExp("æ", 'g'),"ae")
                    .replace(new RegExp("ç", 'g'),"c")
                    .replace(new RegExp("[èéêë]", 'g'),"e")
                    .replace(new RegExp("[ìíîï]", 'g'),"i")
                    .replace(new RegExp("ñ", 'g'),"n")
                    .replace(new RegExp("[òóôõö]", 'g'),"o")
                    .replace(new RegExp("œ", 'g'),"oe")
                    .replace(new RegExp("[ùúûü]", 'g'),"u")
                    .replace(new RegExp("[ýÿ]", 'g'),"y")
                    .replace(new RegExp("\\W", 'g'),"");

        word = stemmer.stemWord(word);

        if (word.length > 0) {
          keywords.push(word);
        }
      }
      return keywords;
    };
