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
    There is an array for names, sprite images, type(s) and evolution triggers.
    This data is then parsed further and displayed on the page in certain
    places depending on the number of evolutions.
*/
async function placePokemonOnPage(pokemonSpeciesData) {
    let chain, pokeName1 = [], pokeName2 = [], pokeName3 = [];
    let pokeInfo = [[],[],[]];
    let pokeArray = [];
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
        $('.singleFirstEvo').append(`<h4>Basic</h4>`);
        pokeInfo[0] = await getPokemonData(pokeArray[0][0].toLowerCase());
        $('.singleFirstEvo').append(`<img src="${pokeInfo[0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[0].name)}" width="125px">`);
        $('.singleFirstEvo').append(`<h5>${pokeArray[0][0]}</h5>`);
        if (pokeInfo[0].types.length == 1) {
            $('.singleFirstEvo').append(`<span class="${pokeInfo[0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[0].types[0].type.name)}</span>`)
        } else {
            $('.singleFirstEvo').append(`<span class="${pokeInfo[0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[0].types[0].type.name)}</span>`)
            $('.singleFirstEvo').append(`<span class="${pokeInfo[0].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[0].types[1].type.name)}</span>`)
        }
        
    } else if (pokeArray.length == 2) {
        $('.doubleFirstEvo').append(`<h4>Basic</h4>`);
        pokeInfo[0] = await getPokemonData(pokeArray[0][0].toLowerCase());
        $('.doubleFirstEvo').append(`<img src="${pokeInfo[0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[0].name)}" width="125px">`);
        $('.doubleFirstEvo').append(`<h5>${pokeArray[0][0]}</h5>`);
        if (pokeInfo[0].types.length == 1) {
            $('.doubleFirstEvo').append(`<span class="${pokeInfo[0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[0].types[0].type.name)}</span>`)
        } else {
            $('.doubleFirstEvo').append(`<span class="${pokeInfo[0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[0].types[0].type.name)}</span>`)
            $('.doubleFirstEvo').append(`<span class="${pokeInfo[0].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[0].types[1].type.name)}</span>`)
        }
        if (pokeArray[1].length == 1 && pokeArray[0][0] != "Kubfu" && pokeArray[0][0] != "Toxel" && pokeArray[0][0] != "Rockruff") {
            $('.doubleSecondEvo').append(`<h4>Stage 2</h4>`);
            pokeInfo[1][0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][0].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            if (pokeInfo[1][0].types.length == 1) {
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span>`)
            } else {
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span>`)
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[1].type.name)}</span>`)
            }
        } else if (pokeArray[1].length == 1 && pokeArray[0][0] == "Rockruff") {//special case for rockruff
            $('.doubleSecondEvo').append(`<h4>Stage 2</h4>`);
            pokeInfo[1][0] = await getPokemonData('lycanroc-midday');
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][0].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            $('.doubleSecondEvo').append(`<p5>Midday Form</p>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span><br>`)
            pokeInfo[1][1] = await getPokemonData('lycanroc-midnight');
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][1].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][1].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            $('.doubleSecondEvo').append(`<p5>Midnight Form</p>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][1].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[0].type.name)}</span><br>`)
            pokeInfo[1][2] = await getPokemonData('lycanroc-dusk');
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][2].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][2].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            $('.doubleSecondEvo').append(`<p5>Dusk Form</p>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][2].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][2].types[0].type.name)}</span>`)
        }else if (pokeArray[1].length == 1 && pokeArray[0][0] == "Toxel") {//special case for toxel
            $('.doubleSecondEvo').append(`<h4>Stage 2</h4>`);
            pokeInfo[1][0] = await getPokemonData('toxtricity-low-key');
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][0].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            $('.doubleSecondEvo').append(`<p5>Low Key Form</p>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span>`)
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[1].type.name)}</span><br>`)
            pokeInfo[1][1] = await getPokemonData('toxtricity-amped');
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][1].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][1].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            $('.doubleSecondEvo').append(`<p5>Amped Form</p>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][1].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[0].type.name)}</span>`)
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][1].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[1].type.name)}</span>`)
        }else if (pokeArray[1].length == 1 && pokeArray[0][0] == "Kubfu") {//special case for kubfu
            $('.doubleSecondEvo').append(`<h4>Stage 2</h4>`);
            pokeInfo[1][0] = await getPokemonData('urshifu-rapid-strike');
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][0].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            $('.doubleSecondEvo').append(`<p5>Rapid Strike</p>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span>`)
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[1].type.name)}</span><br>`)
            pokeInfo[1][1] = await getPokemonData('urshifu-single-strike');
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][1].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][1].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            $('.doubleSecondEvo').append(`<p5>Single Strike</p>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][1].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[0].type.name)}</span>`)
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][1].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[1].type.name)}</span>`)
        }else if (pokeArray[1].length == 2 && pokeArray[0][0] != "Burmy") {
            $('.doubleSecondEvo').append(`<h4>Stage 2</h4>`);
            pokeInfo[1][0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][0].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            if (pokeInfo[1][0].types.length == 1) {
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span><br>`)
            } else {
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span>`)
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[1].type.name)}</span><br>`)
            }
            pokeInfo[1][1] = await getPokemonData(pokeArray[1][1].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][1].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][1].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][1]}</h5>`);
            if (pokeInfo[1][1].types.length == 1) {
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][1].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[0].type.name)}</span>`)
            } else {
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][1].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[0].type.name)}</span>`)
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][1].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[1].type.name)}</span>`)
            }
        } else if (pokeArray[1].length == 2 && pokeArray[0][0] == "Burmy") {//special case for burmy & forms
            $('.doubleSecondEvo').append(`<h4>Stage 2</h4>`);
            pokeInfo[1][0] = await getPokemonData('wormadam-plant');
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][0].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            $('.doubleSecondEvo').append(`<p>Plant Cloak</p>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span>`)
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[1].type.name)}</span><br>`)
            pokeInfo[1][1] = await getPokemonData('wormadam-sandy');
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][1].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][1].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            $('.doubleSecondEvo').append(`<p>Sandy Cloak</p>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][1].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[0].type.name)}</span>`)
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][1].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[1].type.name)}</span><br>`)
            pokeInfo[1][2] = await getPokemonData('wormadam-trash');
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][2].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][2].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            $('.doubleSecondEvo').append(`<p>Trash Cloak</p>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][2].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][2].types[0].type.name)}</span>`)
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][2].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][2].types[1].type.name)}</span><br>`)
            pokeInfo[1][3] = await getPokemonData(pokeArray[1][1].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][3].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][3].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][1]}</h5>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][3].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][3].types[0].type.name)}</span>`)
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][3].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][3].types[1].type.name)}</span>`)
        }else if (pokeArray[1].length == 3) {
            $('.doubleSecondEvo').append(`<h4>Stage 2</h4>`);
            pokeInfo[1][0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][0].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            if (pokeInfo[1][0].types.length == 1) {
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span><br>`)
            } else {
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span>`)
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[1].type.name)}</span><br>`)
            }
            pokeInfo[1][1] = await getPokemonData(pokeArray[1][1].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][1].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][1].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][1]}</h5>`);
            if (pokeInfo[1][1].types.length == 1) {
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][1].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[0].type.name)}</span><br>`)
            } else {
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][1].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[0].type.name)}</span>`)
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][1].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[1].type.name)}</span><br>`)
            }
            pokeInfo[1][2] = await getPokemonData(pokeArray[1][2].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][2].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][2].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][2]}</h5>`);
            if (pokeInfo[1][2].types.length == 1) {
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][2].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][2].types[0].type.name)}</span>`)
            } else {
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][2].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][2].types[0].type.name)}</span>`)
                $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][2].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][2].types[1].type.name)}</span>`)
            }
        } else if (pokeArray[1].length == 8) { //special case for Eevee
            $('.doubleSecondEvo').append(`<h4>Stage 2</h4>`);
            pokeInfo[1][0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][0].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span><br>`)
            pokeInfo[1][1] = await getPokemonData(pokeArray[1][1].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][1].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][1].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][1]}</h5>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][1].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[0].type.name)}</span><br>`)
            pokeInfo[1][2] = await getPokemonData(pokeArray[1][2].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][2].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][2].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][2]}</h5>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][2].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][2].types[0].type.name)}</span><br>`)
            pokeInfo[1][3] = await getPokemonData(pokeArray[1][3].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][3].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][3].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][3]}</h5>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][3].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][3].types[0].type.name)}</span><br>`)
            pokeInfo[1][4] = await getPokemonData(pokeArray[1][4].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][4].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][4].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][4]}</h5>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][4].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][4].types[0].type.name)}</span><br>`)
            pokeInfo[1][5] = await getPokemonData(pokeArray[1][5].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][5].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][5].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][5]}</h5>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][5].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][5].types[0].type.name)}</span><br>`)
            pokeInfo[1][6] = await getPokemonData(pokeArray[1][6].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][6].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][6].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][6]}</h5>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][6].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][6].types[0].type.name)}</span><br>`)
            pokeInfo[1][7] = await getPokemonData(pokeArray[1][7].toLowerCase());
            $('.doubleSecondEvo').append(`<img src="${pokeInfo[1][7].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][7].name)}" width="125px">`);
            $('.doubleSecondEvo').append(`<h5>${pokeArray[1][7]}</h5>`);
            $('.doubleSecondEvo').append(`<span class="${pokeInfo[1][7].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][7].types[0].type.name)}</span><br>`)
        }   
    } else if (pokeArray.length == 3) {
        $('.tripleFirstEvo').append(`<h4>Basic</h4>`);
        pokeInfo[0][0] = await getPokemonData(pokeArray[0][0].toLowerCase());
        console.log(pokeInfo);
        $('.tripleFirstEvo').append(`<img src="${pokeInfo[0][0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[0][0].name)}" width="125px">`);
        $('.tripleFirstEvo').append(`<h5>${pokeArray[0][0]}</h5>`);
        if (pokeInfo[0][0].types.length == 1) {
            $('.tripleFirstEvo').append(`<span class="${pokeInfo[0][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[0][0].types[0].type.name)}</span>`)
        } else {
            $('.tripleFirstEvo').append(`<span class="${pokeInfo[0][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[0][0].types[0].type.name)}</span>`)
            $('.tripleFirstEvo').append(`<span class="${pokeInfo[0][0].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[0][0].types[1].type.name)}</span>`)
        }
        if (pokeArray[1].length == 1) {
            $('.tripleSecondEvo').append(`<h4>Stage 2</h4>`);
            pokeInfo[1][0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            $('.tripleSecondEvo').append(`<img src="${pokeInfo[1][0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][0].name)}" width="125px">`);
            $('.tripleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            if (pokeInfo[1][0].types.length == 1) {
                $('.tripleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span>`)
            } else {
                $('.tripleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span>`)
                $('.tripleSecondEvo').append(`<span class="${pokeInfo[1][0].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[1].type.name)}</span>`)
            }
        } else if (pokeArray[1].length == 2) {
            $('.tripleSecondEvo').append(`<h4>Stage 2</h4>`);
            pokeInfo[1][0] = await getPokemonData(pokeArray[1][0].toLowerCase());
            $('.tripleSecondEvo').append(`<img src="${pokeInfo[1][0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][0].name)}" width="125px">`);
            $('.tripleSecondEvo').append(`<h5>${pokeArray[1][0]}</h5>`);
            if (pokeInfo[1][0].types.length == 1) {
                $('.tripleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span><br>`)
            } else {
                $('.tripleSecondEvo').append(`<span class="${pokeInfo[1][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[0].type.name)}</span>`)
                $('.tripleSecondEvo').append(`<span class="${pokeInfo[1][0].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][0].types[1].type.name)}</span><br>`)
            }
            pokeInfo[1][1] = await getPokemonData(pokeArray[1][1].toLowerCase());
            $('.tripleSecondEvo').append(`<img src="${pokeInfo[1][1].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[1][1].name)}" width="125px">`);
            $('.tripleSecondEvo').append(`<h5>${pokeArray[1][1]}</h5>`);
            if (pokeInfo[1][1].types.length == 1) {
                $('.tripleSecondEvo').append(`<span class="${pokeInfo[1][1].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[0].type.name)}</span><br>`)
            } else {
                $('.tripleSecondEvo').append(`<span class="${pokeInfo[1][1].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[0].type.name)}</span>`)
                $('.tripleSecondEvo').append(`<span class="${pokeInfo[1][1].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[1][1].types[1].type.name)}</span><br>`)
            }
        }
        if (pokeArray[2].length == 1) {
            $('.tripleThirdEvo').append(`<h4>Stage 3</h4>`);
            pokeInfo[2][0] = await getPokemonData(pokeArray[2][0].toLowerCase());
            $('.tripleThirdEvo').append(`<img src="${pokeInfo[2][0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[2][0].name)}" width="125px">`);
            $('.tripleThirdEvo').append(`<h5>${pokeArray[2][0]}</h5>`);
            if (pokeInfo[2][0].types.length == 1) {
                $('.tripleThirdEvo').append(`<span class="${pokeInfo[2][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[2][0].types[0].type.name)}</span>`)
            } else {
                $('.tripleThirdEvo').append(`<span class="${pokeInfo[2][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[2][0].types[0].type.name)}</span>`)
                $('.tripleThirdEvo').append(`<span class="${pokeInfo[2][0].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[2][0].types[1].type.name)}</span>`)
            }
        } else if (pokeArray[2].length == 2) {
            $('.tripleThirdEvo').append(`<h4>Stage 3</h4>`);
            pokeInfo[2][0] = await getPokemonData(pokeArray[2][0].toLowerCase());
            $('.tripleThirdEvo').append(`<img src="${pokeInfo[2][0].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[2][0].name)}" width="125px">`);
            $('.tripleThirdEvo').append(`<h5>${pokeArray[2][0]}</h5>`);
            if (pokeInfo[2][0].types.length == 1) {
                $('.tripleThirdEvo').append(`<span class="${pokeInfo[2][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[2][0].types[0].type.name)}</span><br>`)
            } else {
                $('.tripleThirdEvo').append(`<span class="${pokeInfo[2][0].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[2][0].types[0].type.name)}</span>`)
                $('.tripleThirdEvo').append(`<span class="${pokeInfo[2][0].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[2][0].types[1].type.name)}</span><br>`)
            }
            pokeInfo[2][1] = await getPokemonData(pokeArray[2][1].toLowerCase());
            $('.tripleThirdEvo').append(`<img src="${pokeInfo[2][1].sprites.front_default}" alt="${capitalizeFirstLetter(pokeInfo[2][1].name)}" width="125px">`);
            $('.tripleThirdEvo').append(`<h5>${pokeArray[2][1]}</h5>`);
            if (pokeInfo[2][1].types.length == 1) {
                $('.tripleThirdEvo').append(`<span class="${pokeInfo[2][1].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[2][1].types[0].type.name)}</span>`)
            } else {
                $('.tripleThirdEvo').append(`<span class="${pokeInfo[2][1].types[0].type.name}">${capitalizeFirstLetter(pokeInfo[2][1].types[0].type.name)}</span>`)
                $('.tripleThirdEvo').append(`<span class="${pokeInfo[2][1].types[1].type.name}">${capitalizeFirstLetter(pokeInfo[2][1].types[1].type.name)}</span>`)
            }
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

