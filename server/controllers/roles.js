(() => {
  'use strict';

  let Role = require('../models/roles');

  module.exports = {
    create: (req, res, next) => {
      let validRoles = Role.schema.paths.title.enumValues;
      if (!req.body.title) {
        res.status(400).json({
          error: 'The role title is required'
        });
      } else if (validRoles.indexOf(req.body.title) === -1) {
        // Handle an invalid role title
        res.status(400).json({
          error: req.body.title +
            ' is not a valid role title'
        });
      }
      // Find if the role exists
      Role.findOne({
        title: req.body.title
      }, (err, role) => {
        if (role) {
          let err = new Error(
            'Role already exists'
          );
          err.status = 400;
          return next(err);
        } else {
          // If the role does not exist, create it
          Role.create({
            title: req.body.title
          }, (error, newRole) => {
            if (!error) {
              res.status(201).json(newRole);
            }
          });
        }
      });
    },

    all: (req, res) => {
      Role.find((err, roles) => {
        res.json(roles);
      });
    }

  };
})();
