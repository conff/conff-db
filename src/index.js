import MongooseUtil from './mongoose';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import mongoose from 'mongoose';
import logWith from 'log-with';

const logger = logWith(module);

class DbManager {
  static async run(options) {
    const mongooseUtil = new MongooseUtil(options, {
      _,
      fs,
      path,
      mongoose,
      logger,
    });
    await mongooseUtil.init(path.resolve('./src/models'));
  }
}

export default DbManager;
