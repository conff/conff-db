class MongooseUtil {
  constructor(options, utils) {
    Object.assign(this, {
      modelsAreLoaded: false,
      ...utils,
      options: {
        ...options,
      },
    });
    // eslint-disable-next-line global-require
    require('mongoose-schema-extend');
  }

  async init(dir) {
    this.setPromise();
    this.connect();
    this.load(dir);
    return this.setListener();
  }

  setPromise() {
    const { mongoose, promise } = this;
    mongoose.Promise = global.Promise || promise;
  }

  connect() {
    const { mongoose, options, logger } = this;
    if (mongoose.connection.readyState === 0 /* disconnected */) {
      const uri = options.test ? options.mongo.testUri : options.mongo.uri;
      if (options.test && uri.indexOf('mongodb://localhost') === -1) {
        throw new Error('Tests should be run on local db');
      }
      mongoose.connect(uri, options.mongo.options);
    } else {
      logger.warn('Already connected to DB');
    }
  }

  getModels(dir, ext = '.js') {
    const { _, fs, path } = this;
    return _.chain(fs.readdirSync(dir))
      .filter(file => path.extname(file) === ext)
      .map(file => path.basename(file, ext))
      .value();
  }

  load(dir) {
    const { mongoose, _, path } = this;
    if (_.isEmpty(dir)) {
      throw new Error('You need to define directory of models');
    }

    if (!this.modelsAreLoaded) {
      this.connection = mongoose.connection;
      const dependentModels = ['identityCounter'];
      const diff = _.difference(this.getModels(dir), dependentModels);
      const models = _.union(dependentModels, diff);
      models.forEach((file) => {
        // eslint-disable-next-line
        require(path.resolve(`${dir}/${file}`));
      });
      this.modelsAreLoaded = true;
    }
  }

  async setListener() {
    const { connection, logger } = this;
    connection.on('error', (err) => {
      throw err;
    });

    return new Promise((resolve) => {
      connection.once('open', () => {
        logger.info('Connected to db');
        resolve();
      });
    });
  }
}

export default MongooseUtil;
