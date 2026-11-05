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
        applyState()
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
    debouncedSearch()
})

platformsSelect.addEventListener('change', function() {
    state.platform = platformsSelect.value
    debouncedSearch()
})

sortFilteredGames.addEventListener('change', function() {
    state.sort = sortFilteredGames.value
    debouncedSearch()
})

resetButton.addEventListener('click', function(event) {
    state.query = '';
    state.genre = '';
    state.platform = '';
    state.sort = 'default';
    applyState()
})

function debounceQueryChange() {
    applyState()
}

function applyState() {
    const selectedGames = selectGames(GAMES, state);
    catalog.innerHTML = renderCatalog(selectedGames);
    gamesCount.textContent = `показанно ${selectedGames.length} из ${GAMES.length}`
    updateUrl(state);
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

function getSortedGamesGenresOrPlatforms(games, property) {
    let gamesOptionArray = games.flatMap(function(game) {
        return game[property];
    }).filter(function(option) {
        return option !== null;
    });
    let uniqueOptions  = new Set(gamesOptionArray)
    let sortedOptionArray = [...uniqueOptions ]
    sortedOptionArray.sort(function(a,b) {
        return a.localeCompare(b);
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