const express =    require('express');
const exphbs 	 = require('express-handlebars');
const pg 		 = require('pg');
const bodyParser = require('body-parser');
const api        = require('./src/js/api');

const connectString = process.env.DATABASE_URL || 'postgress://localhost:5432/diet';
const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('view options', { locals: { scripts: ['jquery.js'] } });
app.use('/static', express.static(__dirname + '/src'));


app.get('/', function(req, res) {
	res.render('home');
});


app.use('/api/v1', api);


app.listen(3000, function() {
	console.log('Listening at port 3000!');
});






