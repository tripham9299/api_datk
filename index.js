var dotenv = require('dotenv').config()
var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var mongoose = require('mongoose')
const cors = require('cors');
var cloudinary = require('cloudinary').v2;
const session = require('express-session');

cloudinary.config({
  cloud_name: 'tripham9299',
  api_key: '293486784977842',
  api_secret: 'Mz0hnBZvDTDDBq1r6mZPwdpwaN8'
});


// var test = require('./test.js')


var userRouters = require('./routes/user.route')

var authRouters = require('./routes/auth.route')

var authMiddleware = require('./middleware/auth.middleware')





mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error.');
    console.error(err);
    process.exit();
});

mongoose.connection.once('open', () => {
    console.log(`Connected to MongoDB:`);
});





var app = express()
var port = process.env.PORT || 5000;

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET || dsadsadsdasdas12615))


// app.set('trust proxy',1)
// app.use(session({
//   secret: 'dsadsadsdasdas12615',
//   resave: false,
//   saveUninitialized: true,
//   proxy : true,
//   cookie: { secure: true }}
// ));

app.use(express.static('public'))


app.use(cors({
    // origin: 'http://127.0.0.1:5500', //Chan tat ca cac domain khac ngoai domain nay
    credentials: true //Để bật cookie HTTP qua CORS
}))


app.get('/', function (req, res) {
    res.json("Server DATK")
})

app.use('/auth', authRouters);
// app.use('/product', productRouters);
app.use('/user', userRouters);
// app.use('/cart', cartRouters);
// app.use('/order', orderRouters);
// app.use('/category', categoryRouters);
// app.use('/comment', commentRouters)

// app.use('/service', serviceRouters);
// app.use('/bill', billRouters);


app.listen(port, () => console.log('Server is listening on port ' + port))