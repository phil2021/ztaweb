const fs = require('fs');
const mongoose = require('mongoose');
const { Attraction, User, Destination, Review } = require('../../src/models');
const config = require('../../src/config/config');
const logger = require('../../src/config/logger');

mongoose.connect(config.mongoose.url.replace('<PASSWORD>', config.mongoose.password), config.mongoose.options).then(() => {
  logger.info(`
  ################################################
  🚀 Connected Successfully to MongoDB 🚀
  ################################################
  `);
});

// READ JSON FILE
const attractions = JSON.parse(fs.readFileSync(`${__dirname}/attractions.json`, 'utf-8'));
const destinations = JSON.parse(fs.readFileSync(`${__dirname}/destinations.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Attraction.create(attractions);
    await Destination.create(destinations);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    logger.info('Data successfully loaded!');
  } catch (err) {
    logger.info(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Attraction.deleteMany();
    await Destination.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    logger.info('Data successfully deleted!');
  } catch (err) {
    logger.info(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
