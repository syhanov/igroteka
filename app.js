console.log('M04, JavaSkript подключен');
const catalog = document.querySelector('.catalog');
console.log(catalog);
console.log(games);
console.log(game);


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

function test() {
    const game = 'Elden Ring';
    console.log(game);
}