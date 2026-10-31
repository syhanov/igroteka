
const testGenres = ['Action', 'Puzzle', 'Simulation'];
const testPlatforms = ['PC', 'PlayStation', 'Xbox'];

const ARRAY_FOR_TEST = [
  {
    "id": 3498,
    "name": "Grand Theft Auto V",
    "released": "2013-09-17",
    "background_image": "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg",
    "rating": 4,
    "genres": ['Rock & Roll'],
    "platforms": [
      "PlayStation 5",
      "Xbox Series S/X",
      "PlayStation 3",
      "PC",
      "PlayStation 4",
      "Xbox 360",
      "Xbox One",
      'PlayStation "Classic"'
    ]
  },
  {
    "id": 3328,
    "name": "The Witcher 3: Wild Hunt",
    "released": "2015-05-18",
    "background_image": "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
    "rating": 4.64,
    "genres": [null],
    "platforms": [
      "PlayStation 5",
      "Xbox Series S/X",
      "macOS",
      "PlayStation 4",
      "Nintendo Switch",
      "PC",
      "Xbox One"
    ]
  },
  {
    "id": 4200,
    "name": "Portal 2",
    "released": "2011-04-18",
    "background_image": "https://media.rawg.io/media/games/2ba/2bac0e87cf45e5b508f227d281c9252a.jpg",
    "rating": 4.57,
    "genres": [
      "Shooter",
      "Puzzle"
    ],
    "platforms": [
      "PlayStation 3",
      "PC",
      "Xbox 360",
      "Linux",
      "macOS",
      "Xbox One"
    ]
  }
]
const ARRAY_FOR_TEST_ID = [
  {
    "id":  4200,
    "name": "The Witcher 3: Wild Hunt",
    "released": "2015-05-18",
    "background_image": "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
    "rating": 4,
    "genres": [null],
    "platforms": [
      "PlayStation 5",
      "Xbox Series S/X",
      "macOS",
      "PlayStation 4",
      "Nintendo Switch",
      "PC",
      "Xbox One"
    ]
  },
  {
    "id": 3328,
    "name": "Portal 2",
    "released": "2011-04-18",
    "background_image": "https://media.rawg.io/media/games/2ba/2bac0e87cf45e5b508f227d281c9252a.jpg",
    "rating": 4,
    "genres": [
      "Shooter",
      "Puzzle"
    ],
    "platforms": [
      "PlayStation 3",
      "PC",
      "Xbox 360",
      "Linux",
      "macOS",
      "Xbox One"
    ]
  }
]

function assert(expected, actual, message) {
    if(JSON.stringify(expected) !== JSON.stringify(actual)) {
        throw new Error(`${message}`)
    }
}

// Принимает дату в виде строки и возвращает год (первые четыре символа до дефиса).
// Если дата отсутствует (null, undefined или пустая строка), возвращает пустую строку.
function assertFormatYear() {
    assert('2020', formatYear('2020-12-24'), 'Проверка корректности работы formatYear с переданной датой 2020-12-24')
    assert('2025', formatYear('2025-12-24'), 'Проверка корректности работы formatYear с переданной датой 2025-12-24')
    assert('1995', formatYear('1995-12-24'), 'Проверка корректности работы formatYear с переданной датой 1995-12-24')
    assert('', formatYear(null), 'Проверка null в дате')
    assert('', formatYear(''), 'Проверка пустой даты')
    assert('', formatYear(undefined), 'Проверка пустой даты')
}

// Принимает числовой рейтинг и возвращает его в виде строки с одним знаком после запятой.
// Если рейтинг равен null или undefined, возвращает пустую строку.
function assertFormatRating() {
    assert('4.9', formatRating(4.9), 'Проверка корректности работы formatRating с переданным числом 4.9')
    assert('4.5', formatRating(4.49), 'Проверка корректности работы formatRating с переданным числом 4.49')
    assert('4.4', formatRating(4.41), 'Проверка корректности работы formatRating с переданным числом 4.41')
    assert('5.0', formatRating(5), 'Проверка корректности работы formatRating с переданным числом 5')
    assert('', formatRating(null), 'Проверка корректности работы formatRating с переданным null')
    assert('', formatRating(undefined), 'Проверка корректности работы formatRating с переданным undefined')
}

// Принимает строку и заменяет специальные HTML-символы:
// &, <, > и " на соответствующие HTML-сущности.
// Если значение равно null или undefined, возвращает пустую строку.
// Апостроф не заменяется.
function assertEscapeHTML() {
    assert('Обычный текст без специальных символов', escapeHTML('Обычный текст без специальных символов'), 'Проверка обычного текста без спец символов')
    assert('&amp;', escapeHTML('&'), 'Проверка escapeHTML с символом &')
    assert('&lt;', escapeHTML('<'), 'Проверка escapeHTML с символом <')
    assert('&gt;', escapeHTML('>'), 'Проверка escapeHTML с символом >')
    assert(`&quot;`, escapeHTML(`"`), 'Проверка escapeHTML с символом "')
    assert('', escapeHTML(null), 'Проверка escapeHTML с null')
    assert('', escapeHTML(undefined), 'Проверка escapeHTML с undefined')
    assert('', escapeHTML(''), 'Проверка escapeHTML с пустой строкой')
    assert('&lt;div title=&quot;test&quot;&gt;&amp;&lt;/div&gt;', escapeHTML('<div title="test">&</div>'), 'Проверка escapeHTML в строке с множеством символов')
}

// Принимает массив значений и объединяет их в одну строку через разделитель " • ".
// Если массив отсутствует (null или undefined), возвращает пустую строку.
function assertGetGenresOrPlatforms() {
    assert('Rock & Roll', getGenresOrPlatforms(['Rock & Roll']), `Проверка getGenresOrPlatforms на массиве с 1 жанром ['Rock & Roll']`)
    assert("Shooter • Puzzle", getGenresOrPlatforms(["Shooter","Puzzle"]), `Проверка getGenresOrPlatforms на массиве такого вида: ["Shooter","Puzzle"]`)
    assert("", getGenresOrPlatforms([]), `Проверка getGenresOrPlatforms на пустом массиве`)
    assert("", getGenresOrPlatforms(null), `Проверка getGenresOrPlatforms с переданым null`)
    assert("", getGenresOrPlatforms(undefined), `Проверка getGenresOrPlatforms с переданым undefined`)
}

// Принимает массив игр и название свойства (genres или platforms).
// Собирает значения указанного свойства, исключает null и undefined,
// удаляет повторяющиеся значения и возвращает отсортированный по алфавиту массив.
function assertGetSortedGamesGenresOrPlatforms() {
    assert([
        'Linux',
        'macOS',
        'Nintendo Switch',
        'PC',
        'PlayStation "Classic"',
        'PlayStation 3',
        'PlayStation 4',
        'PlayStation 5',
        'Xbox 360',
        'Xbox One',
        'Xbox Series S/X'
    ], 
        getSortedGamesGenresOrPlatforms(ARRAY_FOR_TEST, 'platforms'), 
        'Проверка функции getSortedGenresOrPlatforms на массиве платформ на уникальные элементы и расстановку по алфавиту')
    assert([
        'Puzzle', 
        'Rock & Roll', 
        'Shooter'
    ], 
        getSortedGamesGenresOrPlatforms(ARRAY_FOR_TEST, 'genres'), 
        'Проверка функции getSOrtedGenresOrPlatforms на массиве жанров на расстановку по алфавиту и в выборке присутствует null')
}

// paramsToState(genres, platforms, urlParams)
// Преобразует параметры URL в объект состояния каталога.
// Принимает:
//   genres — массив допустимых жанров;
//   platforms — массив допустимых платформ;
//   urlParams — объект URLSearchParams с параметрами URL.
// Возвращает объект состояния с полями:
//   query — поисковый запрос из параметра q или пустую строку;
//   genre — жанр, если он присутствует в массиве genres, иначе пустую строку;
//   platform — платформу, если она присутствует в массиве platforms, иначе пустую строку;
//   sort — допустимый вариант сортировки (rating-desc, released-desc, name-asc),
//          иначе default.
function assertParamsToState() {
    const params1 = new URLSearchParams('?q=Portal&genre=Puzzle&platform=PC&sort=name-asc');
    assert(
        {
        query: 'Portal',
        genre:  'Puzzle',
        platform: 'PC',
        sort:  'name-asc'
    },
    paramsToState(testGenres, testPlatforms, params1),
    'Проверка paramsToState с полностью заполнеными данными'
    )

    const params2 = new URLSearchParams('');
    assert(
        {
        query: '',
        genre:  '',
        platform: '',
        sort:  'default'
    },
    paramsToState(testGenres, testPlatforms, params2),
    'Проверка ParamsToState с пустыми данными'
    )

    const params3 = new URLSearchParams('?q=qwe&genre=182&platform=null&sort=undefined');
    assert(
        {
        query: 'qwe',
        genre:  '',
        platform: '',
        sort:  'default'
    },
    paramsToState(testGenres, testPlatforms, params3),
    'Проверка ParamsToState с выдуманными данными'
    )

    const params4 = new URLSearchParams('?genre=Simulation&sort=rating-desc');
    assert(
        {
        query: '',
        genre:  'Simulation',
        platform: '',
        sort:  'rating-desc'
    },
    paramsToState(testGenres, testPlatforms, params4),
    'Проверка ParamsToState с частично заполненными полями'
    )
}

// stateToParams(state)
// Преобразует объект состояния каталога в объект параметров URL.
// Принимает:
//   state — объект состояния каталога с полями query, genre, platform и sort.
// Возвращает объект параметров URL:
//   q — поисковый запрос из state.query, если он не пустой;
//   genre — жанр, если он выбран;
//   platform — платформа, если она выбрана;
//   sort — вариант сортировки, если он отличается от 'default'.
// Пустые значения и сортировку по умолчанию не добавляет.
function assertStateToParams() {
    const state1 = {
        query: '',
        genre:  'Simulation',
        platform: '',
        sort:  'rating-desc'
    }
    assert(
        {
        genre:  'Simulation',
        sort:  'rating-desc'
        },
        stateToParams(state1),
        'Проверка stateToParams с частично заполненными полями'
    )

    const state2 = {
        query: '',
        genre:  '',
        platform: '',
        sort:  'default'
    }
    assert(
        {},
        stateToParams(state2),
        'Проверка stateToParams с пустыми полями'
    )

    const state3 = {
        query: 'qwe',
        genre:  'Puzzle',
        platform: 'PC',
        sort:  'name-asc'
    }
    assert(
        {
        q: 'qwe',
        genre:  'Puzzle',
        platform: 'PC',
        sort:  'name-asc'
        },
        stateToParams(state3),
        'Проверка stateToParams с полностью заполненными полями'
    )
}

// selectGames(games, state)
// Отбирает игры из массива по параметрам состояния каталога и сортирует результат.
// Принимает:
//   games — массив объектов с данными об играх;
//   state — объект состояния каталога с полями:
//     query — поисковый запрос по названию игры;
//     genre — выбранный жанр или пустая строка;
//     platform — выбранная платформа или пустая строка;
//     sort — способ сортировки.
// Возвращает:
//   новый массив игр, соответствующих заданным фильтрам,
//   отсортированный согласно параметру state.sort.
// Исходный массив games не изменяет.
function assertSelectGames() {
    const state1 = {
    query: 'portal',
    genre: '',
    platform: '',
    sort: 'default'
};
    assert([ARRAY_FOR_TEST[2]], selectGames(ARRAY_FOR_TEST, state1), 'Проверка selectGames по названию')

    const state2 = {
    query: 'portal',
    genre: 'Puzzle',
    platform: 'Nintendo',
    sort: 'default'
};
    assert([], selectGames(ARRAY_FOR_TEST, state2), 'Проверка selectGames на поведение без совпадений')

    const state3 = {
    query: 'PORTAL',
    genre: '',
    platform: '',
    sort: 'default'
};
    assert([ARRAY_FOR_TEST[2]], selectGames(ARRAY_FOR_TEST, state3), 'Проверка selectGames без учета регистра')

    const state4 = {
    query: '    portal     ',
    genre: '',
    platform: '',
    sort: 'default'
};
    assert([ARRAY_FOR_TEST[2]], selectGames(ARRAY_FOR_TEST, state4), 'Проверка selectGames удаление пробелов по краям')

    const state5 = {
    query: '',
    genre: 'Puzzle',
    platform: '',
    sort: 'default'
};
    assert([ARRAY_FOR_TEST[2]], selectGames(ARRAY_FOR_TEST, state5), 'Проверка selectGames на поиск по жанрам')

    const state6 = {
    query: '',
    genre: '',
    platform: 'Linux',
    sort: 'default'
};
    assert([ARRAY_FOR_TEST[2]], selectGames(ARRAY_FOR_TEST, state6), 'Проверка selectGames на поиск по платформе')

    const state7 = {
    query: '',
    genre: 'Puzzle',
    platform: 'Linux',
    sort: 'default'
};
    assert([ARRAY_FOR_TEST[2]], selectGames(ARRAY_FOR_TEST, state7), 'Проверка selectGames на совместную работу фильтров')

    const state8 = {
    query: '',
    genre: '',
    platform: '',
    sort: 'default'
};
    assert(ARRAY_FOR_TEST, selectGames(ARRAY_FOR_TEST, state8), 'Проверка selectGames с отключенными фильтрами')
}

function assertSelectGamesReturnsNewArray() {
    const state = {
        query: '',
        genre: '',
        platform: '',
        sort: 'default'
    };

    const result = selectGames(ARRAY_FOR_TEST, state);

    if (result === ARRAY_FOR_TEST) {
        throw new Error('selectGames вернула исходный массив вместо нового');
    }
}

function assertSelectGamesDoesNotMutateOriginal() {
    const original = JSON.stringify(ARRAY_FOR_TEST);

    const state = {
        query: '',
        genre: '',
        platform: '',
        sort: 'rating-desc'
    };

    selectGames(ARRAY_FOR_TEST, state);

    if (original !== JSON.stringify(ARRAY_FOR_TEST)) {
        throw new Error('selectGames изменила исходный массив');
    }
}

/*
 * Контракт sortNewGamesArray(array, state)
 *
 * Назначение:
 * Возвращает новый массив игр, отсортированный согласно выбранному критерию.
 *
 * Входные данные:
 * - array — массив объектов игр.
 * - state — объект состояния с параметром sort.
 *
 * Правила сортировки:
 * - rating-desc — рейтинг по убыванию;
 * - released-desc — дата выхода по убыванию;
 * - name-asc — название по алфавиту (A → Z);
 * - default — сохранение исходного порядка.
 *
 * Если основные значения совпадают, дополнительная сортировка
 * выполняется по id в порядке возрастания.
 *
 * Ожидаемый результат:
 * - возвращается новый массив;
 * - исходный массив не изменяется;
 * - объекты внутри массива сохраняют исходные ссылки;
 * - порядок элементов соответствует выбранному критерию.
 *
 * Ограничения:
 * - функция не проверяет корректность входных данных;
 * - не обрабатывает отсутствующие или некорректные значения
 *   rating, released, name и id;
 * - при неизвестном режиме сортировки возвращает копию
 *   массива в исходном порядке.
 */
function assertSortNewGamesArray() {
    const state1 = {
        query: '',
        genre: '',
        platform: '',
        sort: 'rating-desc'
    }
    assert([
        ARRAY_FOR_TEST[1],
        ARRAY_FOR_TEST[2],
        ARRAY_FOR_TEST[0]
    ],
    sortNewGamesArray(ARRAY_FOR_TEST, state1),
    'Проверка sortNewGamesArray на коректность сортировки по рейтингу')

    const state2 = {
        query: '',
        genre: '',
        platform: '',
        sort: 'released-desc'
    }
    assert([
        ARRAY_FOR_TEST[1],
        ARRAY_FOR_TEST[0],
        ARRAY_FOR_TEST[2]
    ],
    sortNewGamesArray(ARRAY_FOR_TEST, state2),
    'Проверка sortNewGamesArray на коректность сортировки по дате')

    const state3 = {
        query: '',
        genre: '',
        platform: '',
        sort: 'name-asc'
    }
    assert([
        ARRAY_FOR_TEST[0],
        ARRAY_FOR_TEST[2],
        ARRAY_FOR_TEST[1]
    ],
    sortNewGamesArray(ARRAY_FOR_TEST, state3),
    'Проверка sortNewGamesArray на коректность сортировки по имени')

    const state4 = {
        query: '',
        genre: '',
        platform: '',
        sort: 'default'
    }
    assert(ARRAY_FOR_TEST,
    sortNewGamesArray(ARRAY_FOR_TEST, state4),
    'Проверка sortNewGamesArray на коректность сортировки с исходным порядком')
}

function assertSortNewGamesArrayReturnsNewArray() {
    const state = {
        query: '',
        genre: '',
        platform: '',
        sort: 'default'
    };

    const result = sortNewGamesArray(ARRAY_FOR_TEST, state);

    if (result === ARRAY_FOR_TEST) {
        throw new Error('sortNewGamesArray вернула исходный массив вместо нового');
    }
}

function assertSortNewGamesArrayDoesNotMutateOriginal() {
    const original = JSON.stringify(ARRAY_FOR_TEST);

    const state = {
        query: '',
        genre: '',
        platform: '',
        sort: 'rating-desc'
    };

    sortNewGamesArray(ARRAY_FOR_TEST, state);

    if (original !== JSON.stringify(ARRAY_FOR_TEST)) {
        throw new Error('selectGames изменила исходный массив');
    }
}

function assertSortNewGamesArraySotrtingById() {
    const state = {
        query: '',
        genre: '',
        platform: '',
        sort: 'rating-desc'
    };

    assert([
        ARRAY_FOR_TEST_ID[1],
        ARRAY_FOR_TEST_ID[0]
    ],
    sortNewGamesArray(ARRAY_FOR_TEST_ID, state),
    'Проверка sortNewGamesArray на коректность сортировки по id')
}

function runChecks() {
    assertFormatYear();
    assertFormatRating();
    assertEscapeHTML();
    assertGetGenresOrPlatforms();
    assertGetSortedGamesGenresOrPlatforms();
    assertParamsToState();
    assertStateToParams();
    assertSelectGames();
    assertSelectGamesReturnsNewArray();
    assertSelectGamesDoesNotMutateOriginal();
    assertSortNewGamesArray();
    assertSortNewGamesArrayReturnsNewArray();
    assertSortNewGamesArrayDoesNotMutateOriginal();
    assertSortNewGamesArraySotrtingById();
    console.log('Все проверки успешно пройдены')
}

runChecks()
