const catalog = document.querySelector('.games__grid')

// Ответственность вызывающего кода: в try написано какого формата строку ожидает функция.
function formatYear(released) {
    const pieces = released.split('-');
    return pieces[0];
}

function formatRating(rating) {
    const number = rating.toFixed(1);
    return number;
}

function escapeHTML(text) {
    let result = text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');

    return result;
}


function renderCard(game) {

    const smallImg = game.background_image.replace('170.jpg', '85.jpg')
    const largeImg = game.background_image.replace('170.jpg', '255.jpg')

    const srcSet = `${smallImg} 85w, ${game.background_image} 170w, ${largeImg} 255w`

    return `
                <article class="game-card game-card--catalog">
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
                           <span class="game-card__genre">${escapeHTML(game.genres[0])}</span>
                        </div>
                    </div>
                </article>
            `;
};

//плохо понял функции, поэтому оставил этот вариант, потому что он для меня более понятен.
function renderCatalog(games) {
    if (games.length === 0) {
        return `
           <p class="games__grid__empty">Пока пусто</p>
        `;
    }

    let html = '';

    for (let i = 0; i < GAMES.length; i++) {
        console.log(GAMES[i]);
        html += renderCard(GAMES[i]);
    }

    return html;
}

catalog.innerHTML = (renderCatalog(GAMES));