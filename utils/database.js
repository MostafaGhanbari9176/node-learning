const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let db

exports.createConnection = cb => {
    MongoClient.connect("mongodb://localhost:27017",  { useUnifiedTopology: true })
        .then(client => {
            console.log('MONGO CONNECTED 👍')
            db = client.db('market')
            cb()
        })
        .catch(err => {
            console.log(err)
            throw err
        })
}

exports.getDB = () => {
    if (db)
        return db
    throw "db connection failed 😨 "
}

exports.ObjectId = mongodb.ObjectID