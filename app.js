//Блок 1. Селекторы и исходные значения
const catalog = document.querySelector('.games__cards')

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
const seePasswordButton = document.querySelector('.login__password-toggle')
const apiConnectButton = document.querySelector('.login__button--connect')
const apiDeleteButton = document.querySelector('.login__button--delete')
const apiApprowMessage = document.querySelector('.api__approw')
const apiDeclineMessage = document.querySelector('.api__decline')
const apiDisconnectedMessage = document.querySelector('.api__disconnected')
const apiStorageErrorMessage = document.querySelector('.api__storage-error')
let currentApiKey = ''

let apiController = null;
let searchController = null;

let currentGames = [];
let rawgGenres = []
let rawgPlatforms = []
let totalGames = 0

let state = {
    query: '',
    genre: '',
    platform: '',
    sort: 'default',
    page: 1
};

let gamesState = {
    status: 'disconnected',
    games: [],
    count: 0,
    next: null,
    previous: null,
    error: null,
    errorType: null
};

const catalogLoading = document.querySelector('.catalog__loading');
const catalogState = document.querySelector('.catalog__state');

const timeoutWrapper = document.querySelector('.catalog__timeout-wrapper');
const wrongKeyWrapper = document.querySelector('.catalog__wrong-key-wrapper');
const noMatchesWrapper = document.querySelector('.catalog__no-matches-wrapper');
const apiDisconnectedWrapper = document.querySelector('.catalog__disconnected-wrapper')

const timeoutReconnectButton = document.querySelector('.catalog__timeout-reconnect-button')
const timeoutCheckKeyButton = document.querySelector('.catalog__timeout-check-key-button')
const noMatchesDropFiltrsButton = document.querySelector('.catalog__no-matches-drop-filtrs-button')
const noMatchesShowAllGamesButton = document.querySelector('.catalog__no-matches-show-all-games-button')
const DisconnectedConnectButton = document.querySelector('.catalog__disconnected-connect-button')
const fixKeyButton = document.querySelector('.catalog__fix-key-button')

const wrongKeyHttpStatus = document.querySelector('.catalog__wrong-key-http-status')
const wrongKeyTextLabel = document.querySelector('.catalog__wrong-key-text-label')
const wrongKeyTextDescription = document.querySelector('.catalog__wrong-key-text-description')
const timeoutTextLabel = document.querySelector('.catalog__timeout-text-label')
const timeoutTextDescription = document.querySelector('.catalog__timeout-text-description')
const timeoutHttpStatus = document.querySelector('.catalog__timeout-http-status')
const noMatchesText = document.getElementById('nomatchestext')


const paginationContainer = document.querySelector('.games__pagination')
const paginationNumbers = document.querySelector('.pagination__pages')
const prevPageButtonArrow = document.querySelector('.pagination__button--prev')
const nextPageButtonArrow = document.querySelector('.pagination__button--next')
const pagesCount = document.querySelector('.pagination__count')
//Блок 2. Запуск

async function init() {
    await apiAutoConnect()
    renderGamesState()
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
seePasswordButton.addEventListener('pointerdown', function() {
    apiPassword.type = 'text'
})
document.addEventListener('pointerup', function() {
    apiPassword.type = 'password'
})
document.addEventListener('pointercancel', function() {
    apiPassword.type = 'password'
})
window.addEventListener('blur', function() {
    apiPassword.type = 'password'
})
apiDeleteButton.addEventListener('click', function() {
    deleteApiKey()
})

timeoutReconnectButton.addEventListener('click', function() {
    searchGames(false);
})
timeoutCheckKeyButton.addEventListener('click', function() {
    apiPassword.focus();
})
noMatchesDropFiltrsButton.addEventListener('click', function() {
    state.genre = '';
    state.platform = '';
    state.sort = 'default';
    syncFormWithState(state)
    searchGames();
})
noMatchesShowAllGamesButton.addEventListener('click', function() {
    state.query = '';
    state.genre = '';
    state.platform = '';
    state.sort = 'default';
    syncFormWithState(state)
    searchGames();
})
DisconnectedConnectButton.addEventListener('click', function() {
    apiPassword.focus();
})
fixKeyButton.addEventListener('click', function() {
    apiPassword.focus();
})

catalog.addEventListener('click', function(event){

    const card = event.target.closest('.game-card')
    if(!card){
        return
    }
    const id = card.dataset.id
    console.log('ID карточки:', id);
console.log('Текущие игры:', currentGames);
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

paginationNumbers.addEventListener('click', function(event) {
    if(gamesState.status === 'loading') {
        return;
    }
    let currentButton = event.target.closest('button')
    if(!currentButton|| !paginationNumbers.contains(currentButton)) {
        return
    }
    if(isNaN(+currentButton.textContent)) {
        return;
    }
    state.page = +(currentButton.textContent)
    searchGames(false)
    currentButton.classList.add('pagination__button--active')
})

prevPageButtonArrow.addEventListener('click', function() {
    if(gamesState.previous) {
        state.page -= 1
        searchGames(false)
        return
    }
})
nextPageButtonArrow.addEventListener('click', function() {
    if(gamesState.next) {
        state.page += 1
        searchGames(false)
        return
    }
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

function renderGamesState() {
    renderPagination()
    prevPageButtonArrow.disabled = !gamesState.previous;
    nextPageButtonArrow.disabled = !gamesState.next;

    catalogLoading.classList.add('is-hidden')
    catalogState.classList.add('is-hidden')
    gamesCount.classList.add('is-hidden')
    pagesCount.classList.add('is-hidden')
    let totalPages = Math.ceil(gamesState.count / 20);
    timeoutWrapper.classList.add('is-hidden')
    wrongKeyWrapper.classList.add('is-hidden')
    noMatchesWrapper.classList.add('is-hidden')
    apiDisconnectedWrapper.classList.add('is-hidden')
    catalog.classList.add('is-hidden')
    showApiMessage('hide');
    apiPassword.classList.remove('wrong__password');

    switch(gamesState.status) {
        case 'loading':
            catalogLoading.classList.remove('is-hidden')
            break;

        case 'success' :
            catalog.innerHTML = renderCatalog(gamesState.games)
            gamesCount.textContent = `показанно ${gamesState.games.length} из ${gamesState.count}`
            gamesCount.classList.remove('is-hidden')
            pagesCount.textContent = `страница ${state.page} из ${totalPages}`
            pagesCount.classList.remove('is-hidden')
            catalog.classList.remove('is-hidden')
            showApiMessage('approw')
            break;
        

        case 'empty' :
            noMatchesText.textContent = "«" + state.query + "»"
            gamesCount.classList.remove('is-hidden')
            catalogState.classList.remove('is-hidden')
            noMatchesWrapper.classList.remove('is-hidden')
            break;  

        case 'error' :
            if(gamesState.errorType === 'timeout') {
                        if(gamesState.error.status === 429) {
                            timeoutTextLabel.textContent = 'Превышен лимит запросов к RAWG API'
                            timeoutTextDescription.textContent = 'Сервер временно ограничил количество запросов. Подождите немного и повторите попытку позже.'
                            timeoutHttpStatus.textContent = 'HTTP 429 · Too Many Requests'
                        }
                        else if(gamesState.error.status === 500) {
                            timeoutTextLabel.textContent = 'Не удалось получить список игр'
                            timeoutTextDescription.textContent = 'На стороне RAWG API произошла внутренняя ошибка. Попробуйте повторить запрос через некоторое время.'
                            timeoutHttpStatus.textContent = 'HTTP 500 · Internal Server Error'
                        }
                        else if(gamesState.error.status === 503) {
                            timeoutTextLabel.textContent = 'RAWG API временно недоступен'
                            timeoutTextDescription.textContent = 'Сервер временно не может обработать запрос. Подождите немного и попробуйте загрузить каталог снова.'
                            timeoutHttpStatus.textContent = 'HTTP 503 · Service Unavailable'
                        }
                        else if(gamesState.error.status instanceof TypeError) {
                            timeoutTextLabel.textContent = 'Не удалось связаться с RAWG API'
                            timeoutTextDescription.textContent = 'Проверьте подключение к интернету и попробуйте загрузить каталог повторно. Возможно, соединение с сервером было прервано.'
                            timeoutHttpStatus.textContent = 'Ошибка соединения'
                        }
                        else if(gamesState.error.status instanceof SyntaxError) {
                            timeoutTextLabel.textContent = 'Не удалось обработать ответ сервера'
                            timeoutTextDescription.textContent = 'RAWG API вернул данные в неожиданном формате. Попробуйте повторить запрос позже.'
                            timeoutHttpStatus.textContent = 'Invalid Response'
                        }
                        else {
                            timeoutTextLabel.textContent = 'Не удалось получить список игр'
                            timeoutTextDescription.textContent = 'Сервер вернул ошибку при обработке запроса. Попробуйте повторить попытку позже.'
                            timeoutHttpStatus.textContent = 'Unexpected Error'
                        }
                catalogState.classList.remove('is-hidden')
                timeoutWrapper.classList.remove('is-hidden')
            }
            else if(gamesState.errorType === 'wrong-key') {
                if(gamesState.error.status === 401) {
                    wrongKeyTextLabel.textContent = 'Для загрузки каталога требуется активный API-ключ RAWG'
                    wrongKeyTextDescription.textContent = 'Сервер отклонил предоставленный API-ключ. Проверьте правильность токена и укажите действующий ключ в форме подключения выше.'
                    wrongKeyHttpStatus.textContent = 'HTTP 401 · Unauthorized'
                }
                else if(gamesState.error.status === 403) {
                    wrongKeyTextLabel.textContent = 'Сервер запретил доступ к каталогу'
                    wrongKeyTextDescription.textContent = 'Запрос отклонён сервером. Проверьте доступность API-ключа и его разрешения, затем попробуйте подключиться снова.'
                    wrongKeyHttpStatus.textContent = 'HTTP 403 · Forbidden'
                }
                catalogState.classList.remove('is-hidden')
                wrongKeyWrapper.classList.remove('is-hidden')
                apiPassword.classList.add('wrong__password');
                showApiMessage('decline');
            }
            break;
        case 'disconnected':
            catalogState.classList.remove('is-hidden');
            apiDisconnectedWrapper.classList.remove('is-hidden');
            showApiMessage('disconnected')
            break;
    }
}

function renderPagination() {
    let totalPages = Math.ceil(gamesState.count / 20)
    let paginationHtml = ''
    let currentPage = state.page;
    let nextPage  = Math.min(totalPages, currentPage + 1)
    let previousPage  = Math.max(1, currentPage - 1)

    if(totalPages < 2 || gamesState.status !== 'success') {
        paginationContainer.classList.add('is-hidden')
        paginationNumbers.innerHTML = paginationHtml
        return
    }

    if(totalPages <= 3) {
        for(let page = 1; page <= totalPages; page++) {
            if(page === currentPage) {
                paginationHtml += `<button class="pagination__button pagination__button--active"
                                    disabled
                                    type="button">${page}</button>`;
            }
            else {
                paginationHtml += `<button class="pagination__button"
                                    type="button">${page}</button>`;
            }
        }

        paginationNumbers.innerHTML = paginationHtml;
        paginationContainer.classList.remove('is-hidden');
        return;
    }
    else {
        if(currentPage === 1) {
            paginationHtml += `<button class="pagination__button pagination__button--active"
                                disabled
                                type="button">`+ currentPage + `</button>`;
            paginationHtml += `<button class="pagination__button"
                                type="button">`+ nextPage + `</button>`;
            paginationHtml += `<button class="pagination__button"
                                type="button">`+ (nextPage + 1)+ `</button>`;
            paginationHtml += `<button class="pagination__button"
                                type="button">`+ '...'+ `</button>`;
            paginationHtml += `<button class="pagination__button"
                                type="button">`+ totalPages + `</button>`;
        }
        else if(currentPage === totalPages) {
            paginationHtml += `<button class="pagination__button"
                                type="button">`+ '1'+ `</button>`;
            paginationHtml += `<button class="pagination__button"
                                type="button">`+ '...'+ `</button>`;
            paginationHtml += `<button class="pagination__button"
                                type="button">`+ (previousPage - 1)+ `</button>`;
            paginationHtml += `<button class="pagination__button"
                                type="button">`+ previousPage + `</button>`;
            paginationHtml += `<button class="pagination__button pagination__button--active"
                                disabled
                                type="button">`+ totalPages + `</button>`;
        }
        else {
                paginationHtml += `<button class="pagination__button"
                                type="button">`+ '1'+ `</button>`;
                if(previousPage>2){
                    paginationHtml += `<button class="pagination__button"
                                        type="button">`+ '...'+ `</button>`;
                }
                if(previousPage > 1) {
                    paginationHtml += `<button class="pagination__button"
                                        type="button">`+ previousPage + `</button>`;
                }
                paginationHtml += `<button class="pagination__button pagination__button--active"
                                disabled
                                type="button">`+ currentPage + `</button>`;
                if(nextPage < totalPages) {
                    paginationHtml += `<button class="pagination__button"
                                    type="button">`+ nextPage + `</button>`;
                }
                if(nextPage < totalPages - 1){
                paginationHtml += `<button class="pagination__button"
                                        type="button">`+ '...'+ `</button>`;
                }
                paginationHtml += `<button class="pagination__button"
                                type="button">`+ totalPages + `</button>`;
            }
        }

    paginationNumbers.innerHTML = paginationHtml
    paginationContainer.classList.remove('is-hidden')
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

}

async function connectToApi(apiKey) {
    if(apiController) {
        apiController.abort()
    }
    apiController = new AbortController();

    gamesState.status = 'loading';
    renderGamesState();
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
        updateUrl(state)

        initializeCatalog(rawgGenres, rawgPlatforms)

        searchGames(false)

        apiPassword.value = ''
    }
    catch(error) {
        if(error.name === 'AbortError') {
            return
        }
        console.error(error);
        gamesState.status = 'error';
        gamesState.errorType = 'wrong-key';

        renderGamesState();
    }
    finally {
    }
}

async function searchGames(resetPage) {
    if(resetPage !== false) {
        state.page = 1;
    }

    updateUrl(state);
    if(searchController) {
        searchController.abort()
    }
    let controller = new AbortController();
    searchController = controller

    gamesState.status = 'loading';
    gamesState.games = [];
    gamesState.count = 0;
    gamesState.next = null;
    gamesState.previous = null;
    gamesState.error = null;
    gamesState.errorType = null;

    renderGamesState();

    try {
        let url = createGameUrl(state, currentApiKey, rawgGenres, rawgPlatforms)
        let data = await fetchData(url, controller.signal)
        if(searchController !== controller) {
            return
        }
        gamesState.games = data.results.map(function(rawGame) {
                return normalizeGame(rawGame);
            });
        currentGames = gamesState.games;
        gamesState.count = data.count
        gamesState.next = data.next
        gamesState.previous = data.previous

        if(data.count === 0 && data.results.length === 0) {
            gamesState.status = 'empty'
        }
        else if(data.count > 0 && data.results.length === 0) {
            gamesState.status = 'error'
        }
        else {
            gamesState.status = 'success'
        }

        renderGamesState()
        }
    catch(error) {
        if(searchController !== controller) {
        return;

        }
        if(error.name === 'AbortError') {
            return
        }
        gamesState.error = error
        if(error.status === 401) {
            gamesState.status = 'error';
            gamesState.errorType = 'wrong-key';
        }
        else if(error.status === 403) {
            gamesState.status = 'error';
            gamesState.errorType = 'wrong-key';
        }
        else if(error.status === 429) {
            gamesState.status = 'error';
            gamesState.errorType = 'timeout';
        }
        else if(error.status === 500) {
            gamesState.status = 'error';
            gamesState.errorType = 'timeout';
        }
        else if(error.status === 503) {
            gamesState.status = 'error';
            gamesState.errorType = 'timeout';
        }
        else if(error instanceof TypeError) {
            gamesState.status = 'error';
            gamesState.errorType = 'timeout';
        }
        else if(error instanceof SyntaxError) {
            gamesState.status = 'error';
            gamesState.errorType = 'timeout';
        }
        else {
            gamesState.status = 'error';
            gamesState.errorType = 'timeout';
        }
        renderGamesState();
        console.error(error);
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
        showApiMessage('storage-error');
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
        let error = new Error('HTTP error:' + response.status)
        error.status = response.status
        throw error
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
        apiApprowMessage.classList.remove('is-visible')
        apiDeclineMessage.classList.remove('is-visible')
        apiDisconnectedMessage.classList.remove('is-visible')   
        apiStorageErrorMessage.classList.remove('is-visible')

    if(type === 'approw') {
        apiApprowMessage.classList.add('is-visible')
    }
    else if(type === 'decline') {
        apiDeclineMessage.classList.add('is-visible')
    }
    else if(type === 'disconnected') {
        apiDisconnectedMessage.classList.add('is-visible')
    }
    else if(type === 'storage-error') {
        apiStorageErrorMessage.classList.add('is-visible')
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
    if(searchController) {
        searchController.abort();
        searchController = null;
    }

    apiPassword.value = '';

    gamesState = {
        status: 'disconnected',
        games: [],
        count: 0,
        next: null,
        previous: null,
        error: null,
        errorType: null
    };
    renderGamesState()
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
    let paramsGenre = urlParams.get('genre');
    let paramsQuery = urlParams.get('q');
    let paramsPlatform = urlParams.get('platform');
    let paramsSort = urlParams.get('sort');
    let paramsPage = urlParams.get('page');

    let pageNumber = Number(paramsPage);
    let hasInvalidFilters = false;

    let newState = {
        query: '',
        genre: '',
        platform: '',
        sort: 'default',
        page: 1
    };

    for(let i = 0; i < genres.length; i++) {
        if(paramsGenre === genres[i]) {
            newState.genre = genres[i];
            break;
        }
    }

    if(paramsGenre && newState.genre === '') {
        hasInvalidFilters = true;
    }

    for(let i = 0; i < platforms.length; i++) {
        if(paramsPlatform === platforms[i]) {
            newState.platform = platforms[i];
            break;
        }
    }

    if(paramsPlatform && newState.platform === '') {
        hasInvalidFilters = true;
    }

    if(paramsQuery) {
        newState.query = paramsQuery;
    }

    if(paramsSort === 'rating-desc' ||
       paramsSort === 'released-desc' ||
       paramsSort === 'name-asc') {

        newState.sort = paramsSort;
    }
    else if(paramsSort && paramsSort !== 'default') {
        hasInvalidFilters = true;
    }

    if(
        paramsPage !== null &&
        /^[0-9]+$/.test(paramsPage) &&
        Number.isSafeInteger(pageNumber) &&
        pageNumber > 0
    ) {
        newState.page = pageNumber;
    }

    if(hasInvalidFilters) {
        newState.page = 1;
    }

    return newState;
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

    const catalogParams = ['q', 'genre', 'platform', 'sort', 'page'];

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
