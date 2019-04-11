Upon cloning the repository, we need to install the dependencies using
    - npm install

Script to run the code:

- The code fetches 500 recipes at a time. To run the code, specify the page you want to get the data of
- Eg. To get the data of recipes, use
    - node crawler.js pageNumber (starting with 0)
    - node crawler.js 0
    - node crawler.js 1
            .
            .
            .

- Each time we run the crawler, 500 recipes will be parsed and data will be appended to the output.txt file in an array of object format.
- output.txt consists of approx 10,000 recipes.

- The data consists of: 
    - recipeUrl
    - recipeName
    - recipePhoto
    - ingredients
    - ratings
    - cookTime
    - serve
    - tags
    - recipeType

- Eg:

{
recipeUrl: https://www.yummly.com/recipe/5-Ingredient-Pound-Cake-2465588,
recipeName: 5-Ingredient Pound Cake,
recipePhoto: https://lh3.googleusercontent.com/LZ93LUtENwr7l005VMcbz0UIuaNIhp20ISymGmZObXigTEwDw5XoxQU8_B_898QF8vm9AO1vEYC-PwgkQndu,
ingredients: salted butter,granulated sugar,large eggs,all purpose flour,baking powder,
ratings: 4.115384615384615,
cookTime: 1 hr 32 min,
serve: 12,
tags: pound cake,desserts,cake,dessert,cakes,flour sugar eggs dessert,baking,cake without vanilla extract,poundcake,make with flour sugar and eggs,desserts without vanilla extract,cake dessert,no mixer cake,all purpose flour dessert,desserts without milk,baked goods without milk,sift,desert,cup cakes,flour sugar eggs butter,
recipeType: Desserts
},
