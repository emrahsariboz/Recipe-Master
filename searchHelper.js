const API = "https://pure-chamber-65117.herokuapp.com/recipe";

function search() {
  var $inputs = $('#ingredients-form :input');
  var allInputs = [];
  $inputs.each(function() {
    allInputs.push($(this).val());
  })
  const cleanedInputs = allInputs.filter(i => {
    return i != "";
  });
  function combine(text, i) {
    return text + `,${i}`;
  }
  var ingredients = cleanedInputs.reduce(combine);
  $.ajax({
    type: "GET",
    url: "https://pure-chamber-65117.herokuapp.com/search/" + ingredients,
    success: (recipe) => {
      const recipeList = recipe.body.recipes.map(recipe => {
        return {
          title: recipe.title,
          url: recipe.source_url,
          author: recipe.publisher,
          recipe_id: recipe.recipe_id,
          image_url: recipe.image_url
        }
      });
      for (let i = 0; i < 6; i+=2) {

        const title = recipeList[i].title;
        const image_url = recipeList[i].image_url;
        const url = recipeList[i].url;
        const author = recipeList[i].author;
        const recipe_id = recipeList[i].recipe_id;

        const title2 = recipeList[i+1].title;
        const image_url2 = recipeList[i+1].image_url;
        const url2 = recipeList[i+1].url;
        const author2 = recipeList[i+1].author;
        const recipe_id2 = recipeList[i+1].recipe_id;

        const carouselItem = `
          <div class = "container">
            <div class = "row">
              <div class = "col-md-6 col-xs-6">
                <img height="200" width="300" src="${image_url}"  style="margin:7px 0px;" />
                <h4><a href="${url}" class="recipe" style = "color:red; width:80%; background-color:black; color:white; text-align:center; padding:10px; margin-top:15px;">${title}</a>
                <button class="btn add-more" onclick="save('${title}', '${url}', '${author}', '${recipe_id}', '${image_url}')">+</button></h4>
              </div>
              <div class = "col-md-6 col-xs-6">
                <img height="200" width="300" src="${image_url2}" style="margin:7px 0px;"/>
                <h4> <a href="${url2}" class="recipe" style = "color:red; width:80%; margin-top:15px; background-color:black; color:white; text-align:center; padding:10px;">${title2}</a>
                <button class="btn add-more" onclick="save('${title2}', '${url2}', '${author2}', '${recipe_id2}', '${image_url2}')">+</button></h4>
              </div>
            </div>
            <div class = "row">
            </div>
         </div>`
        $("#recipe-results").append(carouselItem);
      }
      /*
      for (let i = 0; i < 5; i+=2) {
        const title = recipeList[i].title;
        const image_url = recipeList[i].image_url;
        const url = recipeList[i].url;
        const author = recipeList[i].author;
        const recipe_id = recipeList[i].recipe_id;
        const carouselItem = `<div>
          <a href="${url}">${title}</a>
          <img height="200" width="300" src="${image_url}"/>
          <button class="button" onclick="save('${title}', '${url}', '${author}', '${recipe_id}', '${image_url}')">Save to Favorites</button>
        </div><br/>`
        $("#recipe-results").append(carouselItem);
      }
      */
    }
  });
}

function save(title, url, author, recipe_id, image_url) {
  const recipeObject = { title, url, author, recipe_id, image_url };
  console.log(recipeObject);
  $.ajax({
    type: "POST",
    url: API,
    headers: {"Content-Type": "application/json"},
    data: JSON.stringify(recipeObject),
    success: (recipe) => {
      const rid = recipe._id;
      const recipeItem = `<div id="${rid}">
        <img height="200" width="300" src="${recipe.image_url}"/>
        <h4 id="favorites-text">
          <a class="recipe" href="${recipe.url}">${recipe.title}</a>
          <button class="btn btn-danger remove-me" onclick="remove('${rid}')">-</button>
        </h4>
      </div>`;
      $("#favorites").append(recipeItem);
    }
  })
}

function remove(id){
  console.log(id);
  $.ajax({
    type: "DELETE",
    url: `${API}/${id}`,
    success: (recipe) => {
      const selector = `#${recipe._id}`;
      $(selector).remove();
    }
  });
}

$(function () {
  var $favorites = $("#favorites");
  $.ajax({
    type: "GET",
    url: API,
    success: (recipes) => {
      $.each(recipes, (i, recipe) => {
        const rid = recipe._id;
        const recipeItem = `<div id="${rid}">
          <img height="200" width="300" src="${recipe.image_url}"/>
          <h4 id="favorites-text">
            <a class="recipe" href="${recipe.url}">${recipe.title}</a>
            <button class="btn btn-danger remove-me" onclick="remove('${rid}')">-</button>
          </h4>
        </div>`;
        $favorites.append(recipeItem);
      });
    }
  });
});
