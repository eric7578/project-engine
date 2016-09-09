import fs from 'fs';
import ini from 'ini';
import path from 'path';
import Sequelize from 'sequelize';
import cls from 'continuation-local-storage';

import { database } from '../config.js';

const db = {};
const namespace = cls.createNamespace('project-engine.models.transaction');
Sequelize.cls = namespace;

const sequelize = new Sequelize(
  database.schema,
  database.username,
  database.password,
  database
);

fs.readdirSync(__dirname)
  .filter(file => (
    file.indexOf('.') !== 0
    && path.basename(file, '.js') !== 'index'
  ))
  .forEach(file => {
    try {
      const model = sequelize['import'](path.join(__dirname, file));
      db[model.name] = model;
    } catch (err) {
      if (err.message !== 'defineCall is not a function') {
        throw err;
      }
    }
  });

for (let modelName in db) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  exports[modelName] = db[modelName];
}

exports.sequelize = sequelize;
exports.Sequelize = Sequelize;
