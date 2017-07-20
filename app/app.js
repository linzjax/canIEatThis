const express =    require('express');
const exphbs 	 = require('express-handlebars');
const api        = require('./src/js/api');

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('view options', { locals: { scripts: ['jquery.js'] } });
app.use('/static', express.static(__dirname + '/src'));
app.use('/api/v1', api);

app.get('/', function(req, res) {
	res.render('home');
});

app.listen(3000, function() {
	console.log('Listening at port 3000!');
});
