const express = require("express");
const path = require("path");



const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");


const app = express();
const PORT = 8001;

// connectToMongoDB("mongodb+srv://patilpratik9903:<tiku>@cluster0.gczb9ec.mongodb.net/").then(() =>
//   console.log("Mongodb connected")
// );
// const mongoose = require('mongoose');
// const db = 'mongodb+srv://patilpratik9903:<password>@cluster0.gczb9ec.mongodb.net/test?retryWrites=true'
// mongoose.connect(db, { 
//         useNewUrlParser: true,
//         useCreateIndex: true
//       })
//     .then(() => console.log('MongoDB connected...'))
//     .catch(err => console.log(err));
// const mongoose = require('mongoose');
// var url = "mongodb+srv://patilpratik9903:<password>@cluster0.gczb9ec.mongodb.net/website?retryWrites=true&w=majority";
// mongoose.connect(url, function(err, db) {
//     if (err) throw err;
//         console.log("Database created!");
//         db.close();
// });
const mongoose=require('mongoose');
var url = "mongodb+srv://patilpratik9903:tiku@cluster0.gczb9ec.mongodb.net/"


const connectDB = async () => {
    try {
      const conn = await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    
      });
      console.log(`MongoDB connecteed: ${conn.connection.host}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };
  
connectDB();
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/url",  urlRoute);

app.use("/", staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
 