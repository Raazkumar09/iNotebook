const mongoose = require("mongoose");
const mongoURL = 'mongodb://0.0.0.0:27017/iNotebook';

const connectToMongo = ()=>{
    mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to database');
        // Do something here
      })
      .catch((error) => {
        console.log('Error connecting to database:', error.message);
      });
}

module.exports = connectToMongo;