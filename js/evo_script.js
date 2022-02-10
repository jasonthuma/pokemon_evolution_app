var userInput = $("#searchName");

/*
    This function takes a string representing the name of a pokemon and
    uses it in a get request for the pokemon_species data from the pokeapi
    If the name is invalid it will alert the user otherwise it will pass
    the evolution_chain url to another function to get the evolution tree for
    the requested pokemon
*/
function getPokemonSpeciesData(name) {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`, {
        method: 'GET'})
    .then(checkError)
    .then(data => {
        placePokemonOnPage(data);
    }).catch(() => {
        alert('Invalid name, try again');
    })  
}

/*
    Function to get the evolution chain data from an input of a url directed
    to the evolution chain for a previously specified pokemon.
*/
async function getEvolutionChainData(evolutionURL) {
    let response = await fetch(evolutionURL, {method: 'GET'});
    let evolveData = await response.json();
    return evolveData;
}
/*
    Function to get pokemon data from an input of a pokemon name.
    The pokemon data contains the sprite images
*/
async function getPokemonData(pokemonName) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`, {
        method: 'GET'})
    let pokemonData = await response.json();
    return pokemonData;
};

/*
    Function to parse the returned evolution data into multiple arrays.
    There is an array for names, sprite images, info and evolution triggers.
    This data is then parsed further and displayed on the page in certain
    places depending on the number of evolutions.
*/
async function placePokemonOnPage(pokemonSpeciesData) {
    let chain, pokeName1 = [], pokeName2 = [], pokeName3 = [];
    let sprites1 = [], sprites2 = [], sprites3 = [[],[],[]];
    let pokeArray = [], pokeInfo1 = [], pokeInfo2 = [], pokeInfo3 = [];
    let triggers12 = [], triggers23 = [];
    let evolveData = await getEvolutionChainData(pokemonSpeciesData.evolution_chain.url);
    chain = evolveData.chain;
    console.log('Chain:', chain);
    pokeName1.push(capitalizeFirstLetter(chain.species.name));
    pokeArray.push(pokeName1);

    if(chain.evolves_to.length != 0) {
        for (let i = 0; i < chain.evolves_to.length; i++) {
            pokeName2.push(capitalizeFirstLetter(chain.evolves_to[i].species.name));
        }
        pokeArray.push(pokeName2);
    }
    if(chain.evolves_to.length == 2 && chain.evolves_to[0].evolves_to.length == 1 && chain.evolves_to[1].evolves_to.length == 1) {
        pokeName3.push(capitalizeFirstLetter(chain.evolves_to[0].evolves_to[0].species.name));
        pokeName3.push(capitalizeFirstLetter(chain.evolves_to[1].evolves_to[0].species.name));
        pokeArray.push(pokeName3);
    }else if(chain.evolves_to.length != 0 && chain.evolves_to[0].evolves_to.length != 0) {
        for (let i = 0; i < chain.evolves_to[0].evolves_to.length; i++) {
            pokeName3.push(capitalizeFirstLetter(chain.evolves_to[0].evolves_to[i].species.name));
        }
        pokeArray.push(pokeName3);
    }
    console.log(pokeArray);
    if (pokeArray.length == 1) {
        sprites1[0] = await getPokemonData(pokeArray[0][0].toLowerCase());
        $('.singleFirstEvo').append(`<img src="${sprites1[0].sprites.front_default}" alt="${capitalizeFirstLetter(sprites1[0].name)}" width="125px">`);
        $('.singleFirstEvo').append(`<h5>${pokeArray[0][0]}</h5>`);
    } else if (pokeArray.length == 2) {
        sprites1[0] = await getPokemonData(pokeArray[0][0].toLowerCase());
        $('.doubleFirstEvo').append(`<img src="${sprites1[0].sprites.front_default}" alt="${capitalizeFirstLetter(sprites1[0].name)}" width="125px">`);
        $('.doubleFirstEvo').append(`<h5>${pokeArray[0][0]}</h5>`);
        if (pokeArray[1].length == 1) {
            sprites2[0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${sprites2[0].sprites.front_default}" alt="${capitalizeFirstLetter(sprites2[0].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
        } else if (pokeArray[1].length == 2) {
            sprites2[0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${sprites2[0].sprites.front_default}" alt="${capitalizeFirstLetter(sprites2[0].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            sprites2[1] = await getPokemonData(pokeArray[1][1].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${sprites2[1].sprites.front_default}" alt="${capitalizeFirstLetter(sprites2[1].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][1]}</h5>`);
        } else if (pokeArray[1].length == 3) {
            sprites2[0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${sprites2[0].sprites.front_default}" alt="${capitalizeFirstLetter(sprites2[0].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            sprites2[1] = await getPokemonData(pokeArray[1][1].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${sprites2[1].sprites.front_default}" alt="${capitalizeFirstLetter(sprites2[1].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][1]}</h5>`);
            sprites2[2] = await getPokemonData(pokeArray[1][2].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${sprites2[2].sprites.front_default}" alt="${capitalizeFirstLetter(sprites2[2].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][2]}</h5>`);
        } else if (pokeArray[1].length == 8) { //special case for Eevee
            sprites2[0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${sprites2[0].sprites.front_default}" alt="${capitalizeFirstLetter(sprites2[0].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            sprites2[1] = await getPokemonData(pokeArray[1][1].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${sprites2[1].sprites.front_default}" alt="${capitalizeFirstLetter(sprites2[1].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][1]}</h5>`);
            sprites2[2] = await getPokemonData(pokeArray[1][2].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${sprites2[2].sprites.front_default}" alt="${capitalizeFirstLetter(sprites2[2].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][2]}</h5>`);
            sprites2[3] = await getPokemonData(pokeArray[1][3].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${sprites2[3].sprites.front_default}" alt="${capitalizeFirstLetter(sprites2[3].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][3]}</h5>`);
            sprites2[4] = await getPokemonData(pokeArray[1][4].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${sprites2[4].sprites.front_default}" alt="${capitalizeFirstLetter(sprites2[4].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][4]}</h5>`);
            sprites2[5] = await getPokemonData(pokeArray[1][5].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${sprites2[5].sprites.front_default}" alt="${capitalizeFirstLetter(sprites2[5].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][5]}</h5>`);
            sprites2[6] = await getPokemonData(pokeArray[1][6].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${sprites2[6].sprites.front_default}" alt="${capitalizeFirstLetter(sprites2[6].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][6]}</h5>`);
            sprites2[7] = await getPokemonData(pokeArray[1][7].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${sprites2[7].sprites.front_default}" alt="${capitalizeFirstLetter(sprites2[7].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][7]}</h5>`);
        }   
    } else if (pokeArray.length == 3) {
        sprites3[0][0] = await getPokemonData(pokeArray[0][0].toLowerCase());
        $('.tripleFirstEvo').append(`<img src="${sprites3[0][0].sprites.front_default}" alt="${capitalizeFirstLetter(sprites3[0][0].name)}" width="125px">`);
        $('.tripleFirstEvo').append(`<h5>${pokeArray[0][0]}</h5>`);
        if (pokeArray[1].length == 1) {
            sprites3[1][0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            $('.tripleSecondEvo').append(`<img src="${sprites3[1][0].sprites.front_default}" alt="${capitalizeFirstLetter(sprites3[1][0].name)}" width="125px">`);
            $('.tripleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
        } else if (pokeArray[1].length == 2) {
            sprites3[1][0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            $('.tripleSecondEvo').append(`<img src="${sprites3[1][0].sprites.front_default}" alt="${capitalizeFirstLetter(sprites3[1][0].name)}" width="125px">`);
            $('.tripleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            sprites3[1][1] = await getPokemonData(pokeArray[1][1].toLowerCase());
            $('.tripleSecondEvo').append(`<img src="${sprites3[1][1].sprites.front_default}" alt="${capitalizeFirstLetter(sprites3[1][1].name)}" width="125px">`);
            $('.tripleSecondEvo').append(`<h5>${pokeArray[1][1]}</h5>`);
        }
        if (pokeArray[2].length == 1) {
            sprites3[2][0] = await getPokemonData(pokeArray[2][0].toLowerCase());
            $('.tripleThirdEvo').append(`<img src="${sprites3[2][0].sprites.front_default}" alt="${capitalizeFirstLetter(sprites3[2][0].name)}" width="125px">`);
            $('.tripleThirdEvo').append(`<h5>${pokeArray[2][0]}</h5>`);
        } else if (pokeArray[2].length == 2) {
            sprites3[2][0] = await getPokemonData(pokeArray[2][0].toLowerCase());
            $('.tripleThirdEvo').append(`<img src="${sprites3[2][0].sprites.front_default}" alt="${capitalizeFirstLetter(sprites3[2][0].name)}" width="125px">`);
            $('.tripleThirdEvo').append(`<h5>${pokeArray[2][0]}</h5>`);
            sprites3[2][1] = await getPokemonData(pokeArray[2][1].toLowerCase());
            $('.tripleThirdEvo').append(`<img src="${sprites3[2][1].sprites.front_default}" alt="${capitalizeFirstLetter(sprites3[2][1].name)}" width="125px">`);
            $('.tripleThirdEvo').append(`<h5>${pokeArray[2][1]}</h5>`);
        }
    }
}

/*
    Make sure the response from the api is in a good status
    Throw a new error otherwise
*/
function checkError(response) {
    if (response.status >= 200 && response.status <= 299) {
        return response.json();
    } else {
        throw Error(response.statusText);
    }
}

/*
    Function to make the first letter in a string uppercase
    Used for the data that gets displayed to the user
*/
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/*
    When search button is clicked:
    *Remove any previously populated content from prior searches
    *Trigger the search by calling the get function with the user data
*/
$('#searchBtn').click(() => {
    let searchString = userInput.val().toLowerCase();
    $('.singleFirstEvo').empty();
    $('.doubleFirstEvo').empty();
    $('.doubleSecondEvo').empty();
    $('.tripleFirstEvo').empty();
    $('.tripleSecondEvo').empty();
    $('.tripleThirdEvo').empty();
    getPokemonSpeciesData(searchString);
});

/*
    Trigger the search if the enter is pressed when the input box is 
    highlighted
*/
    userInput.keyup((event)=>{
    if (event.keyCode === 13) {
        $('#searchBtn').click();
    }
});   