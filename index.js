fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then((result) => {
    return result.json();
  })
  .then(({ categories }) => {
    const categoriesList = document.getElementById("mealCategoriesList");
    categoriesList.innerHTML = "";

    categories.forEach((category) => {
      const listItem = document.createElement("li");
      listItem.append(category.strCategory);
      listItem.addEventListener("click", () => {
        fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.strCategory}`
        )
          .then((result) => {
            return result.json();
          })
          .then((recipes) => {
            const recipesList = document.getElementById("recipesList");
            recipesList.innerHTML = "";
            recipes.meals.forEach((recipe) => {
              const recipeListItem = document.createElement("li");
              recipeListItem.append(recipe.strMeal);
              recipesList.append(recipeListItem);
            });
          });
      });
      categoriesList.append(listItem);
    });
  });
