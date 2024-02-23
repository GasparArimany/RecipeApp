try {
  const categories = await fetchCategories();

  console.log(categories);
  const categoriesList = document.getElementById("mealCategoriesList");

  categoriesList.innerHTML = "";

  const categoriesListItems = createCategoriesListItems(categories);
  console.log(categoriesListItems);
  categoriesList.append(...categoriesListItems);
} catch (error) {
  const categoriesList = document.getElementById("mealCategoriesList");
  // TODO
  categoriesList.innerHTML = error.message;
}

async function fetchCategories() {
  const result = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );

  if (!result.ok) {
    throw new Error("categories fetch invalid");
  }

  const json = await result.json();
  const { categories } = json;
  return categories;
}

function createCategoriesListItems(categories) {
  return categories.map((category) => {
    const catListItem = document.createElement("li");
    catListItem.append(category.strCategory);
    catListItem.addEventListener("click", () =>
      fetchAndCreateRecipesList(category)
    );
    return catListItem;
  });
}

async function fetchAndCreateRecipesList(category) {
  const recipesSection = document.getElementById("recipesSection");
  recipesSection.innerHTML = "Loading...";
  const recipes = await fetchRecipesByCategory(category);

  recipesSection.innerHTML = "";
  recipesSection.append("Recipes:");
  const recipesList = document.createElement("ul");

  const recipeListItems = recipes.map((recipe) => {
    const recipeListItem = document.createElement("li");
    recipeListItem.addEventListener("click", () => {
      fetchAndCreateRecipe(recipe.strMeal);
    });
    recipeListItem.append(recipe.strMeal);
    return recipeListItem;
  });

  recipesList.append(...recipeListItems);
  recipesSection.append(recipesList);
}

async function fetchRecipesByCategory(category) {
  const result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.strCategory}`
  );

  if (!result.ok) {
    throw new Error("recipes for category fetch invalid");
  }

  const json = await result.json();
  const { meals } = json;
  return meals;
}

async function fetchAndCreateRecipe(recipeName) {
  const recipeDetailSection = document.getElementById("recipeDetailSection");
  recipeDetailSection.innerHTML = "Loading...";

  const recipe = await fetchRecipeByName(recipeName);

  recipeDetailSection.innerHTML = "";
  const recipeTitle = document.createElement("p");
  recipeTitle.innerHTML = `Recipe Title: ${recipe.strMeal}`;
  const recipeTypes = document.createElement("p");
  recipeTypes.innerHTML = `Meal Types: ${
    recipe.strTags ? recipe.strTags : "No type"
  }`;
  const recipeIngredientsList = document.createElement("ul");

  let ingredientCount = 1;
  do {
    const ingredientKey = `strIngredient${ingredientCount}`;
    const measureKey = `strMeasure${ingredientCount}`;

    if (!recipe[ingredientKey] || !recipe[measureKey]) {
      break;
    }

    const ingredientListItem = document.createElement("li");
    ingredientListItem.append(`${recipe[measureKey]} ${recipe[ingredientKey]}`);

    recipeIngredientsList.append(ingredientListItem);
    ingredientCount++;
  } while (true);

  const recipeInstruction = document.createElement("span");
  recipeInstruction.innerHTML = `Instructions: ${recipe.strInstructions}`;

  recipeDetailSection.append(
    recipeTitle,
    recipeTypes,
    recipeIngredientsList,
    recipeInstruction
  );
}

async function fetchRecipeByName(recipeName) {
  const result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`
  );

  if (!result.ok) {
    throw new Error("fetch individual recipe failed");
  }

  const json = await result.json();
  const { meals } = json;
  return meals[0];
}
