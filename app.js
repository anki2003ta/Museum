if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
/* if you want to run the project and do not have .env files configured , please uncomment the next
two commented codes and comment down this code   await mongoose.connect(dbUrl); You project will run succesfully*/

const MONGO_URL = "mongodb://mongo:27017/wanderlust"; // used with docker
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; // use for local db
const dbUrl =process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to DB");
  }).catch((err) => {
    console.log(err);
  });
async function main(){
  await mongoose.connect(MONGO_URL);
  // await mongoose.connect(dbUrl);
}
app.set("view engine","ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  },
};
/*app.get("/", (req,res) => {
  res.send("Hi,I am root");
});*/
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  //console.log(success);
  next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.get('/privacy', (req, res) => {
  res.render('privacy'); // This should be placed before the app.all("*") block
});

// Catch-all route for undefined paths
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});


//if any of the incomming request does not match then throw this error
app.all("*",(req,res,next) =>{
  next(new ExpressError(404,"Page Not Found!"));
});
//error handling is done by middleware
app.use((err,req,res,next) =>{
  let {statusCode=500,message="Something went wrong!"}=err;
  res.status(statusCode).render("error.ejs",{message});
  //res.status(statusCode).send(message);
});

app.use((err, req, res, next) => {
  console.log(err); // Log the full error to see what’s causing the issue
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080,()=>{
  console.log("Server is listening to port 8080");
});