const userInput = $("#searchName");
const singleDiv = '.singleFirstEvo', dblFirst = '.doubleFirstEvo', dblSecond1 = '.doubleSecondEvo1', dblSecond2 = '.doubleSecondEvo2', dblSecond3 = '.doubleSecondEvo3',
dblSecond4 = '.doubleSecondEvo4', dblSecond5 = '.doubleSecondEvo5', dblSecond6 = '.doubleSecondEvo6', dblSecond7 = '.doubleSecondEvo7', dblSecond8 = '.doubleSecondEvo8',
trplFirst = '.tripleFirstEvo', trplSecond1 = '.tripleSecondEvo1', trplSecond2 = '.tripleSecondEvo2', trplThird1 = '.tripleThirdEvo1', trplThird2 = '.tripleThirdEvo2',
triple12 = '.triple12', triple23 = '.triple23', double12 = '.double12', down = 'down', left = 'left', right = 'right', horiz = 'horizontal', up = 'up',
triple23a = '.triple23a', triple23b = '.triple23b';
/*
    This function takes a string representing the name of a pokemon and
    uses it in a get request for the pokemon_species data from the pokeapi
    If the name is invalid it will alert the user otherwise it will pass
    the returned data to another function to get the evolution tree for
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
    Async function to get pokemon species data from an input of a pokemon name.
    This data will have the id of the pokemon which is needed for display.
    The only difference here from the getPokemonSpeciesData is it needs to be
    async to assign the result to a new variable. 
*/
async function asyncPokemonSpeciesData(pokemonName) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`, {
        method: 'GET'})
    let speciesData = await response.json();
    return speciesData;
}

/*
    Function to parse the returned evolution data into multiple arrays.
    There is an array for names, pokemon info, and a variable containing the evolution chain.
    This data is then parsed further and displayed on the page in certain
    places depending on the number of evolutions.
*/
async function placePokemonOnPage(pokemonSpeciesData) {
    let chain, pokeNames = [[],[],[]], pokeInfo = [[],[],[]], speciesInfo = [[],[],[]];
    let pokeArray = [];
    let evolveData = await getEvolutionChainData(pokemonSpeciesData.evolution_chain.url);
    chain = evolveData.chain;
    console.log(chain);
    pokeNames[0].push(capitalizeFirstLetter(chain.species.name));
    pokeArray.push(pokeNames[0]);
    let pokeSpecies1 = await asyncPokemonSpeciesData(chain.species.name);
    speciesInfo[0].push(pokeSpecies1);
    console.log(speciesInfo);
    if(chain.evolves_to.length != 0) {
        for (let i = 0; i < chain.evolves_to.length; i++) {
            pokeNames[1].push(capitalizeFirstLetter(chain.evolves_to[i].species.name));
            let pokeSpecies2 = await asyncPokemonSpeciesData(chain.evolves_to[i].species.name);
            speciesInfo[1].push(pokeSpecies2);
        }
        pokeArray.push(pokeNames[1]);
    }
    if(chain.evolves_to.length == 2 && chain.evolves_to[0].evolves_to.length == 1 && chain.evolves_to[1].evolves_to.length == 1) {
        pokeNames[2].push(capitalizeFirstLetter(chain.evolves_to[0].evolves_to[0].species.name));
        let pokeSpecies31 = await asyncPokemonSpeciesData(chain.evolves_to[0].evolves_to[0].species.name);
        speciesInfo[2].push(pokeSpecies31);
        pokeNames[2].push(capitalizeFirstLetter(chain.evolves_to[1].evolves_to[0].species.name));
        let pokeSpecies32 = await asyncPokemonSpeciesData(chain.evolves_to[1].evolves_to[0].species.name);
        speciesInfo[2].push(pokeSpecies32);
        pokeArray.push(pokeNames[2]);
    }else if(chain.evolves_to.length != 0 && chain.evolves_to[0].evolves_to.length != 0) {
        for (let i = 0; i < chain.evolves_to[0].evolves_to.length; i++) {
            pokeNames[2].push(capitalizeFirstLetter(chain.evolves_to[0].evolves_to[i].species.name));
            let pokeSpecies3 = await asyncPokemonSpeciesData(chain.evolves_to[0].evolves_to[i].species.name);
            speciesInfo[2].push(pokeSpecies3);
        }
        pokeArray.push(pokeNames[2]);
    }
    //console.log('pokeArray:',pokeArray);
    //console.log('speciesArray:',speciesInfo);
    if (pokeArray.length == 1) {
        pokeInfo[0][0] = await getPokemonData(pokeArray[0][0].toLowerCase());
        renderPokeCard(pokeArray[0][0], pokeInfo[0][0], speciesInfo[0][0], singleDiv); 
    } else if (pokeArray.length == 2) {
        pokeInfo[0][0] = await getPokemonData(pokeArray[0][0].toLowerCase());
        renderPokeCard(pokeArray[0][0], pokeInfo[0][0], speciesInfo[0][0], dblFirst);
        if (pokeArray[1].length == 1 && pokeArray[0][0] != "Kubfu" && pokeArray[0][0] != "Toxel" && pokeArray[0][0] != "Rockruff") {
            pokeInfo[1][0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            renderPokeCard(pokeArray[1][0], pokeInfo[1][0], speciesInfo[1][0], dblSecond1);
            renderArrow(down, double12);
        } else if (pokeArray[1].length == 1 && pokeArray[0][0] == "Rockruff") {//special case for rockruff
            pokeInfo[1][0] = await getPokemonData('lycanroc-midday');
            renderPokeCardForms(pokeArray[1][0], pokeInfo[1][0], speciesInfo[1][0], dblSecond1, 'Midday Form');
            renderArrow(left, double12);
            pokeInfo[1][1] = await getPokemonData('lycanroc-midnight');
            renderPokeCardForms(pokeArray[1][0], pokeInfo[1][1], speciesInfo[1][1], dblSecond2, 'Midnight Form');
            renderArrow(down, double12);
            pokeInfo[1][2] = await getPokemonData('lycanroc-dusk');
            renderPokeCardForms(pokeArray[1][0], pokeInfo[1][2], speciesInfo[1][1], dblSecond3, 'Dusk Form');
            renderArrow(right, double12);
        }else if (pokeArray[1].length == 1 && pokeArray[0][0] == "Toxel") {//special case for toxel
            pokeInfo[1][0] = await getPokemonData('toxtricity-low-key');
            renderPokeCardForms(pokeArray[1][0], pokeInfo[1][0], speciesInfo[1][0], dblSecond1, 'Low Key Form');
            renderArrow(left, double12);
            pokeInfo[1][1] = await getPokemonData('toxtricity-amped');
            renderPokeCardForms(pokeArray[1][0], pokeInfo[1][1], speciesInfo[1][1], dblSecond2, 'Amped Form');
            renderArrow(right, double12);
        }else if (pokeArray[1].length == 1 && pokeArray[0][0] == "Kubfu") {//special case for kubfu
            pokeInfo[1][0] = await getPokemonData('urshifu-rapid-strike');
            renderPokeCardForms(pokeArray[1][0], pokeInfo[1][0], speciesInfo[1][0], dblSecond1, 'Rapid Strike');
            renderArrow(left, double12);
            pokeInfo[1][1] = await getPokemonData('urshifu-single-strike');
            renderPokeCardForms(pokeArray[1][0], pokeInfo[1][1], speciesInfo[1][1], dblSecond2, 'Single Strike');
            renderArrow(right, double12);
        }else if (pokeArray[1].length == 2 && pokeArray[0][0] != "Burmy") {
            pokeInfo[1][0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            renderPokeCard(pokeArray[1][0], pokeInfo[1][0], speciesInfo[1][0], dblSecond1)
            renderArrow(left, double12);
            pokeInfo[1][1] = await getPokemonData(pokeArray[1][1].toLowerCase());
            renderPokeCard(pokeArray[1][1], pokeInfo[1][1], speciesInfo[1][1], dblSecond2);
            renderArrow(right, double12);
        } else if (pokeArray[1].length == 2 && pokeArray[0][0] == "Burmy") {//special case for burmy & forms
            pokeInfo[1][0] = await getPokemonData('wormadam-plant');
            renderPokeCardForms(pokeArray[1][0], pokeInfo[1][0], speciesInfo[1][0], dblSecond1, 'Plant Cloak');
            renderArrow(left, double12);
            pokeInfo[1][1] = await getPokemonData('wormadam-sandy');
            renderPokeCardForms(pokeArray[1][0], pokeInfo[1][1], speciesInfo[1][1], dblSecond2, 'Sandy Cloak');
            renderArrow(left, double12);
            pokeInfo[1][2] = await getPokemonData('wormadam-trash');
            renderPokeCardForms(pokeArray[1][0], pokeInfo[1][2], speciesInfo[1][2], dblSecond3, 'Trash Cloak');
            renderArrow(right, double12);
            pokeInfo[1][3] = await getPokemonData(pokeArray[1][1].toLowerCase());
            renderPokeCard(pokeArray[1][1], pokeInfo[1][3], speciesInfo[1][3], dblSecond4);
            renderArrow(right, double12);
        }else if (pokeArray[1].length == 3) {
            pokeInfo[1][0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            renderPokeCard(pokeArray[1][0], pokeInfo[1][0], speciesInfo[1][0], dblSecond1);
            renderArrow(left, double12);
            pokeInfo[1][1] = await getPokemonData(pokeArray[1][1].toLowerCase());
            renderPokeCard(pokeArray[1][1], pokeInfo[1][1], speciesInfo[1][1], dblSecond2);
            renderArrow(down, double12);
            pokeInfo[1][2] = await getPokemonData(pokeArray[1][2].toLowerCase());
            renderPokeCard(pokeArray[1][2], pokeInfo[1][2], speciesInfo[1][2], dblSecond3);
            renderArrow(right, double12);
            
        } else if (pokeArray[1].length == 8) { //special case for Eevee
            pokeInfo[1][0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            renderPokeCard(pokeArray[1][0], pokeInfo[1][0], speciesInfo[1][0], dblSecond1);
            pokeInfo[1][1] = await getPokemonData(pokeArray[1][1].toLowerCase());
            renderPokeCard(pokeArray[1][1], pokeInfo[1][1], speciesInfo[1][1], dblSecond2);
            pokeInfo[1][2] = await getPokemonData(pokeArray[1][2].toLowerCase());
            renderPokeCard(pokeArray[1][2], pokeInfo[1][2], speciesInfo[1][2], dblSecond3);
            pokeInfo[1][3] = await getPokemonData(pokeArray[1][3].toLowerCase());
            renderPokeCard(pokeArray[1][3], pokeInfo[1][3], speciesInfo[1][3], dblSecond4);
            pokeInfo[1][4] = await getPokemonData(pokeArray[1][4].toLowerCase());
            renderPokeCard(pokeArray[1][4], pokeInfo[1][4], speciesInfo[1][4], dblSecond5);
            pokeInfo[1][5] = await getPokemonData(pokeArray[1][5].toLowerCase());
            renderPokeCard(pokeArray[1][5], pokeInfo[1][5], speciesInfo[1][5], dblSecond6);
            pokeInfo[1][6] = await getPokemonData(pokeArray[1][6].toLowerCase());
            renderPokeCard(pokeArray[1][6], pokeInfo[1][6], speciesInfo[1][6], dblSecond7);
            pokeInfo[1][7] = await getPokemonData(pokeArray[1][7].toLowerCase());
            renderPokeCard(pokeArray[1][7], pokeInfo[1][7], speciesInfo[1][7], dblSecond8);
        }   
    } else if (pokeArray.length == 3) {
        pokeInfo[0][0] = await getPokemonData(pokeArray[0][0].toLowerCase());
        renderPokeCard(pokeArray[0][0], pokeInfo[0][0], speciesInfo[0][0], trplFirst);
        if (pokeArray[1].length == 1) {
            pokeInfo[1][0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            renderPokeCard([pokeArray[1][0]], pokeInfo[1][0], speciesInfo[1][0], trplSecond1);
            renderArrow(down, triple12);
        } else if (pokeArray[1].length == 2) {
            pokeInfo[1][0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            renderPokeCard(pokeArray[1][0], pokeInfo[1][0], speciesInfo[1][0], trplSecond1);
            renderArrow(left, triple12);
            pokeInfo[1][1] = await getPokemonData(pokeArray[1][1].toLowerCase());
            renderPokeCard(pokeArray[1][1], pokeInfo[1][1], speciesInfo[1][1], trplSecond2);
            renderArrow(right, triple12);
        }
        if (pokeArray[2].length == 1) {
            pokeInfo[2][0] = await getPokemonData(pokeArray[2][0].toLowerCase());
            renderPokeCard(pokeArray[2][0], pokeInfo[2][0], speciesInfo[2][0], trplThird1);
            renderArrow(down, triple23a);
        } else if (pokeArray[2].length == 2) {
            pokeInfo[2][0] = await getPokemonData(pokeArray[2][0].toLowerCase());
            renderPokeCard( pokeArray[2][0], pokeInfo[2][0], speciesInfo[2][0], trplThird1);
            if (pokeArray[1].length == 2) {
                renderArrow(down, triple23a);
            } else {
                renderArrow(left, triple23a);
            }
            pokeInfo[2][1] = await getPokemonData(pokeArray[2][1].toLowerCase());
            renderPokeCard(pokeArray[2][1], pokeInfo[2][1], speciesInfo[2][1], trplThird2);
            if (pokeArray[1].length == 2) {
                renderArrow(down, triple23b);
            } else {
                renderArrow(right, triple23a);
            }
        }
    }
}
/*
    Function to add the information of a pokemon to the page
*/
function renderPokeCard(name, pokeInfo, speciesInfo, div) {
    $(div).append(`<img src="${pokeInfo.sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo.name)}" width="125px">`);
    $(div).append(`<p class="mb-0">#${speciesInfo.id}</p>`);
    $(div).append(`<h5>${name}</h5>`);
    if (pokeInfo.types.length == 1) {
        $(div).append(`<span class="${pokeInfo.types[0].type.name}">${capitalizeFirstLetter(pokeInfo.types[0].type.name)}</span><br>`)
    } else {
        $(div).append(`<span class="${pokeInfo.types[0].type.name}">${capitalizeFirstLetter(pokeInfo.types[0].type.name)}</span>`)
        $(div).append(`<span class="${pokeInfo.types[1].type.name}">${capitalizeFirstLetter(pokeInfo.types[1].type.name)}</span><br>`)
    }
}
/*
    Function to add the information of pokemon with specific forms
*/
function renderPokeCardForms(name, pokeInfo, speciesInfo, div, form) {
    $(div).append(`<img src="${pokeInfo.sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo.name)}" width="125px">`);
    $(div).append(`<p class="mb-0">#${speciesInfo.id}</p>`);
    $(div).append(`<h5>${name}</h5>`);
    $(div).append(`<p class="mb-0">${form}</p>`);
    if (pokeInfo.types.length == 1) {
        $(div).append(`<span class="${pokeInfo.types[0].type.name}">${capitalizeFirstLetter(pokeInfo.types[0].type.name)}</span><br>`)
    } else {
        $(div).append(`<span class="${pokeInfo.types[0].type.name}">${capitalizeFirstLetter(pokeInfo.types[0].type.name)}</span>`)
        $(div).append(`<span class="${pokeInfo.types[1].type.name}">${capitalizeFirstLetter(pokeInfo.types[1].type.name)}</span><br>`)
    }
}


/*
    Function to add the proper arrow to the page
*/
function renderArrow(direction, div) {
    if (direction == "down") {
        $(div).append('<picture><source media = "(min-width: 576px)" srcset="/img/arrow_horiz.png"><img src="/img/arrow_down.png" alt="arrow" class"img-fluid"></picture>');
    } else if (direction == "left") {
        $(div).append('<picture><source media = "(min-width: 575px)" srcset="/img/arrow_lg_up.png"><img src="/img/arrow_left.png" alt="arrow"></picture>');
    } else if (direction == "right") {
        $(div).append('<picture><source media = "(min-width: 575px)" srcset="/img/arrow_lg_down.png"><img src="/img/arrow_right.png" alt="arrow"></picture>');
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
    $(singleDiv).empty();
    $(dblFirst).empty();
    $(dblSecond1).empty();
    $(dblSecond2).empty();
    $(dblSecond3).empty();
    $(dblSecond4).empty();
    $(dblSecond5).empty();
    $(dblSecond6).empty();
    $(dblSecond7).empty();
    $(dblSecond8).empty();
    $(trplFirst).empty();
    $(trplSecond1).empty();
    $(trplSecond2).empty();
    $(trplThird1).empty();
    $(trplThird2).empty();
    $('.triple12').empty();
    $('.triple23a').empty();
    $('.triple23b').empty();
    $('.double12').empty();
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

