var exceptions = ["sweet potato","sweet potatoes", "apple cider vinegar","butternut","unsweet"];


var notFoodWords = [' and ',' of ',' the ',' tbsp ',' tbsp. ', ' tbs ', ' tbs. ',' tablespoon ',' tablespoons ',' tsp ',' tsp. ',' teaspoon ',' teaspoons ',' cup ',' lb '," &frac14; "," &frac12; ",' more ',' plus ', ' can ', ' large ',' small ',' medium ', ' frozen ',' cups ', ' salt ',' ground ', ' fresh ', ' freshly ', ' &#xBD; ', ' &#xBC; ', ' gram ', ' grams ', ' lightly ', ' cooked ', ' pinch ', ' c. ', ' t. ', ' bunch ',' bunches ', ' & ',' oz ',' can ', ' cans ', ' diced ', ' gr ', '/'];

var categories = {
	"alcohol":
		[" beer", "wine", "whiskey", "vodka", "liquor", "scotch", "bourbon", "sake", "ale", "lager", "cider", "mead", "absinthe", " gin ", "mezcal", "tequila", "brandy", "cognac", "margarita"],

	"dairy":
		["milk", "provolone", "swiss", "cheddar", "bleu", "queso", "monterey jack", "colby-jack", "goat cheese", "american cheese", "colby", "cheese", "gouda", "mozzarella", "butter", "casein", "cream", "curd", "delactosed", "lactalbumin", "lactoglobulin", "lactos", "whey", "custard", "ghee", "half & half", "ice cream", "pudding", "sour cream", "yogurt","tzatziki"],

	"eggs":
		['egg','eggs'],

	"emulsifiers":
		["arrowroot", "cornstarch", "katakuri starch", "potato starch", "sago", "tapioca", "alginin", "guar gum", "locust bean gum", "xanthan gum", "collagen", "egg whites", " furcellaran", "gelatin", "starch","baking powder"],

	"grains":
		["wheat", "barley malt", "bran", "bulgar", "couscous", "farina", "kamut", "orzo", "semolina", "beer", "glucose made from wheat", "montina flour", "graham flour", "commercially made stock", "soy sauce", "amaranth", "barley", "bulgur", "farro", "emmer", "flaxseed", "grano", "kamut grain", "millet", "cereal", "muesli", "rye", "sorghum", "spelt", "teff", "triticale", "barley", "wheat berries", "rye", "couscous", "cracker", "pasta", "pita","bread","flour"],

	"gluten-free grains":
		["corn", "cornflour", "cornmeal", "millet", "rice", "wild rice", "teff", "sorghum", "buckwheat", "quinoa", "oats", "oatmeal", "popcorn","gluten-free flour"],

	"gluten cross-reactive foods":
		["yeast", "tapioca"],

	"legumes":
		["alfalfa", "bean", "pea", "chickpeas", "fava coceira", "frijole negro", "lentil", "lespedeza", "licorice", "peanut", "red clover", "soy", "white vlover"],

	"modern vegetable oils":
		["canola oil", "rapeseed oil", "soybean oil", "canola oil", "corn oil", "sunflower oil", "safflower oil", "peanut oil", "vegetable oil"],

	"NSAIDS":
		["aspirin", "ibuprofen"],


	"nightshades":
		["ashwagandha", "bell pepper", "bush tomato", "cape gooseberry", "ground cherr", "cocona", "eggplant", "garden huckleberry", "goji berriy", "wolfberry", "hot peppers","chili", "chili pepper", "jalapeno", "habanero", "red pepper", "cayenne", "kutjera", "naranjilla", "paprika", "pepino", "pimento", "potato", "tamarillo", "tomatillo", "tomato", "pepper"],

	"Non-nutritive sweeteners":
		["aspartame", "nutrasweet", "equal", "acesulfame-k", "sweet one", "neotame", "saccharin", "sweetâ€™n low", "sucralose", "splenda"],

	"nuts":
		["acorn", "beech", "breadnut", "candlenut", "chestnut", "hazel", "almond", "nut", "walnut", "cashew", "coconut", "pistachio", "macadamia", "peanut", "soybean", "soy","pecan"],


	"processed food chemicals":
		["artificial sweeteners", "high fructose corn syrup", "monosodium glutamate (msg / e621)", "trans fat", "food dyes", "sodium sulfite (e221)", "sodium nitrate/sodium nitrite", "bha and bht (e320)", "sulfur dioxide", "potassium bromate"],

	"refined sugar":
		["sugar", "chocolate", "soda", "sweet","vanilla"],


	"seeds":
		["chia", "flax", "sesame", "ginkgo", "cocoa", "coffee", "hemp", "poppy", "seed", "sunflower"],

	"unsafe-spices":
		["allspice", "star anise", "caraway", "cardamon", "juniper", "black pepper", "white pepper", "green peppercorns", " pink peppercorns", "vanilla bean", "anise", "annatto", "black caraway", "cumin", "celery seed", "coriander", "dill seed", "fennel seed", "fungreek", "mustard seed", "nutmeg", "capsicums", "cayenne", "chili pepper flakes", "chipotle", "chili powder", "curry", "paprika", "red pepper", "curry powder", "chinese 5-spice", "garam masala", "poultry seasoning", "steak seasoning"]
};



var dietBuilder = function(dietName, arr){
	dietName = {};
	
	arr.forEach(function(category){
		//console.log(category);
		dietName[category] = categories[category];
	});

	return dietName;
};

var currentDiet;

var chooseDiet = new Promise(function(resolve, reject){
	chrome.storage.sync.get({
		currentDiet: 'Paleo',
		}, function(items){
			resolve(items.currentDiet);
		});
});



var diets = {
	'Paleo': 
	["grains", 
	"gluten-free grains",
	"legumes",
	"dairy",
	"refined sugar",
	"modern vegetable oils",
	"processed food chemicals",
	"alcohol",
	"starch"],

	'AIPPaleo': 
	["nightshades",
	"grains",
	"gluten-free grains",
	"legumes",
	"dairy",
	"refined sugar",
	"modern vegetable oils",
	"processed food chemicals",
	"eggs",
	"nuts",
	"seeds",
	"unsafe-spices",
	"gluten cross-reactive foods",
	"alcohol",
	"NSAIDS",
	"Non-nutritive sweeteners",
	"emulsifiers"]
};
















