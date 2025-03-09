//
var mongoUrl="mongodb+srv://instagate100820:MarNatIrin@cluster0.tbtgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// var mongoUrl = '"mongodb://tfi-mfgbt.mongodb.net/test"'
var mongoose = require('mongoose')
// updated 2021
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true)

mongoose.connect(mongoUrl, { useUnifiedTopology: true })
.then(() => { log('Connected to MongoDB: %s \n ', mongoUrl) }) 
.catch((err) => { error('MongoDB connection error: %s \n', err); })