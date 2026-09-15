//console.log(games[99]) говорит о том что 99 ячейка масива пустая
//console.log(games[99].name) выдает ошибку которая говорит что невозможно обратиться к name внутри пустой ячейки
const games = [
    {
        id : 1,
        name : "Cyberpunk 2077",
        rating : 4.5,
        released : "2020-12-31",
        genres : ["RPG"],
        background_image : "styles/assets/covers/cyberpunk600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 2,
        name : "Ведьмак 3",
        rating : 5,
        released : "2015-10-23",
        genres : ["Action RPG"],
        background_image : "styles/assets/covers/witcher600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 3,
        name : "Hotline Miami 2",
        rating : 4.5,
        released : "2015-08-01",
        genres : ["Action"],
        background_image : "styles/assets/covers/hotlinemiami2600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 4,
        name : "Assassin's Creed IV: Black Flag",
        rating : 4,
        released : "2013-06-15",
        genres : ["Action Adventure"],
        background_image : "styles/assets/covers/blackflag600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 5,
        name : "Borderlands 2",
        rating : 3,
        released : "2012-03-21",
        genres : ["Action RPG"],
        background_image : "styles/assets/covers/borderlands-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 6,
        name : "Fallout 4",
        rating : 3,
        released : "2015-01-27",
        genres : ["Action RPG"],
        background_image : "styles/assets/covers/fallout600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 7,
        name : "Dying Light",
        rating : 4.5,
        released : "2015-07-24",
        genres : ["Action Adventure"],
        background_image : "styles/assets/covers/dyinglight600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 8,
        name : "Grand Theft Auto V",
        rating : 5,
        released : "2013-05-17",
        genres : ["Action Adventure"],
        background_image : "styles/assets/covers/gta600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 9,
        name : "Wolfenstein II: The New Colossus",
        alt : "Обложка игры Wolfenstein II: The New Colossus",
        rating : 4.5,
        released : "2017-05-24",
        genres : ["Action FPS"],
        background_image : "styles/assets/covers/wolfenstain600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 10,
        name : "The Elder Scrolls V: Skyrim",
        rating : 5,
        released : "2011-09-19",
        genres : ["Action RPG"],
        background_image : "styles/assets/covers/tes600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 11,
        name : "Red Dead Redemption 2",
        rating : 4,
        released : "2019-06-29",
        genres : ["Action Adventure"],
        background_image : "styles/assets/covers/rdr600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 12,
        name : "Assassin’s Creed Odyssey",
        rating : 4.5,
        released : "2018-05-11",
        genres : ["Action RPG"],
        background_image : "styles/assets/covers/odesey600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 13,
        name : "Elden Ring",
        rating : 4,
        released : "2022-10-17",
        genres : ["Action RPG"],
        background_image : "styles/assets/covers/eldenring600x900-170.jpg" ,
        platforms : ["PC"],
    },
    {
        id : 14,
        name : 'Sam & Max: <Hit "the" Road>',
        rating : 4,
        released : "1993-02-11",
        genres : ["Graphic Adventure"],
        background_image : "styles/assets/covers/SamMax-170.jpg" ,
        platforms : ["PC"],

    },
];


const names = [];
for (const game of games) {
    names.push(game.name);
}
const result = names.join(', ');
console.log(names);

const names2 = games.map(function(game2) {
    return game2.name;
});
const result2 = names2.join(', ')
console.log(names2);

