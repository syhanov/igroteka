const catalog = document.querySelector('.games__grid')

// Ответственность вызывающего кода: в try написано какого формата строку ожидает функция.
function formatYear(released) {
    if(!released){
        return '';
    }
    else {
        const pieces = released.split('-');
        return pieces[0];
    }
}

function formatRating(rating) {
    if(rating === undefined || rating === null){
        return '';
    }
    else {
        const number = rating.toFixed(1);
        return number;
    }
}

function escapeHTML(text) {
    if(text === undefined || text === null){
        return '';
    }
    else {
        let result = text
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;');

        return result;
    }
}

function getGenres(genre) {
    if(genre === undefined || genre === null) {
        return '';
    }
    else{
        let genres = genre.join(' • ');
        return genres;
    }
}
function getPlatforms(platform) {
    if(platform === undefined || platform === null) {
        return '';
    }
    else{
        let platforms = platform.join(' • ');
        return platforms;
    }
}

function renderCard(game) {

    return `
                <article class="game-card game-card--catalog" data-id="${game.id}">
                    <div class="game-card__cover">
                        <img 
                            src="${escapeHTML(game.background_image)}"
                            alt="Обложка игры ${escapeHTML(game.name)}" class="game-card__image">
                        <span class="game-card__rating-badge">${escapeHTML(formatRating(game.rating))}</span>
                    </div>
                    <div class="game-card__content">
                        <h3 class="game-card__title">${escapeHTML(game.name)}</h3>
                        <div class="game-card__meta">
                            <span class="game-card__released">${escapeHTML(formatYear(game.released))}</span>
                            <span class="game-card__genre">${escapeHTML(getGenres(game.genres))}</span>
                            <span class="game-card__platform">${escapeHTML(getPlatforms(game.platforms))}</span>
                        </div>
                    </div>
                </article>
            `;
};



function renderCatalog(games) {
    if (games.length === 0) {
        return `
           <p class="games__grid__empty">По запросу ${escapeHTML(input.value)} ничего не найдено</p>
        `;
    }

    let html = '';

    for (let i = 0; i < games.length; i++) {
        html += renderCard(games[i]);
    }

    return html;
}

catalog.innerHTML = (renderCatalog(GAMES));

const modal = document.querySelector('.modal__content')
const overlay = document.querySelector('.modal-overlay')
const overlayCloseButton = document.querySelector('.modal__close')

catalog.addEventListener('click', function(event){

    const card = event.target.closest('.game-card')
    if(!card){
        return
    }
    const id = card.dataset.id
    const game = GAMES.find(function(curentgame){
        return curentgame.id === Number(id)
    })
    console.log(game)

    const modalgame =  `
                <article class="game-card game-card--featured game-card--modal" data-id="${game.id}">
                    <div class="game-card__cover">
                        <img 
                            src="${escapeHTML(game.background_image)}"
                            alt="Обложка игры ${escapeHTML(game.name)}" class="game-card__image">
                        <span class="game-card__rating-badge">${escapeHTML(formatRating(game.rating))}</span>
                    </div>
                    <div class="game-card__content">
                        <h3 class="game-card__title">${escapeHTML(game.name)}</h3>
                        <div class="game-card__meta">
                            <span class="game-card__released">${escapeHTML(game.released)}</span>
                            <span class="game-card__genre">${escapeHTML(getGenres(game.genres))}</span>
                            <span class="game-card__platform">${escapeHTML(getPlatforms(game.platforms))}</span>
                        </div>
                    </div>
                </article>
            `;
    modal.innerHTML = modalgame;
    overlay.classList.add('is-open')   
});

overlayCloseButton.addEventListener('click', function(){
    overlay.classList.remove('is-open')
})
overlay.addEventListener('click', function(event){
    if(event.target === overlay){
        overlay.classList.remove('is-open')
    }
})

document.addEventListener('keydown', function(event){
    if(event.key === 'Escape' && overlay.classList.contains('is-open')){
        overlay.classList.remove('is-open')
        return
    }
})


const input = document.querySelector('.filter-form__search');
const form = document.querySelector('.filter-form')
const cards = document.querySelectorAll('.game-card')
const debouncedSearch = debounce(debounceQueryChange , 300)
const gamesCount = document.querySelector('.games__count')
const platformsSelect = document.getElementById('platforma')
const genresSelect = document.getElementById('zhanr')
const sortFilteredGames = document.getElementById('sort')
const resetButton = document.getElementById('catalog-reset-button')


input.addEventListener('input', function(event){
        if(event.key === 'Escape'){
        input.value = ''
        return
}
})

function debounceQueryChange() {
    state.query = input.value
    stateApply()
}

input.addEventListener('input', function(){
    debouncedSearch()
})
form.addEventListener('submit', function(event){
    event.preventDefault()
})

genresSelect.addEventListener('change', function() {
    state.genre = genresSelect.value
    stateApply()
})
platformsSelect.addEventListener('change', function() {
    state.platform = platformsSelect.value
    stateApply()
})
sortFilteredGames.addEventListener('change', function() {
    state.sort = sortFilteredGames.value
    stateApply()
})
resetButton.addEventListener('click', function(event) {
    state.query = '',
    state.genre = '',
    state.platform = '',
    state.sort = 'default',
    stateApply()
})

function debounce(fn, ms) {
    let timer
    return function(){
        clearTimeout(timer);
        timer = setTimeout(function (){
            fn()
        }, ms)
    }
}

const state = {
    query: '',
    genre: '',
    platform: '',
    sort: 'default'
};



function stateApply() {
    const selectedGames = selectGames(GAMES, state);
    catalog.innerHTML = renderCatalog(selectedGames);
    gamesCount.textContent = `показанно ${selectedGames.length} из ${GAMES.length}`
}

function selectGames(games, state) {
    let selectedGames = games.filter(function(game) {
        return (
            game.name.toLowerCase().includes(state.query.trim().toLowerCase()) &&
            (state.genre === '' || game.genres.includes(state.genre)) &&
            (state.platform === '' || game.platforms.includes(state.platform))
        );
    })
    return sortNewGamesArray(selectedGames, state)
} 


function sortNewGamesArray(massive, state) {
    if(state.sort === "rating-desc"){
        massive.sort(function(a, b) {
            return b.rating - a.rating || a.id - b.id
        })
    }
    else if(state.sort === "released-desc"){
        massive.sort(function(a, b) {
            return b.released.localeCompare(a.released) || a.id - b.id
        })    
    }
    else if(state.sort === "name-asc"){
        massive.sort(function(a, b) {
            return a.name.localeCompare(b.name) || a.id - b.id
        })    
    }
    else if(state.sort === "default") {
        return massive 
    }
        return massive
}


function updateGamesCount(games) {
    gamesCount.textContent = games.length;
}
updateGamesCount(GAMES);

const GamesGenres = GAMES.flatMap(function(game) {
    return game.genres;
}).filter(function(genre) {
    return genre !== null;
});
const UneqieGamesGenres = new Set(GamesGenres)
const GenresArray = [...UneqieGamesGenres]
const SortedGenresArray = GenresArray.sort(function(a,b) {
    return a.localeCompare(b);
})

let AllPlatformsArray = GAMES.flatMap(function(game) {
    return game.platforms
}).filter(function(platform) {
    return platform !== null;
});
let SortedPlatformsArray = new Set(AllPlatformsArray)
SortedPlatformsArray = [...SortedPlatformsArray]
SortedPlatformsArray = SortedPlatformsArray.sort(function(a,b) {
    return a.localeCompare(b);
})

for(let i = 0; i<SortedPlatformsArray.length; i++){
    const platformName = document.createElement('option')
    platformName.value = SortedPlatformsArray[i]
    platformName.classList.add('filter-form__option')
    platformName.textContent = SortedPlatformsArray[i]
    platformsSelect.append(platformName)
}
for(let i = 0; i<SortedGenresArray.length; i++){
    const Genres = document.createElement('option')
    Genres.value = SortedGenresArray[i]
    Genres.classList.add('filter-form__option')
    Genres.textContent = SortedGenresArray[i]
    genresSelect.append(Genres)
}