var request = require('request');
var fs = require('fs');

// Check if file exists, else create one

function checkFileExists() {
  fs.readFile('output.json', 'utf8', function(err, data){
    if (data) {
      fs.writeFile('output.json', data.slice(0, -1), function (err) {
        if (err) throw err;
      }); 
    }
    else {
      fs.writeFile('output.json', '[]', function (err) {
        if (err) throw err;
        console.log('Output File is created successfully.');
      }); 
    }
  });
}

// Crawl data (Get 500 recipes at once)

function crawl() {
  var website = "https://www.yummly.com";

  let start = 0;
  if (process.argv[2])
    start = process.argv[2] * 500 + 1;
  const end = start + 499;

  var api = "https://mapi.yummly.com/mapi/v16/content/search?solr.seo_boost=new&start="+start+"&maxResult=500" +
              "&fetchUserCollections=false&allowedContent=single_recipe&allowedContent=suggested_search" + 
              "&allowedContent=related_search&allowedContent=article&allowedContent=video&guided-search=true" + 
              "&solr.view_type=search_internal";

  var recipes = []; // Create an array to store recipe objects

  request(api, function(error, response, body) {
    if(error) {
      console.log("Error: " + error);
    }

    console.log('Getting recipes from: ' + start + " - " + end);

    var res = JSON.parse(response.body);

    res.feed.forEach(function(prefix) {

      const recipeName = prefix.display.displayName;
      const recipePhoto = prefix.display.images;
      const recipeUrl = prefix['tracking-id'];
      const cookTime = prefix.content.details.totalTime;
      const ratings = prefix.content.reviews.averageRating;
      const serve = prefix.content.details.numberOfServings;
      const tags = prefix.seo.spotlightSearch.keywords;
      let recipeType = [];
      let ingredients = [];
      
      const ingredientList = prefix.content.ingredientLines;
      const courseList = prefix.content.tags.course;

      ingredientList.forEach(function(element) {
        ingredients.push(element.ingredient);
      });

      if(courseList)
        courseList.forEach(function(element) {
          recipeType.push(element['display-name']);
        });

      // Create a recipe object
      var recipe = {
        recipeUrl: website + '/' + recipeUrl,
        recipeName: recipeName,
        recipePhoto: recipePhoto,
        ingredients: ingredients,
        ratings: ratings,
        cookTime: cookTime,
        serve: serve,
        tags: tags,
        recipeType: recipeType
      };

      recipes.push(recipe); // Push the recipe object to the array
    
    });

    // Write the array of recipe objects to the JSON file
    fs.writeFile('output.json', JSON.stringify(recipes, null, 2), function (err) {
      if (err) throw err;
    });
  });
}

checkFileExists();
crawl();
