const connection = require('../config/connection');
const { User, Thought } = require('../models');
const {
  getRandomName,
  getRandomThoughts,
  getRandomUser,
  genRandomIndex,
} = require('./data');

// Start the seeding runtime timer
console.time('seeding');

// Creates a connection to mongodb
connection.once('open', async () => {
  // Delete the entries in the collection
  await User.deleteMany({});
  await Thought.deleteMany({});

  // Empty arrays for randomly generated users and thoughts
  const thoughts = [...getRandomThoughts(10)];
  const users = [];

  // Makes users array
  const makeUser = (username) => {
    users.push({
      username,
      email: `${username.toLowerCase()}@example.com`,
      thoughts: [thoughts[genRandomIndex(thoughts)]._id],
    });
  };

  // Wait for the thoughts to be inserted into the database
  await Thought.collection.insertMany(thoughts);

  // For each of the thoughts that exist, make a random user
  thoughts.forEach(() => makeUser(getRandomUser()));

  // Wait for the users array to be inserted into the database
  await User.collection.insertMany(users);

  // Log out a pretty table for thoughts and users
  console.table(thoughts);
  console.table(users);
  console.timeEnd('seeding complete 🌱');
  process.exit(0);
});