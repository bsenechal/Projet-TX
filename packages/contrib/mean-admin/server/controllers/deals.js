'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Deal = mongoose.model('Deal'),
  _ = require('lodash');


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

  deal.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot save the deal'
      });
    }
    res.json(deal);

  });
};

/**
 * Update an deal
 */
exports.update = function(req, res) {
  var deal = req.deal;

  deal = _.extend(deal, req.body);

  deal.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the deal'
      });
    }
    res.json(deal);

  });
};

/**
 * Delete an deal
 */
exports.destroy = function(req, res) {
  var deal = req.deal;

  deal.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the deal'
      });
    }
    res.json(deal);

  });
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
