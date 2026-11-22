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

const slider = document.querySelector('.catalog__slider');
const track = document.querySelector('.catalog__featured-games');
const next = document.querySelector('.slider__btn--next');
const prev = document.querySelector('.slider__btn--prev');
const trackCards = track.querySelectorAll('.game-card');

let allCards;
let index = 2;
let isAnimating = false;
let isSliderInitialized = false;

const sliderMedia = window.matchMedia('(min-width: 1920px)');

const apiForm = document.getElementById('api__form');
const apiPassword = document.getElementById('password');
const apiConnectButton = document.querySelector('.login__button--connect')
const apiDeteleButton = document.querySelector('.login__button--delete')
const apiApprowMessage = document.querySelector('.api__approw')
const apiDeclineMessage = document.querySelector('.api__decline')
let currentApiKey = ''

let apiController = null;
let searchController = null;

let state = {
    query: '',
    genre: '',
    platform: '',
    sort: 'default',
    page: 1
};
let currentGames = [];
let rawgGenres = []
let rawgPlatforms = []

let totalGames = 0
//Блок 2. Запуск
async function init() {
    await apiAutoConnect()
}

function sliderInit() {
    if (isSliderInitialized) {
        return;
    }

    createSliderClones();

    allCards = track.querySelectorAll('.game-card');

    index = 2;
    isAnimating = false;

    updateSlider(false);

    track.addEventListener('transitionend', handleSliderTransitionEnd);
    next.addEventListener('click', handleNextClick);
    prev.addEventListener('click', handlePrevClick);

    isSliderInitialized = true;
}

init()


//Блок 3. Управление приложением

function handleSliderMediaChange() {
    updateSliderCardClasses();

    if (sliderMedia.matches) {
        sliderInit();
    } else {
        sliderDestroy();
    }
}

handleSliderMediaChange();

sliderMedia.addEventListener('change', handleSliderMediaChange);

function sliderDestroy() {
    if (!isSliderInitialized) {
        return;
    }

    track.removeEventListener('transitionend', handleSliderTransitionEnd);
    next.removeEventListener('click', handleNextClick);
    prev.removeEventListener('click', handlePrevClick);

    const clones = track.querySelectorAll('.game-card--clone');

    for (let i = 0; i < clones.length; i++) {
        clones[i].remove();
    }

    for (let i = 0; i < trackCards.length; i++) {
        trackCards[i].classList.remove('is-active');
    }

    track.style.removeProperty('transform');
    track.classList.remove('is-jumping');

    allCards = null;
    index = 2;
    isAnimating = false;
    isSliderInitialized = false;
}

function handleSliderTransitionEnd(event) {
    if (event.target !== track || event.propertyName !== 'transform') {
        return;
    }

    if (index === 6) {
        index = 2;
        updateSlider(false);
    }

    if (index === 1) {
        index = 5;
        updateSlider(false);
    }

    isAnimating = false;
}

function handleNextClick() {
    if (isAnimating) {
        return;
    }

    isAnimating = true;
    index++;
    updateSlider();
}

function handlePrevClick() {
    if (isAnimating) {
        return;
    }

    isAnimating = true;
    index--;
    updateSlider();
}

apiForm.addEventListener("submit", function(event) {
    event.preventDefault();

    currentApiKey = getAndSaveApiKey()

    if(!currentApiKey) {
        return
    }
    
    connectToApi(currentApiKey);
})

apiDeteleButton.addEventListener('click', function() {
    deleteApiKey()
})

catalog.addEventListener('click', function(event){

    const card = event.target.closest('.game-card')
    if(!card){
        return
    }
    const id = card.dataset.id
    const game = currentGames.find(function(currentGame){
        return currentGame.id === Number(id)
    })
    console.log(game)
    let modalGame = renderModalCard(game)
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
        searchGames();
        return
}
})

input.addEventListener('input', function(){
    state.query = input.value
    debouncedSearch()
})

form.addEventListener('submit', function(event){
    event.preventDefault()
})

genresSelect.addEventListener('change', function() {
    state.genre = genresSelect.value
    searchGames();
})

platformsSelect.addEventListener('change', function() {
    state.platform = platformsSelect.value
    searchGames();
})

sortFilteredGames.addEventListener('change', function() {
    state.sort = sortFilteredGames.value
    searchGames();
})

resetButton.addEventListener('click', function(event) {
    state.query = '';
    state.genre = '';
    state.platform = '';
    state.sort = 'default';
    searchGames();
})

function debounceQueryChange() {
    searchGames()
}

function applyState() {
    const selectedGames = selectGames(currentGames, state);

    updateUrl(state);
}
function renderGames() {
    catalog.innerHTML = renderCatalog(currentGames);
    gamesCount.textContent = `показанно ${currentGames.length} из ${totalGames}`
}

//Блок 4. Операции с интерфейсом и браузером

function updateSlider(animate) {
    const cardWidth = trackCards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(track).gap)
    let offset = index * (cardWidth + gap)
    const sliderCenter = slider.clientWidth / 2;
    const cardCenter = offset + cardWidth / 2;
    let position = sliderCenter - cardCenter

    if(animate === false) {
        track.classList.add('is-jumping')
    }

    for (let i = 0; i < allCards.length; i++) {
        allCards[i].classList.remove('is-active');
    }
    
    allCards[index].classList.add('is-active')

    track.style.transform = `translateX(${position}px)`;

    if (animate === false) {
        track.offsetWidth;
        track.classList.remove('is-jumping');
    }  
}

function createSliderClones() {
    const cloneMiami = trackCards[trackCards.length - 1].cloneNode(true);
    const cloneRing = trackCards[0].cloneNode(true);
    const cloneWitcher = trackCards[2].cloneNode(true);
    const cloneCyberPunk = trackCards[1].cloneNode(true);

    cloneMiami.classList.add('game-card--clone');
    cloneRing.classList.add('game-card--clone');
    cloneWitcher.classList.add('game-card--clone');
    cloneCyberPunk.classList.add('game-card--clone');

    track.prepend(cloneMiami)
    track.appendChild(cloneRing)
    track.prepend(cloneWitcher)
    track.appendChild(cloneCyberPunk)
    
    cloneMiami.setAttribute('aria-hidden', 'true')
    cloneRing.setAttribute('aria-hidden', 'true')
    cloneWitcher.setAttribute('aria-hidden', 'true')
    cloneCyberPunk.setAttribute('aria-hidden', 'true')
}

function updateSliderCardClasses() {
    for (let i = 0; i < trackCards.length; i++) {
        const card = trackCards[i];

        if (sliderMedia.matches) {
            card.classList.add('game-card--featured');
            card.classList.add('game-card--slider');
        } else {
            card.classList.remove('game-card--featured');
            card.classList.remove('game-card--slider');

            if (i === 0) {
                card.classList.add('game-card--featured');
            } else {
                card.classList.add('game-card--slider');
            }
        }
    }
}

function getAndSaveApiKey() {
    currentApiKey = apiPassword.value.trim()
    if(!currentApiKey){
        return
    }
    localStorage.setItem('igroteka:rawg-key', currentApiKey)
    return currentApiKey
}

function initializeCatalog(genres, platforms) {
    let sortedGenres = getSortedGenresOrPlatforms(genres)
    let sortedPlatforms = getSortedGenresOrPlatforms(platforms)

    renderPlatformsOrGenresOptions(sortedGenres, genresSelect);
    renderPlatformsOrGenresOptions(sortedPlatforms, platformsSelect);

    saveDictionaries()

    renderGames()
}

async function connectToApi(apiKey) {
    showApiMessage('hide');
    apiPassword.classList.remove('wrong__password');

    if(apiController) {
        apiController.abort()
    }
    apiController = new AbortController();
    
    try {
        let results = await loadDictionaries()
        let dictionaries = results
        rawgGenres = dictionaries.genres
        rawgPlatforms = dictionaries.platforms


        let sortedGenres = getSortedGenresOrPlatforms(rawgGenres)
        let sortedPlatforms = getSortedGenresOrPlatforms(rawgPlatforms)

        let genreNames = sortedGenres.map(function(genre) {
            return genre.name
        });
        
        let platformNames = sortedPlatforms.map(function(platform) {
            return platform.name
        });

        const urlParams = getUrlParams()
        state = paramsToState(genreNames, platformNames, urlParams) // Восстанавливаем состояние из URL
        syncFormWithState(state) // Синхронизирует поля формы с состоянием приложения


        let url = createGameUrl(state, apiKey, rawgGenres, rawgPlatforms)
      
        let data = await fetchData(url, apiController.signal)

        totalGames = data.count

        currentGames = data.results.map(function(rawGame) {
            return normalizeGame(rawGame);
        });

        initializeCatalog(rawgGenres, rawgPlatforms)

        showApiMessage('approw')
        apiPassword.value = ''
    }
    catch(error) {
        if(error.name === 'AbortError') {
            return
        }
        console.error(error);
        apiPassword.classList.add('wrong__password');
        showApiMessage('decline');
    }
    finally {
    }
}

async function searchGames() {
    state.page = 1;
    updateUrl(state);

    if(searchController) {
        searchController.abort()
    }
    searchController = new AbortController();
    try {
        let url = createGameUrl(state, currentApiKey, rawgGenres, rawgPlatforms)
        let data = await fetchData(url, searchController.signal)
            currentGames = data.results.map(function(rawGame) {
                return normalizeGame(rawGame);
            });
        totalGames = data.count
        renderGames()
        }
    catch(error) {
        if(error.name === 'AbortError') {
            return
        }
        console.error(error);
        apiPassword.classList.add('wrong__password');
        showApiMessage('decline');
        }
    }

function saveDictionaries() {
    let platforms = rawgPlatforms.map(function(platform) {
        return {
            id: platform.id,
            name: platform.name
        }
    })

    let genres = rawgGenres.map(function(genre) {
        return {
            id: genre.id,
            name: genre.name
        }
    })

    let dictionaries = {
        platforms,
        genres,
        savedAt: Date.now()
    }
    try {
        localStorage.setItem('igroteka:rawg-dictionaries' ,JSON.stringify(dictionaries))
    }
    catch {
        console.warn('Ошибка сохранения справочников')
        showApiMessage('decline')
    }
}

function getLocalDictionaries() {
    let dictionaries = localStorage.getItem('igroteka:rawg-dictionaries')

    if(!dictionaries) {
        return null
    }

    try {
        dictionaries = JSON.parse(dictionaries)
    }
    catch {
        return null
    }

    if(isValidateDictionaries(dictionaries)) {
        return dictionaries
    }
    else {
        return null
    }
}

function isValidateDictionaries(dictionaries) {
    if(!dictionaries || typeof dictionaries !== 'object') {
        return null
    }
        let genresValidate = Array.isArray(dictionaries.genres) && dictionaries.genres.every(function(genre) {
            return typeof genre.name === 'string' && genre.name.trim() !== '' && Number.isFinite(genre.id)
        })
        let platformsValidate = Array.isArray(dictionaries.platforms) && dictionaries.platforms.every(function(platform) {
            return typeof platform.name === 'string' && platform.name.trim() !== '' && Number.isFinite(platform.id)
        })
        let savedAt = dictionaries.savedAt
        let cacheAge = Date.now() - savedAt
        let timeValidate = Number.isFinite(savedAt) && Number.isFinite(cacheAge) && cacheAge >= 0 && cacheAge <= 24*60*60*1000

        if(!genresValidate || !platformsValidate || !timeValidate) {
            return null 
        }
        else {
            return true
        }
}

async function loadDictionaries() {
    let dictionaries = getLocalDictionaries();
    if(dictionaries) {
        let rawgGenres = dictionaries.genres
        let rawgPlatforms = dictionaries.platforms

        return {
            genres: rawgGenres,
            platforms: rawgPlatforms
        }
    }

    let results = await Promise.all([
        fetchGenres(),
        fetchPlatforms(),
    ])
    rawgGenres = results[0]
    rawgPlatforms = results[1]
    saveDictionaries()

    return {
        genres: rawgGenres,
        platforms: rawgPlatforms
    }
}

async function fetchData(url, signal) {
    let response = await fetch(url, { signal: signal });

    if(!response.ok) {
        throw new Error('HTTP error: ' + response.status)
    }
    
    let data = await response.json()
    return data
}

async function fetchGenres() {
    let url = new URL('http://127.0.0.1:3000/api/genres');
    url.searchParams.set('key', currentApiKey)

    let rawgGenres = [];
    let page = 1
    let next = true 

    while(next) {
        url.searchParams.set('page', page)
        let data = await fetchData(url, apiController.signal)
        data = validatePaginatedResponse(data)
        page++

        rawgGenres.push(...data.results)

        if(data.next === null) {
            next = false
        }
    }

    return rawgGenres 
}

async function fetchPlatforms() {
    let url = new URL('http://127.0.0.1:3000/api/platforms');
    url.searchParams.set('key', currentApiKey)

    let rawgPlatforms = [];
    let page = 1
    let next = true 

    while(next) {
        url.searchParams.set('page', page)
        let data = await fetchData(url, apiController.signal)
        data = validatePaginatedResponse(data)
        page++

        rawgPlatforms.push(...data.results)

        if(data.next === null) {
            next = false
        }
    }

    console.log(rawgPlatforms)
    return rawgPlatforms
}

function validatePaginatedResponse(data) {
    if(!data || typeof data !== 'object') {
        throw new Error('Некорректный формат данных')
    }
    
    let validDataResult = Array.isArray(data.results)
    let validDataCount = Number.isInteger(data.count) && data.count >= 0
    let validDataNext = typeof data.next === 'string' || data.next === null
    let validDataPrevious = typeof data.previous === 'string' || data.previous === null
    
    if(validDataResult && validDataCount && validDataNext && validDataPrevious) {
        return data
    }
    else {
        throw new Error('Структура полученных данных поврежденна')
    }
}

function normalizeGame(rawGame) {
    let normalizedGame = {

    }
    normalizedGame.id = rawGame.id
    normalizedGame.name = rawGame.name
    normalizedGame.released = rawGame.released
    normalizedGame.background_image = rawGame.background_image
    normalizedGame.rating = rawGame.rating

    let rawGameGenres = rawGame.genres ?? []
        normalizedGame.genres = rawGameGenres.map(function(genre) {
            return genre.name
        })
    
    let rawGamePlatforms = rawGame.platforms ?? []
        normalizedGame.platforms = rawGamePlatforms.map(function(platform) {
            if (!platform.platform) {
                throw new Error('Некорректная платформа');
            }
            return platform.platform.name
        })

    return normalizedGame
}

function showApiMessage(type) {
    if(type === 'hide') {
        apiApprowMessage.classList.remove('is-visible')
        apiDeclineMessage.classList.remove('is-visible')
    }
    else if(type === 'approw') {
        apiDeclineMessage.classList.remove('is-visible')
        apiApprowMessage.classList.add('is-visible')
    }
    else if(type === 'decline') {
        apiApprowMessage.classList.remove('is-visible')
        apiDeclineMessage.classList.add('is-visible')
    }
}

function apiAutoConnect() {
    currentApiKey = localStorage.getItem('igroteka:rawg-key')
    if(currentApiKey) {
        return connectToApi(currentApiKey)
    }
    else {
        return
    }
}

function deleteApiKey() {
    localStorage.removeItem('igroteka:rawg-key');
    currentApiKey = null;
    clearTimeout(debouncedSearch);
    if(apiController) {
        apiController.abort();
        apiController = null;
    }
    //catalog.innerHTML = '';
    apiPassword.value = '';
    showApiMessage('hide');
    apiPassword.classList.remove('wrong__password')
}

function createGameUrl(state, apiKey, genres, platforms) {
    let url = new URL('http://127.0.0.1:3000/api/games')
    url.searchParams.set('key', apiKey)

    if(state.query.trim() !== '') {
        url.searchParams.set('search', state.query.trim())
    }
    if(state.genre !== '') {
        let currentGenresObject = genres.find(function(genre) {
            return genre.name === state.genre
        })
        if(currentGenresObject) {
            url.searchParams.set('genres', currentGenresObject.id)
        }
    }
    if(state.platform !== '') {
        let currentPlatformsObject = platforms.find(function(platform) {
            return platform.name === state.platform
        })
        if(currentPlatformsObject) {
            url.searchParams.set('platforms', currentPlatformsObject.id)
        }
    }
    if(state.sort === 'default') {
        url.searchParams.set('ordering', '-added')
    }
    else if(state.sort === 'rating-desc') {
        url.searchParams.set('ordering', '-rating')
    }
    else if(state.sort === 'released-desc') {
        url.searchParams.set('ordering', '-released')
    }
    else if(state.sort === 'name-asc') {
        url.searchParams.set('ordering', 'name')
    }
    if(state.page !== 1) {
        url.searchParams.set('page', state.page)
    }
    url.searchParams.set('page_size', '20')
    return url
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


function renderModalCard(game) {
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
        return modalGame

}

function renderPlatformsOrGenresOptions(property, select) {
    for(let i = 0; i<property.length; i++){
        const platformName = document.createElement('option')
        platformName.value = property[i].name
        platformName.classList.add('filter-form__option')
        platformName.textContent = property[i].name
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
    let paramsPage = +urlParams.get('page')
    let newState = {
        query: '',
        genre: '',
        platform: '',
        sort: 'default',
        page: 1
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
    if(!Number.isInteger(paramsPage) || paramsPage < 1) {
        newState.page = 1
    }
    else {
        newState.page = paramsPage
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
        if(state.page !== 1) {
            newUrl.page = state.page
        }
    return newUrl
}

function createUrlFromState(state, url) {
    const newUrl = new URL(url);
    const params = newUrl.searchParams;
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

    return newUrl;
}

function updateUrl(state) {
    const newUrl = createUrlFromState(state, location.href);

    history.replaceState(null, '', newUrl);
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
    let newArray = [...array]
    if (state.sort === "rating-desc") {
        newArray.sort(function(a, b) {
            if (a.rating === null && b.rating === null) {
                return a.id - b.id;
            }

            if (a.rating === null) {
                return 1;
            }

            if (b.rating === null) {
                return -1;
            }

            return b.rating - a.rating || a.id - b.id;
        });
    }
    else if (state.sort === "released-desc") {
        newArray.sort(function(a, b) {
            if (a.released === null && b.released === null) {
                return a.id - b.id;
            }

            if (a.released === null) {
                return 1;
            }

            if (b.released === null) {
                return -1;
            }

            return b.released.localeCompare(a.released) || a.id - b.id;
        });
    }
    else if (state.sort === "name-asc") {
        newArray.sort(function(a, b) {
            if (a.name === null && b.name === null) {
                return a.id - b.id;
            }

            if (a.name === null) {
                return 1;
            }

            if (b.name === null) {
                return -1;
            }

            return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) || a.id - b.id;
        });
    }
    else if (state.sort === "default") {
        return newArray;
    }

    return newArray;
}

function getSortedGenresOrPlatforms(options) {
    let seenIds = new Set()
    let uniqueOptions = options.filter(function(option) {
        if(!seenIds.has(option.id)) {
            seenIds.add(option.id)
            return true;
        }
        return false
    })
    let sortedOptionArray = [...uniqueOptions ]
    sortedOptionArray.sort(function(a,b) {
        return a.name.localeCompare(b.name);
    })
    return sortedOptionArray
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


let promise = new Promise(function(resolve, reject) {
    setTimeout(function() {
        resolve(10);
    },2000);
});
promise
    .then(function(value) {
    return value + 1
})
    .then(function(value) {
        console.log(value)
})

let promise2 = new Promise(function(resolve, reject) {
    setTimeout(function() {
        reject(new Error('Failed'))
        resolve(10);
    },2000);
});
promise2
    .then(function(value) {
    value + 1
})
    .then(function(value) {
        console.log(value)
})
    .catch(function(error) {
        console.log(error)
})
    .finally(function() {
        console.log('выполнен finaly')
    })

    let promise3 = new Promise(function(resolve, reject) {
    setTimeout(function() {
        resolve(10);
    },2000);
});
    promise3
        .then(function(value) {
        value + 1
            throw new Error('Failed')
        })
        .then(function(value) {
            console.log(value)
        })
        .catch(function(error) {
            console.log(error)
        })
        .finally(function() {
            console.log('выполнен finaly')
        })

let promise4 = new Promise(function(resolve) {
    setTimeout(function() {
        resolve('Первый промис');
    }, 1000);
});

let promise5 = new Promise(function(resolve, reject) {
    setTimeout(function() {
        reject(new Error("Второй промис завершился ошибкой"));
    }, 3000);
});

Promise.all([promise4, promise5])
    .then(function(results) {
        console.log(results);
    })
    .catch(function(error) {
        console.log(error)
    })

async function getNumber() {
    return Promise.resolve(5);
}
async function showNumber() {
    try {
        let result = await getNumber()

        throw new Error('Failed');
        
        result = result * 3
        result = result + 10
        console.log(result)
    }
    catch(error) {
        console.log(error)
    }
}