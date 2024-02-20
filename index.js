fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then((result) => {
    return result.json();
  })
  .then(({ categories }) => {
    const categoriesList = document.getElementById("mealCategoriesList");
    categoriesList.innerHTML = "";

    categories.forEach((category) => {
      const catListItem = document.createElement("li");
      catListItem.append(category.strCategory);
      catListItem.addEventListener("click", () => {
        const recipesSection = document.getElementById("recipesSection");
        recipesSection.innerHTML = "Loading...";
        fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.strCategory}`
        )
          .then((result) => {
            return result.json();
          })
          .then((recipes) => {
            recipesSection.innerHTML = "";
            recipesSection.append("Recipes:");
            const recipesList = document.createElement("ul");

            recipes.meals.forEach((recipe) => {
              const recipeListItem = document.createElement("li");
              recipeListItem.addEventListener("click", () => {
                const recipeDetailSection = document.getElementById(
                  "recipeDetailSection"
                );
                recipeDetailSection.innerHTML = "Loading...";
                fetch(
                  `https://www.themealdb.com/api/json/v1/1/search.php?s=${recipe.strMeal}`
                )
                  .then((result) => {
                    return result.json();
                  })
                  .then(({ meals }) => {
                    const meal = meals[0];
                    recipeDetailSection.innerHTML = "";
                    const recipeTitle = document.createElement("p");
                    recipeTitle.innerHTML = `Recipe Title: ${meal.strMeal}`;
                    const recipeTypes = document.createElement("p");
                    recipeTypes.innerHTML = `Meal Types: ${
                      meal.strTags ? meal.strTags : "No type"
                    }`;
                    const recipeIngredientsList = document.createElement("ul");

                    let ingredientCount = 1;
                    do {
                      const ingredientKey = `strIngredient${ingredientCount}`;
                      const measureKey = `strMeasure${ingredientCount}`;

                      if (!meal[ingredientKey] || !meal[measureKey]) {
                        break;
                      }

                      const ingredientListItem = document.createElement("li");
                      ingredientListItem.append(
                        `${meal[measureKey]} ${meal[ingredientKey]}`
                      );

                      recipeIngredientsList.append(ingredientListItem);
                      ingredientCount++;
                    } while (true);

                    const recipeInstruction = document.createElement("span");
                    recipeInstruction.innerHTML = `Instructions: ${meal.strInstructions}`;

                    recipeDetailSection.append(
                      recipeTitle,
                      recipeTypes,
                      recipeIngredientsList,
                      recipeInstruction
                    );
                  });
              });
              recipeListItem.append(recipe.strMeal);
              recipesList.append(recipeListItem);
            });

            recipesSection.append(recipesList);
          });
      });
      categoriesList.append(catListItem);
    });
  });
