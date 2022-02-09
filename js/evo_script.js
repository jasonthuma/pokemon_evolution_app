var chain, pokeName1 = [], pokeName2 = [], pokeName3 = [];
//plan is pokeArray = [name, type1, type2, trigger, lvl/item/time, extraTrigger]
var pokeArray = [], poke1 = [], poke2 = [], poke3 = [];
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
function getEvolutionChainData(speciesURL) {
    fetch(speciesURL, {
        method: 'GET'})
    .then(checkError)
    .then(data => {
        //console.log(data);
        chain = data.chain;
        console.log('Chain:', chain);
        poke1.push(capitalizeFirstLetter(chain.species.name));
        //console.log('poke1:' , poke1);
        pokeArray.push(poke1);

        if(chain.evolves_to.length != 0) {
            for (let i = 0; i < chain.evolves_to.length; i++) {
                poke2.push(capitalizeFirstLetter(chain.evolves_to[i].species.name));
            }
            //console.log('poke2:',poke2);
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
            
            //console.log('poke3:', poke3);
            pokeArray.push(poke3);
        }
        console.log(pokeArray);
        if (pokeArray.length == 1) {
            $('.singleFirstEvo').append(`<p>${pokeArray[0][0]}</p>`);
        } else if (pokeArray.length == 2) {
            $('.doubleFirstEvo').append(`<p>${pokeArray[0][0]}</p>`);
            switch(pokeArray[1].length) {
                case 1:
                    $('.doubleSecondEvo').append(`<p>${pokeArray[1][0]}</p>`);
                case 2:
                    $('.doubleSecondEvo').append(`<p>${pokeArray[1][0]}</p>`);
                    $('.doubleSecondEvo').append(`<p>${pokeArray[1][1]}</p>`);
                case 3:
                    $('.doubleSecondEvo').append(`<p>${pokeArray[1][0]}</p>`);
                    $('.doubleSecondEvo').append(`<p>${pokeArray[1][1]}</p>`);
                    $('.doubleSecondEvo').append(`<p>${pokeArray[1][2]}</p>`);
                case 8:
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
// function getPokemonInfo(pokemon) {
//     fetch(pokemon.url, {
//         method: 'GET'})
//     .then(checkError)
//     .then(data => {
//         console.log(data);
//     })
// }
function getPokemonSprites() {

}

function checkError(response) {
    if (response.status >= 200 && response.status <= 299) {
        return response.json();
    } else {
        throw Error(response.statusText);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

$('#searchBtn').click(() => {
    let userInput = $('#searchName');
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