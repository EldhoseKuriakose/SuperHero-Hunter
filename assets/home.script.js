var homeButton = document.getElementById("home-button");
var favouriteButton = document.getElementById("favourite-button");
var tabno = 1;

var homeContainer = document.getElementById("home-container");
var favouritesContainer = document.getElementById("favourites-container");

var searchBox = document.getElementById("search-box");
let ans = {};
let results = [];

var searchList = document.getElementById("search-list");


function changeTabHome() {
    if(tabno != 1) {
        homeContainer.style.display = "block";
        favouritesContainer.style.display = "none";
        tabno = 1;
    }
}

function changeTabFavourite() {
    if(tabno != 2) {
        homeContainer.style.display = "none";
        favouritesContainer.style.display = "block";
        tabno = 2;
    }
}

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

searchBox.addEventListener("keyup", searchHero);