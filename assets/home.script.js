var homeButton = document.getElementById("home-button");
var favouriteButton = document.getElementById("favourite-button");
var tabno = 1;
var homeContainer = document.getElementById("home-container");
var favouritesContainer = document.getElementById("favourites-container");
var characterList = document.getElementById("character-list");
var favouritesList = [];
var favouritesArray = JSON.parse(localStorage.getItem("favouritesList"));

if(favouritesArray != null) {
    favouritesList = favouritesArray;
}

var searchBox = document.getElementById("search-box");
let ans = {};
let results = [];

var searchList = document.getElementById("search-list");

//Switching tab to home
function changeTabHome() {
    if(tabno != 1) {
        homeContainer.style.display = "block";
        favouritesContainer.style.display = "none";
        tabno = 1;
    }
}

//Switching tab to favourites
function changeTabFavourite() {
    if(tabno != 2) {
        homeContainer.style.display = "none";
        favouritesContainer.style.display = "block";
        tabno = 2;
        characterList.innerHTML = "";
        loadCharacters();
    }
}

//Searching a hero
const searchHero = async() => {
    let search = searchBox.value;
    try {
        const res = await fetch(`https://www.superheroapi.com/api.php/1747613848727847/search/${search}`);
        ans = await res.json();
        results = ans.results;
        displayCharacters(results);
    } catch (err) {
        console.log(err);
    }
}

//Adding hero to favourites
function addToFavorites(character) {
    favouritesList.push(character);
    localStorage.setItem("favouritesList", JSON.stringify(favouritesList));
}

//Displaying heroes when searched
const displayCharacters = (characters) => {
    const htmlString = characters.map((character) => {
            return `
                <li class="character">
                    <a href="./profile.html?id=${character.id}">
                        <h2 class="character-name">${character.name}</h2>
                    </a>
                    <img class="character-image" src="${character.image.url}"></img>
                    <h3 class="gender">${character.appearance.gender}</h3>
                    <h3 class="publisher">${character.biography.publisher}</h3>
                    <button class="add-to-favourite" data-id=${character.id} onClick="addToFavorites(${character.id})">
                        Favourite
                    </button>        
                </li>
            `
        }).join('');
    searchList.innerHTML = htmlString;
};

//Loading characters in favourites
const loadCharacters = async () => {
    favouritesList.map(async (id) => {
        try {
            const res = await fetch(`https://www.superheroapi.com/api.php/1747613848727847/${id}`);
            character = await res.json();
            const htmlString = document.createElement('div');
            htmlString.id = id;
            htmlString.innerHTML = (
                `
                    <li class="character">
                        <a href="./profile.html?id=${character.id}">
                            <h2 id="character-name">${character.name}</h2>
                        </a>
                        <p id="character-id">id: ${character.id}</p>
                        <img class="character-image" src="${character.image.url}"></img>
                        <p class="fullname">${character.appearance.gender}</p>
                
                        <p class="publisher">${character.biography.publisher}</p>
                        <button class="remove-from-favourites" data-id=${character.id} onClick="removeCharacter(${character.id})">
                            Remove
                        </button>
                                
                    </li>
                
                `
            );
            characterList.appendChild(htmlString)
        } catch (err) {
            console.error(err);
        }
    });
};
 
//Removing a character from favourites
const removeCharacter = (id) => {
    favouritesList.pop(id);
    document.getElementById(id).remove();
    localStorage.setItem("favouritesList", JSON.stringify(favouritesList));
}

//Searchbox listener
searchBox.addEventListener("keyup", searchHero);