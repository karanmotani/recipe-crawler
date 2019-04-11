var request = require('request');
var fs = require('fs');

// Check if file exists, else create one

function checkFileExists() {
  fs.readFile('output.txt', 'utf8', function(err, data){
    if (data) {
      fs.writeFile('output.txt', data.slice(0, -1), function (err) {
      if (err) throw err;
      }); 
    }
    else {
      fs.writeFile('output.txt', '[' + '\n', function (err) {
      if (err) throw err;
        console.log('Output File is created successfully.');
      }); 
    }
  })
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

      fs.appendFileSync('output.txt', '{\n' + 
        'recipeUrl: ' + website + '/' + recipeUrl + ',\n' + 
        'recipeName: ' + recipeName + ',\n' + 
        'recipePhoto: ' + recipePhoto + ',\n' + 
        'ingredients: ' + ingredients + ',\n' + 
        'ratings: ' + ratings + ',\n' + 
        'cookTime: ' + cookTime + ',\n' + 
        'serve: ' + serve + ',\n' + 
        'tags: ' + tags + ',\n' +
        'recipeType: ' + recipeType + '\n' +
        '},' + '\n');
    
    });
    fs.appendFileSync('output.txt', ']');
  });

}

checkFileExists();
crawl();