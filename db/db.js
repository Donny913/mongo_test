const url = require('./config').url;
const mongo = require('mongodb').MongoClient;

const insert = async ({ login, content, title }) => {
  return mongo
    .connect(url)
    .then(db => {
      const collection = db.collection('items');
      collection.insertOne(
        {
          title,
          content,
          _id: login
        },
        (err, result) => {
          if (err) {
            console.log('uuuups, error in inserting data');
            console.error(err);
          }
          db.close();
        }
      );
    })
    .catch(err => {
      throw err;
    });
};

const update = ({ login, content, title }) => {
  mongo.connect(url, (err, db) => {
    if (err) throw err;
    const collection = db.collection(login);
    collection.updateOne(
      {
        title: 'test'
      },
      {
        $set: {
          content,
          title
        }
      },
      (err, result) => {
        if (err) {
          console.log('uuuups, error in inserting data');
          console.error(err);
        }
        db.close();
      }
    );
  });
};

const get = ({ author, title }) => {
  console.log(author);
  console.log(title);
  mongo.connect(url, (err, db) => {
    if (err) throw err;
    const collection = db.collection(author);
    const docs = collection.find({}).toArray();
  });
};

const removeCollection = ({ collectionId }) => {
  mongo.connect(url, (err, db) => {
    if (err) throw err;
    db.collection(collectionId, (err, collection) => {
      if (err) {
        throw err;
      }
      collection.remove({}, (err, removedCollection) => {});
    });
  });
};

const db = { insert, update, get, removeCollection };

module.exports = db;
