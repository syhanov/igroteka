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

let state = {
    query: '',
    genre: '',
    platform: '',
    sort: 'default'
};

//Блок 2. Запуск
function init() {
    const sortedGenres = getSortedGamesGenresOrPlatforms(GAMES, 'genres')
    const sortedPlatforms = getSortedGamesGenresOrPlatforms(GAMES, 'platforms')
    const urlParams = getUrlParams()

    renderPlatformsOrGenresOptions(sortedGenres, genresSelect)
    renderPlatformsOrGenresOptions(sortedPlatforms, platformsSelect)

    state = paramsToState(sortedGenres, sortedPlatforms, urlParams) // Восстанавливаем состояние из URL
    syncFormWithState(state) // Синхронизирует поля формы с состоянием приложения
    applyState() // Обновляем каталог, счётчик и URL
}

init()


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
                            <span class="game-card__genre">${escapeHTML(getGenresOrPlatforms(game.genres))}</span>
                            <span class="game-card__platform">${escapeHTML(getGenresOrPlatforms(game.platforms))}</span>
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
        applyState()
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
    applyState()
})

platformsSelect.addEventListener('change', function() {
    state.platform = platformsSelect.value
    applyState()
})

sortFilteredGames.addEventListener('change', function() {
    state.sort = sortFilteredGames.value
    applyState()
})

resetButton.addEventListener('click', function(event) {
    state.query = '';
    state.genre = '';
    state.platform = '';
    state.sort = 'default';
    applyState()
})

function debounceQueryChange() {
    state.query = input.value
    applyState()
}

function applyState() {
    const selectedGames = selectGames(GAMES, state);
    catalog.innerHTML = renderCatalog(selectedGames);
    gamesCount.textContent = `показанно ${selectedGames.length} из ${GAMES.length}`
    updateUrl(state);
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
                            <span class="game-card__genre">${escapeHTML(getGenresOrPlatforms(game.genres))}</span>
                            <span class="game-card__platform">${escapeHTML(getGenresOrPlatforms(game.platforms))}</span>
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

function renderPlatformsOrGenresOptions(property, select) {
    for(let i = 0; i<property.length; i++){
        const platformName = document.createElement('option')
        platformName.value = property[i]
        platformName.classList.add('filter-form__option')
        platformName.textContent = property[i]
        select.append(platformName)
    }
}

function getUrlParams() {
    const currentUrl = new URL(location.href);
    const params = currentUrl.searchParams;

    return params
}

function syncFormWithState(state) {
    platformsSelect.value = state.platform 
    genresSelect.value = state.genre 
    input.value = state.query
    sortFilteredGames.value = state.sort
}

function paramsToState(genres, platforms, urlParams) {
    let paramsGenre = urlParams.get('genre')
    let paramsQuery = urlParams.get('q')
    let paramsPlatform = urlParams.get('platform')
    let paramsSort = urlParams.get('sort')
    let newState = {
        query: '',
        genre: '',
        platform: '',
        sort: 'default'
    }
    for(let i = 0; i<genres.length; i++){
        if(paramsGenre === genres[i]) {
            newState.genre = genres[i]
        }
    }
    for(let i = 0; i<platforms.length; i++){
        if(paramsPlatform === platforms[i]) {
            newState.platform = platforms[i]
        }
    }
    if(paramsQuery === '' || !paramsQuery){
        newState.query = ''
    }
    else{
        newState.query = paramsQuery 
    }
    if(paramsSort !== 'rating-desc' && paramsSort !== 'released-desc' && paramsSort !== 'name-asc') {
        newState.sort = 'default'
    }
    else {
        newState.sort = paramsSort
    }
    return newState
}

function stateToParams(state) {
    let newUrl = {}
        if(state.query !== '') {
            newUrl.q = state.query
        }
        if(state.genre !== '') {
            newUrl.genre = state.genre
        }
        if(state.platform !== '') {
            newUrl.platform = state.platform
        }
        if(state.sort !== 'default') {
            newUrl.sort = state.sort
        }
    return newUrl
}

function updateUrl(state) {
    const currentUrl = new URL(location.href);
    const params = currentUrl.searchParams;
    const paramsObject = stateToParams(state);
    const keys = Object.keys(paramsObject);

    const catalogParams = ['q', 'genre', 'platform', 'sort'];

    for (let i = 0; i < catalogParams.length; i++) {
        params.delete(catalogParams[i]);
    }

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = paramsObject[key];

        params.set(key, value);
    }

    history.replaceState(null, '', currentUrl);
}


//Блок 5. Чистая прикладная логика
function selectGames(games, state) {
    let selectedGames = games.filter(function(game) {
    let isNameMatch = game.name.toLowerCase().includes(state.query.trim().toLowerCase())
    let isGenreMatch = state.genre === '' || game.genres.includes(state.genre)
    let isPlatformMatch = state.platform === '' || game.platforms.includes(state.platform)
        return (
            isNameMatch &&
            isGenreMatch &&
            isPlatformMatch
        );
    })
    return sortNewGamesArray(selectedGames, state)
} 

function sortNewGamesArray(array, state) {
    let newMassive = [...array]
    if(state.sort === "rating-desc"){
        newMassive.sort(function(a, b) {
            return b.rating - a.rating || a.id - b.id
        })
    }
    else if(state.sort === "released-desc"){
        newMassive.sort(function(a, b) {
            return b.released.localeCompare(a.released) || a.id - b.id
        })    
    }
    else if(state.sort === "name-asc"){
        newMassive.sort(function(a, b) {
            return a.name.localeCompare(b.name) || a.id - b.id
        })    
    }
    else if(state.sort === "default") {
        return newMassive 
    }
        return newMassive
}

function getSortedGamesGenresOrPlatforms(games, property) {
    let GamesOptionArray = games.flatMap(function(game) {
        return game[property];
    }).filter(function(option) {
        return option !== null;
    });
    let uniqueOptions  = new Set(GamesOptionArray)
    let SortedOptionArray = [...uniqueOptions ]
    SortedOptionArray.sort(function(a,b) {
        return a.localeCompare(b);
    })
    return SortedOptionArray
}

//Блок 6. Общие вспомогательные функции
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

function getGenresOrPlatforms(array) {
    if(array === undefined || array === null) {
        return '';
    }
    else{
        return array.join(' • ');
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