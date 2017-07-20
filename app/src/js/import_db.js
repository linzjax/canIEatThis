function ImportDatabase(){
	var base_url = 'http://localhost:3000/api/v1'
	var food_type_dict = {};
	var food_types = [
		"grains", 
		"gluten-free grains",
		"legumes",
		"dairy",
		"refined sugar",
		"modern vegetable oils",
		"processed food chemicals",
		"alcohol",
		"starch",
		"eggs",
		"nuts",
		"seeds",
		"unsafe-spices",
		"gluten cross-reactive foods",
		"NSAIDS",
		"Non-nutritive sweeteners",
	];

	var diets = {
		'aip paleo': [
			"nightshades",
			"grain",
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
			"emulsifiers"
		],
		'gluten-free': [
			"grain",
		],
		'paleo': [
			"grain", 
			"gluten-free grains",
			"legumes",
			"dairy",
			"refined sugar",
			"modern vegetable oils",
			"processed food chemicals",
			"alcohol",
			"starch"
		]
	};

	var categories = {
		"alcohol":
			[" beer", "wine", "whiskey", "vodka", "liquor", "scotch", "bourbon", "sake", "ale", "lager", "cider", "mead", "absinthe", " gin ", "mezcal", "tequila", "brandy", "cognac", "margarita"],

		"dairy":
			["milk", "provolone", "swiss", "cheddar", "bleu", "queso", "monterey jack", "colby-jack", "goat cheese", "american cheese", "colby", "cheese", "gouda", "mozzarella", "butter", "casein", "cream", "curd", "delactosed", "lactalbumin", "lactoglobulin", "lactos", "whey", "custard", "ghee", "half & half", "ice cream", "pudding", "sour cream", "yogurt","tzatziki"],

		"eggs":
			['egg','eggs'],

		"emulsifiers":
			["arrowroot", "cornstarch", "katakuri starch", "potato starch", "sago", "tapioca", "alginin", "guar gum", "locust bean gum", "xanthan gum", "collagen", "egg whites", " furcellaran", "gelatin", "starch","baking powder"],

		"grain":
			["wheat", "barley malt", "bran", "bulgar", "couscous", "farina", "kamut", "orzo", "semolina", "beer", "glucose made from wheat", "montina flour", "graham flour", "commercially made stock", "soy sauce", "amaranth", "barley", "bulgur", "farro", "emmer", "flaxseed", "grano", "kamut grain", "millet", "cereal", "muesli", "rye", "spelt", "teff", "triticale", "barley", "wheat berries", "rye", "couscous", "cracker", "pasta", "pita","bread","flour"],

		"gluten-free grains":
			["corn", "cornflour", "cornmeal", "millet", "rice", "wild rice", "teff", "sorghum", "buckwheat", "quinoa", "oats", "oatmeal", "popcorn", "gluten-free flour"],

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

	// import categories of food
	food_types.forEach((ftype) => {
		if (ftype) {
			$.post(base_url + '/foodtype',
				{name: food_type},
				(result) => { console.log(result); }
			);
		}
	});

	// import diets
	Object.keys(diets).forEach((diet) => {
		if (diet) {
			$.post(base_url + '/diet',
				{name: diet},
				(result) => {
					console.log('success:', result);
			});
		}
	})

	// get food categories and then import individual foods;
	$.get(base_url + '/foodtype',
		(results) => {
			results.forEach((i) => {
					if (categories[i.name]) {
						categories[i.name].forEach((food) => {
							$.post(
								base_url + '/food', 
								{
									name: food,
									food_type_id: i.food_type_id,
								},
								(result) => {
									console.log('success:', result);
								}
							)
						});
					}
			});
	});

	$.get(base_url + '/foodtype',
		(ft_results) => {
			ft_results.forEach(function(ft) {
				food_type_dict[ft.name] = ft.food_type_id;
			});

			$.get(base_url + '/diet',
				(diet_results) => {
					diet_results.forEach((db_diet) => {
						var restrictions = diets[db_diet.name];
						restrictions.forEach((restricted) => {
							if (food_type_dict[restricted]) {
								$.post(base_url + '/restriction',
									{
										diet_id: db_diet.diet_id,
										food_type_id: food_type_dict[restricted],
									},
									(result) => { console.log(result);}
								);
							}
						})
					});
				}
			);
		}
	);
}

$(document).ready(function() {
	ImportDatabase();
});
