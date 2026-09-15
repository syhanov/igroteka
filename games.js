//console.log(games[99]) говорит о том что 99 ячейка масива пустая
//console.log(games[99].title) выдает ошибку которая говорит что невозможно обратиться к title внутри пустой ячейки
const games = [
    {
        id : 1,
        title : "Cyberpunk 2077",
        alt : "Обложка игры Cyberpunk 2077",
        rating : 4.5,
        year : "2020-12-31",
        genre : ["RPG"],
        background_image : "styles/assets/covers/cyberpunk600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 2,
        title : "Ведьмак 3",
        alt : "Обложка игры Ведьмак 3",
        rating : 5,
        year : "2015-10-23",
        genre : ["Action RPG"],
        background_image : "styles/assets/covers/witcher600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 3,
        title : "Hotline Miami 2",
        alt : "Обложка игры Hotline Miami 2",
        rating : 4.5,
        year : "2015-08-01",
        genre : ["Action"],
        background_image : "styles/assets/covers/hotlinemiami2600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 4,
        title : "Assassin's Creed IV: Black Flag",
        alt : "Обложка игры Assassin's Creed IV: Black Flag",
        rating : 4,
        year : "2013-06-15",
        genre : ["Action Adventure"],
        background_image : "styles/assets/covers/blackflag600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 5,
        title : "Borderlands 2",
        alt : "Обложка игры Borderlands 2",
        rating : 3,
        year : "2012-03-21",
        genre : ["Action RPG"],
        background_image : "styles/assets/covers/borderlands-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 6,
        title : "Fallout 4",
        alt : "Обложка игры Fallout 4",
        rating : 3,
        year : "2015-01-27",
        genre : ["Action RPG"],
        background_image : "styles/assets/covers/fallout600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 7,
        title : "Dying Light",
        alt : "Обложка игры Dying Light",
        rating : 4.5,
        year : "2015-07-24",
        genre : ["Action Adventure"],
        background_image : "styles/assets/covers/dyinglight600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 8,
        title : "Grand Theft Auto V",
        alt : "Обложка игры Grand Theft Auto V",
        rating : 5,
        year : "2013-05-17",
        genre : ["Action Adventure"],
        background_image : "styles/assets/covers/gta600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 9,
        title : "Wolfenstein II: The New Colossus",
        alt : "Обложка игры Wolfenstein II: The New Colossus",
        rating : 4.5,
        year : "2017-05-24",
        genre : ["Action FPS"],
        background_image : "styles/assets/covers/wolfenstain600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 10,
        title : "The Elder Scrolls V: Skyrim",
        alt : "Обложка игры The Elder Scrolls V: Skyrim",
        rating : 5,
        year : "2011-09-19",
        genre : ["Action RPG"],
        background_image : "styles/assets/covers/tes600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 11,
        title : "Red Dead Redemption 2",
        alt : "Обложка игры Red Dead Redemption 2",
        rating : 4,
        year : "2019-06-29",
        genre : ["Action Adventure"],
        background_image : "styles/assets/covers/rdr600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 12,
        title : "Assassin’s Creed Odyssey",
        alt : "Обложка игры Assassin’s Creed Odyssey",
        rating : 4.5,
        year : "2018-05-11",
        genre : ["Action RPG"],
        background_image : "styles/assets/covers/odesey600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 13,
        title : "Elden Ring",
        alt : "Обложка игры Elden Ring",
        rating : 4,
        year : "2022-10-17",
        genre : ["Action RPG"],
        background_image : "styles/assets/covers/eldenring600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 14,
        title : 'Sam & Max: <Hit "the" Road>',
        alt : 'Обложка игры Sam & Max: <Hit "the" Road>',
        rating : 4,
        year : "1993-02-11",
        genre : ["Graphic Adventure"],
        background_image : "styles/assets/covers/SamMax-170.jpg" ,
        platforms : ["PC"],

    },
];


const titles = [];
for (const game of games) {
    titles.push(game.title);
}
const result = titles.join(', ');
console.log(titles);

const titles2 = games.map(function(game2) {
    return game2.title;
});
const result2 = titles2.join(', ')
console.log(titles2);

