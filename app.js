const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    cors = require('cors'),

    mongoose = require('mongoose');

const app = express(),
    port = process.env.PORT || 9000;
// host = '127.0.0.1';

const corsOptions = {
    origin: [
        'http://192.168.1.6:9000',
        'http://localhost:9000',
        'http://127.0.0.1:9000',
        'https://storytelller.herokuapp.com'
    ],
    methdos: [
        'PATCH',
        'PUT',
        'DELETE',
        'GET',
        'POST'
    ]
}

app.use(cors(corsOptions));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(require('morgan')('dev'));
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use('/', express.static('public'));
app.use('/api', require('./routes'));
app.use('/api/:what', require('./routes'));
app.use('/:what', express.static('public'));
app.use('/:what/:sets', express.static('public'));

app.listen(port, () => console.log(`Server is running!!!`));

mongoose.connect(require('./config/keys').connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
    .then(() => console.log('Connected to mongoDB!!!'))
    .catch(() => process.exit(0));
