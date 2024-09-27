async function fillAlcoholOptions() {
  const alcoholElem = document.querySelector("#alcohol");

  const alcoholReq = await fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list"
  );
  const alcohol = await alcoholReq.json();

  for (const drink of alcohol.drinks) {
    const elem = document.createElement("option");
    elem.value = drink.strAlcoholic;
    elem.innerText = drink.strAlcoholic;

    if (getUrlParams().alcohol === elem.value) {
      elem.selected = true;
    }

    alcoholElem.appendChild(elem);
  }
}

async function fillIngredientOptions() {
  const ingredientsElem = document.querySelector("#ingredient");

  const ingredientsReq = await fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list"
  );
  const ingredients = await ingredientsReq.json();

  for (const ingredient of ingredients.drinks) {
    const elem = document.createElement("option");
    elem.value = ingredient.strIngredient1;
    elem.innerText = ingredient.strIngredient1;

    if (getUrlParams().ingredient === elem.value) {
      elem.selected = true;
    }

    ingredientsElem.appendChild(elem);
  }
}

function getUrlParams() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  let ingredient = urlParams.get("ingredient");

  if (ingredient === "null") {
    ingredient = null;
  }

  let alcohol = urlParams.get("alcohol");

  if (alcohol === "null") {
    alcohol = null;
  }

  let name = urlParams.get("name");

  // Si name es vacio, pero hay alcohol o ingrediente, entonces name pasa a ser null
  // Si name es vacio y no hay alcohol ni ingrediente, entonces name queda como "" para mostrar todos
  if (
    name !== null &&
    name.length === 0 &&
    (alcohol !== null || ingredient !== null)
  ) {
    name = null;
  }

  return {
    name,
    ingredient,
    alcohol,
  };
}

function fillInputs() {
  const { name, ingredient, alcohol } = getUrlParams();

  if (name) {
    document.querySelector("#name").value = name;
  }
  if (ingredient) {
    document.querySelector("#ingredient").value = ingredient;
  }
  if (alcohol) {
    document.querySelector("#alcohol").value = alcohol;
  }
}

async function getResults() {
  const { name, ingredient, alcohol } = getUrlParams();

  let url = null;
  if (name !== null) {
    url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`;
  } else if (ingredient) {
    url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`;
  } else if (alcohol) {
    url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${alcohol}`;
  }

  if (!url) {
    return;
  }

  const resultsElem = document.querySelector("#results");
  const req = await fetch(url);
  const data = await req.json();

  if (!data.drinks) {
    resultsElem.innerHTML = `
      <span class="text-primary-600 font-bold text-xl">No hay resultados</span>
    `;
    return;
  }

  resultsElem.innerHTML = data.drinks
    .map((drink) => {
      return `
        <a href="../cocktail/?id=${drink.idDrink}" class="grid grid-rows-auto-1fr items-center justify-center max-w-10 p-1 font-bold text-primary-600 bg-primary-200 border rounded transition hover-scale">
            ${drink.strDrink}
            <img class="w-full mt-1 rounded" src="${drink.strDrinkThumb}" />
        </a>
      `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  fillInputs();
  fillAlcoholOptions();
  fillIngredientOptions();
  getResults();
});
