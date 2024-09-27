// Función para retroceder a la página anterior
function goBack() {
    window.history.back();
}

// Función para obtener el parámetro del nombre del ingrediente en la URL
function getIngredientNameFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('name');
}

// Función para buscar los detalles del ingrediente en la API de TheCocktailDB
function fetchIngredientDetails(ingredient) {
    const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${ingredient}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const ingredientData = data.ingredients[0]; // Obtenemos los datos del primer ingrediente
            displayIngredientDetails(ingredientData);
        })
        .catch(error => console.error('Error al obtener los datos del ingrediente:', error));
}

// Función para mostrar los detalles del ingrediente en la página
function displayIngredientDetails(ingredient) {
    document.getElementById('ingredient-name').innerText = ingredient.strIngredient;
    document.getElementById('ingredient-id').innerText = ingredient.idIngredient;
    document.getElementById('ingredient-description').innerText = ingredient.strDescription || 'This item has no description';
    document.getElementById('ingredient-type').innerText = ingredient.strType || 'Unknown type';
    document.getElementById('ingredient-alcoholic').innerText = ingredient.strAlcohol === 'Yes' ? 'Yes' : 'No';
    document.getElementById('ingredient-abv').innerText = ingredient.strABV ? `${ingredient.strABV}%` : 'Not available';

    // Reemplazar los espacios en el nombre del ingrediente por %20
    const ingredientNameFormatted = ingredient.strIngredient.replace(/ /g, '%20');
    const imageUrl = `https://www.thecocktaildb.com/images/ingredients/${ingredientNameFormatted}.png`;

    // Asignar la URL de la imagen o una por defecto
    document.getElementById('ingredient-img').src = imageUrl;
}

// Obtener el nombre del ingrediente desde el URL y buscar sus detalles
const ingredientName = getIngredientNameFromUrl().replace(/_/g, ' '); // Reemplazamos los _ por espacios
fetchIngredientDetails(ingredientName);