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

    const smallImg = game.imgSrc.replace('170.jpg', '85.jpg')
    const largeImg = game.imgSrc.replace('170.jpg', '255.jpg')

    const srcSet = `${smallImg} 85w, ${game.imgSrc} 170w, ${largeImg} 255w`

    return `
                <article class="game-card game-card--catalog">
                    <div class="game-card__cover">
                        <img 
                            src="${game.imgSrc}"
                            srcset="${srcSet}"       
                            sizes="85px"                     
                            alt="${game.alt}" class="game-card__image"
                            width="600"
                            height="900">
                        <span class="game-card__rating-badge">${game.rating.toFixed(1)}</span>
                    </div>
                    <div class="game-card__content">
                        <h3 class="game-card__title">${game.title}</h3>
                        <div class="game-card__meta">
                            <span class="game-card__year">${game.year}</span>
                           <span class="game-card__genre">${game.genre[0]}</span>
                        </div>
                    </div>
                </article>
            `;
};

//плохо понял функции, поэтому оставил этот вариант, потому что он для меня более понятен.
function renderCatalog(games) {
    if (games.length === 0) {
       '<p>Пока пусто</p>';
    }

    let html = '';

    for (let i = 0; i < games.length; i++) {
        html += renderCard(games[i]);
    }

    return html;
}

catalog.innerHTML = (renderCatalog(games));