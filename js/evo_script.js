var chain, pokeName1 = [], pokeName2 = [], pokeName3 = [];
var pokeArray = [], poke1 = [], poke2 = [], poke3 = [];
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
        getEvolutionChainData(data.evolution_chain.url);
    }).catch(() => {
        alert('Invalid name, try again');
    })  
}

/*
    This function takes in a string representing a specific url and sends a
    get request to the pokeapi for evolution chain date. If it passes it will
    then parse the data into several arrays and append the data to the page 
    for the user to view
*/
function getEvolutionChainData(speciesURL) {
    fetch(speciesURL, {
        method: 'GET'})
    .then(checkError)
    .then(data => {
        chain = data.chain;
        console.log('Chain:', chain);
        poke1.push(capitalizeFirstLetter(chain.species.name));
        pokeArray.push(poke1);

        if(chain.evolves_to.length != 0) {
            for (let i = 0; i < chain.evolves_to.length; i++) {
                poke2.push(capitalizeFirstLetter(chain.evolves_to[i].species.name));
            }
            pokeArray.push(poke2);
        }
        if(chain.evolves_to.length == 2 && chain.evolves_to[0].evolves_to.length == 1 && chain.evolves_to[1].evolves_to.length == 1) {
            poke3.push(capitalizeFirstLetter(chain.evolves_to[0].evolves_to[0].species.name));
            poke3.push(capitalizeFirstLetter(chain.evolves_to[1].evolves_to[0].species.name));
            pokeArray.push(poke3);
        }else if(chain.evolves_to.length != 0 && chain.evolves_to[0].evolves_to.length != 0) {
            for (let i = 0; i < chain.evolves_to[0].evolves_to.length; i++) {
                poke3.push(capitalizeFirstLetter(chain.evolves_to[0].evolves_to[i].species.name));
            }
            pokeArray.push(poke3);
        }
        console.log(pokeArray);
        if (pokeArray.length == 1) {
            $('.singleFirstEvo').append(`<p>${pokeArray[0][0]}</p>`);
        } else if (pokeArray.length == 2) {
            $('.doubleFirstEvo').append(`<p>${pokeArray[0][0]}</p>`);
            if (pokeArray[1].length == 1) {
                $('.doubleSecondEvo').append(`<p>${pokeArray[1][0]}</p>`);
            } else if (pokeArray[1].length == 2) {
                $('.doubleSecondEvo').append(`<p>${pokeArray[1][0]}</p>`);
                $('.doubleSecondEvo').append(`<p>${pokeArray[1][1]}</p>`);
            } else if (pokeArray[1].length == 3) {
                $('.doubleSecondEvo').append(`<p>${pokeArray[1][0]}</p>`);
                $('.doubleSecondEvo').append(`<p>${pokeArray[1][1]}</p>`);
                $('.doubleSecondEvo').append(`<p>${pokeArray[1][2]}</p>`);
            } else if (pokeArray[1].length == 8) { //special case for Eevee
                $('.doubleSecondEvo').append(`<p>${pokeArray[1][0]}</p>`);
                $('.doubleSecondEvo').append(`<p>${pokeArray[1][1]}</p>`);
                $('.doubleSecondEvo').append(`<p>${pokeArray[1][2]}</p>`);
                $('.doubleSecondEvo').append(`<p>${pokeArray[1][3]}</p>`);
                $('.doubleSecondEvo').append(`<p>${pokeArray[1][4]}</p>`);
                $('.doubleSecondEvo').append(`<p>${pokeArray[1][5]}</p>`);
                $('.doubleSecondEvo').append(`<p>${pokeArray[1][6]}</p>`);
                $('.doubleSecondEvo').append(`<p>${pokeArray[1][7]}</p>`);
            }   
        } else if (pokeArray.length == 3) {
            $('.tripleFirstEvo').append(`<p>${pokeArray[0][0]}</p>`);
            if (pokeArray[1].length == 1) {
                $('.tripleSecondEvo').append(`<p>${pokeArray[1][0]}</p>`);
            } else if (pokeArray[1].length == 2) {
                $('.tripleSecondEvo').append(`<p>${pokeArray[1][0]}</p>`);
                $('.tripleSecondEvo').append(`<p>${pokeArray[1][1]}</p>`);
            }
            if (pokeArray[2].length == 1) {
                $('.tripleThirdEvo').append(`<p>${pokeArray[2][0]}</p>`);
            } else if (pokeArray[2].length == 2) {
                $('.tripleThirdEvo').append(`<p>${pokeArray[2][0]}</p>`);
                $('.tripleThirdEvo').append(`<p>${pokeArray[2][1]}</p>`);
            }
        }

    })
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
    *Reset all global variables to empty
    *Remove any previously populated content from prior searches
    *Trigger the search by calling the get function with the user data
*/
$('#searchBtn').click(() => {
    let searchString = userInput.val().toLowerCase();
    pokeArray = [];
    poke1 = [];
    poke2 = [];
    poke3 = [];
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