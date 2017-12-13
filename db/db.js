const url = require('./config').url;
const mongo = require('mongodb').MongoClient;

const insert = ({ author, content, title, collection, collection2 }) => {
  return mongo
    .connect(url)
    .then(db => {
      let dbCollection;
      // to do find embeded collections
      if (collection && collection2) {
        dbCollection = db.collection(collection);
      } else {
        dbCollection = db.collection(collection);
      }
      return new Promise((resolve, reject) => {
        dbCollection.insertOne(
          {
            title,
            content,
            author
          },
          (err, result) => {
            db.close();
            if (err) {
              reject(err);
            }
            resolve(result);
          }
        );
      });
    })
    .catch(err => {
      throw err;
    });
};

const update = ({ content, title, author }) => {
  return mongo.connect(url, (err, db) => {
    // const selectorObj =
    //   content && author
    //     ? { content, author }
    //     : content ? { content } : author ? { author } : {};

    return new Promise((resolve, reject) => {
      db.collection('items').update(
        {
          title
        },
        {
          $set: {
            content,
            title
          }
        },
        (err, result) => {
          db.close();
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  });
};

const get = ({ author, title }) => {
  return mongo
    .connect(url)
    .then(db => {
      const selectorObj =
        author && title
          ? { author, title }
          : author ? { author } : title ? { title } : {};

      return new Promise((resolve, reject) => {
        db
          .collection('items')
          .find(selectorObj)
          .toArray((err, docs) => {
            db.close();
            if (err) reject(err);
            resolve(docs);
          });
      });
    })
    .catch(err => console.error(err));
};

const removeDocument = ({ authorName, docTitle }) => {
  const selectorObj =
    authorName && docTitle
      ? { author: authorName, title: docTitle }
      : authorName
        ? { author: authorName }
        : docTitle ? { title: docTitle } : {};

  return mongo
    .connect(url)
    .then(db => {
      return new Promise((resolve, reject) => {
        db.collection('items').remove(selectorObj, (err, number) => {
          db.close();
          if (err) reject(err);
          resolve(number);
        });
      });
    })
    .catch(err => {
      throw err;
    });
};

const db = { insert, update, get, removeDocument };

module.exports = db;
