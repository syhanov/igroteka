//Блок 1. Селекторы и исходные значения
const catalog = document.querySelector('.games__grid')

const modal = document.querySelector('.modal__content')
const overlay = document.querySelector('.modal-overlay')
const overlayCloseButton = document.querySelector('.modal__close')

const input = document.querySelector('.filter-form__search');
const form = document.querySelector('.filter-form')

const cards = document.querySelectorAll('.game-card')
const debouncedSearch = debounce(debounceQueryChange , 300)
const gamesCount = document.querySelector('.games__count')
const platformsSelect = document.getElementById('platforma')
const genresSelect = document.getElementById('zhanr')
const sortFilteredGames = document.getElementById('sort')
const resetButton = document.getElementById('catalog-reset-button')

const state = {
    query: '',
    genre: '',
    platform: '',
    sort: 'default'
};

//Блок 2. Запуск
init()

function init() {
    const appState = stateToParams(location.href);
    const filteredGames = 
}

//Блок 3. Управление приложением
catalog.addEventListener('click', function(event){

    const card = event.target.closest('.game-card')
    if(!card){
        return
    }
    const id = card.dataset.id
    const game = GAMES.find(function(currentGame){
        return currentGame.id === Number(id)
    })
    console.log(game)

    const modalGame =  `
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
    modal.innerHTML = modalGame;
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

input.addEventListener('keydown', function(event){
        if(event.key === 'Escape'){
        input.value = '';
        state.query = '';
        stateApply()
        stateToParams()
        return
}
})

input.addEventListener('input', function(){
    debouncedSearch()
})

form.addEventListener('submit', function(event){
    event.preventDefault()
})

genresSelect.addEventListener('change', function() {
    state.genre = genresSelect.value
    stateApply()
    stateToParams()
})

platformsSelect.addEventListener('change', function() {
    state.platform = platformsSelect.value
    stateApply()
    stateToParams()
})

sortFilteredGames.addEventListener('change', function() {
    state.sort = sortFilteredGames.value
    stateApply()
    stateToParams()
})

resetButton.addEventListener('click', function(event) {
    state.query = '',
    state.genre = '',
    state.platform = '',
    state.sort = 'default',
    stateApply()
    stateToParams()
})

function debounceQueryChange() {
    state.query = input.value
    stateApply()
    stateToParams()
}

function stateApply() {
    const selectedGames = selectGames(GAMES, state);
    catalog.innerHTML = renderCatalog(selectedGames);
    gamesCount.textContent = `показанно ${selectedGames.length} из ${GAMES.length}`
}

//Блок 4. Операции с интерфейсом и браузером
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

function paramsToState() {
    const currentUrl = new URL(location.href);
    const params = currentUrl.searchParams
    let paramsGenre = params.get('genre')
    let paramsQuery = params.get('q')
    let paramsPlatform = params.get('platform')
    let paramsSort = params.get('sort')
    state.genre = ''
    for(let i = 0; i<SortedGenresArray.length; i++){
        if(paramsGenre === SortedGenresArray[i]) {
            state.genre = SortedGenresArray[i]
            genresSelect.value = state.genre 
        }
    }
    state.platform = ''
    for(let i = 0; i<SortedPlatformsArray.length; i++){
        if(paramsPlatform === SortedPlatformsArray[i]) {
            state.platform = SortedPlatformsArray[i]
            platformsSelect.value = state.platform 
        }
    }
    if(paramsQuery === '' || !paramsQuery){
        state.query = ''
        input.value = state.query
    }
    else{
        state.query = paramsQuery 
        input.value = state.query
    }
    if(paramsSort !== 'rating-desc' && paramsSort !== 'released-desc' && paramsSort !== 'name-asc') {
        state.sort = 'default'
        sortFilteredGames.value = state.sort
    }
    else {
        state.sort = paramsSort
        sortFilteredGames.value = state.sort
    }
    stateApply()
}

function stateToParams() {
    const currentUrl = new URL(location.href);
    const params = currentUrl.searchParams
    if(state.query !== '') {
        params.set('q', state.query)
    }
    else {
        params.delete('q')
    }
    if(state.genre !== '') {
        params.set('genre', state.genre)
    }
    else {
        params.delete('genre')
    }
    if(state.platform !== '') {
        params.set('platform', state.platform)
    }
    else {
        params.delete('platform')
    }
    if(state.sort !== 'default') {
        params.set('sort', state.sort)
    }
    else {
        params.delete('sort')
    }
    history.replaceState(null, '', currentUrl);
}

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
//Блок 5. Чистая прикладная логика

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

function debounce(fn, ms) {
    let timer
    return function(){
        clearTimeout(timer);
        timer = setTimeout(function (){
            fn()
        }, ms)
    }
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

let GamesGenres = GAMES.flatMap(function(game) {
    return game.genres;
}).filter(function(genre) {
    return genre !== null;
});
let SortedGenresArray = new Set(GamesGenres)
SortedGenresArray = [...UneqieGamesGenres]
SortedGenresArray = SortedGenresArray.sort(function(a,b) {
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

paramsToState() // Отрисовывает каталог. Если ссылка открыта с фильтрами, то выдаёт нужные карточки, если нет — то все.
stateToParams()
