const express    = require('express');
const bodyParser = require('body-parser');
const pg 		 = require('pg');

const router = express.Router();
const connectString = process.env.DATABASE_URL || 'postgress://localhost:5432/diet';

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());


function getList(database, res){
	var results = [];
	pg.connect(connectString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
		    return res.status(500).json({success: false, data: err});
		}
		const query = client.query('SELECT * FROM ' + database);
		query.on('row', (row) => { results.push(row); });
		query.on('end', () => {
			done();
			return res.json(results);
		});
	});
}

function addItem(database, keys, req, res) {
	const results = [];
	const data = {};
	const key_str = keys.join(',');

	keys.forEach(function(k) {
		data[k] = req.body[k];
	});

	pg.connect(connectString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
		    return res.status(500).json({success: false, data: err});
		}
		client.query(
			'INSERT INTO ' + database + ' (' + key_str + ') VALUES ($1)',
			[data.name]);
		const query = client.query('SELECT * FROM ' + database);
		query.on('row', (row) => { results.push(row); });
		query.on('end', () => {
			done();
			return res.json(results);
		});
	});
}

router.get('/foodtype', function(req, res) {
	getList('foodType', res);
})

router.post('/foodtype', function(req, res, next) {
	addItem('foodType', ['name'], req, res);
})

router.get('/diet', function(req, res, next) {
	getList('diet', res);
});

router.post('/diet', function(req, res, next) {
	addItem('diet', ['name'], req, res);
});

router.get('/diet/:diet', function(req, res, next) {
	var results = [];
	var diet = req.params.diet;

	pg.connect(connectString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		var query = client.query(
			'SELECT food.name FROM food ' +
  			'JOIN foodType ' +
    		'ON foodType.food_type_id = food.food_type_id ' +
  			'JOIN restriction ' + 
    		'ON restriction.food_type_id = foodType.food_type_id ' + 
    		'JOIN diet ' +
    		'ON diet.diet_id = restriction.diet_id ' +
 			'WHERE diet.name = $1', [diet])
		query.on('row', (row) => { results.push(row); })
		query.on('end', () => {
			done();
			return res.json(results);
		});
	});
});

router.get('/food', function(req, res, next) {
	getList('food', res)
});

router.post('/food', function(req, res, next) {
	addItem('food', ['name', 'food_type_id'], req, res);
});

router.get('/restriction', function(req, res, next) {
	getList('restriction', res);
});

router.post('/restriction', function(req, res, next) {
	addItem('restriction', ['diet_id', 'food_type_id'], req, res);
});

module.exports = router;