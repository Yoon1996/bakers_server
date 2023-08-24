var express = require("express");
const Recipe = require('../model/recipe.model');
const Ingredient = require('../model/ingredient.model');
const User = require("../model/user.model");
var router = express.Router();

//레시피 생성
router.post("/create_recipe", async (req, res) => {



    
    const { id , name } = req.body;
    const { ingredientList} = req.body
    

    
    const userId = req.userInfo.id

    
    const recipe = await Recipe.findOne({where: {name}})
    

    if(recipe) {
        res.status(409).json({ statusMessage: "Duplicated Name"});
        return
    }

    //레시피 등록
    const createRecipe = await Recipe.create({
      id,
      name,
      userId
    });

    //재료 등록
    const ingredientsWithRecipeId = ingredientList.map((ingredient) => ({
        ...ingredient,
        recipeId: createRecipe.id
      }));

    
    const createIngredient = await Ingredient.bulkCreate(
        ingredientsWithRecipeId
        )

    createRecipe
    createIngredient
  
    // await createRecipe.save();
    // await createIngredient.save();

    // await all.save();

    // res.json(createRecipe);
    // res.json(createIngredient);
    
    res.json(createRecipe)
  });

//레시피 보여주기
router.get("/show_recipe", async (req, res, next) => {
    Recipe.findAll({
    })
    .then((recipe) => {
        res.json(recipe)
    })
    .catch((err) => {
        console.log(err)
    })
})

  module.exports = router;
