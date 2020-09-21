//Initialise all required items
var homeButton = document.getElementById("home-button");
var favouriteButton = document.getElementById("favourite-button");
var tabno = 1;
var homeContainer = document.getElementById("home-container");
var favouritesContainer = document.getElementById("favourites-container");
var characterList = document.getElementById("character-list");
var favouritesList = [];
//Local storage to make favourites list persistent
var favouritesArray = JSON.parse(localStorage.getItem("favouritesList"));

if(favouritesArray != null) {
    favouritesList = favouritesArray;
}

var searchBox = document.getElementById("search-box");
let ans = {};
let results = [];

var searchList = document.getElementById("search-list");

var profile = document.getElementById("popup");

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

//Opening profile of hero
const openProfile = async(id) => {
    try {
        const res = await fetch(`https://www.superheroapi.com/api.php/1747613848727847/${id}`);
        character = await res.json();
        profile.innerHTML = (
            `
                <h1 id="character-name">${character.name}</h1>
                <img id="character-image" src="${character.image.url}"></img>
                <p id="close-button" onclick="closeProfile()">X</p>
                <div id="details-container">
                    <p id="character-id">id: ${character.id}</p>
                    <p id="gender">${character.appearance.gender}</p>
                    <p id="publisher">${character.biography.publisher}</p>
                    <p id="weight">Weight: ${character.appearance.weight[0]}</p>
                    <p id="work">Occupation: ${character.work.occupation}</p>
                    <h2>Powerstats</h2>
                    <p id="combat">Combat: ${character.powerstats.combat}</p>
                    <p id="durability">Durability: ${character.powerstats.durability}</p>
                    <p id="intelligence">Intelligence: ${character.powerstats.intelligence}</p>
                    <p id="power">Power: ${character.powerstats.power}</p>
                    <p id="speed">Speed: ${character.powerstats.speed}</p>
                    <p id="strength">Strength: ${character.powerstats.strength}</p>
                </div>
            `
        );
        profile.style.display = "block";    
    } catch (err) {
        console.error(err);
    }
}

const closeProfile = () => {
    profile.style.display = "none";
}

//Displaying heroes when searched
const displayCharacters = (characters) => {
    const htmlString = characters.map((character) => {
            return `
                <li class="character">
                    <h2 class="character-name" onclick="openProfile(${character.id})">${character.name}</h2>
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
                        <p id="character-id">id: ${character.id}</p>
                        <img class="character-image" src="${character.image.url}"></img>
                        <h2 id="character-name" onclick="openProfile(${character.id})">${character.name}</h2>
                        <p class="gender">${character.appearance.gender}</p>
                        <p class="publisher">${character.biography.publisher}</p>
                        <button class="remove-from-favourites" data-id=${character.id} onclick="removeCharacter(${character.id})">
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