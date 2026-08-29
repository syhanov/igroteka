//console.log(games[99]) говорит о том что 99 ячейка масива пустая
//console.log(games[99].title) выдает ошибку которая говорит что невозможно обратиться к title внутри пустой ячейки
const games = [
    {
        id : 1,
        title : "Cyberpunk 2077",
        alt : "Обложка игры Cyberpunk 2077",
        rating : "4.5",
        year : "2020",
        genre : ["RGP"],
        imgSrc : "styles/assets/covers/cyberpunk600x900-170.jpg" ,
        srcSet : "styles/assets/covers/cyberpunk600x900-85.jpg 85w , styles/assets/covers/cyberpunk600x900-170.jpg 170w, styles/assets/covers/cyberpunk600x900-255.jpg 255w"
    },
    {
        id : 2,
        title : "Ведьмак 3",
        alt : "Обложка игры Ведьмак 3",
        rating : "5",
        year : "2015",
        genre : ["Action RGP"],
        imgSrc : "styles/assets/covers/witcher600x900-170.jpg" ,
        srcSet : "styles/assets/covers/witcher600x900-85.jpg 85w, styles/assets/covers/witcher600x900-170.jpg 170w, styles/assets/covers/witcher600x900-255.jpg 255w"
    },
    {
        id : 3,
        title : "Hotline Miami 2",
        alt : "Обложка игры Hotline Miami 2",
        rating : "4.5",
        year : "2015",
        genre : ["Action"],
        imgSrc : "styles/assets/covers/hotlinemiami2600x900-170.jpg" ,
        srcSet : "styles/assets/covers/hotlinemiami2600x900-85.jpg 85w, styles/assets/covers/hotlinemiami2600x900-170.jpg 170w, styles/assets/covers/hotlinemiami2600x900-255.jpg 255w"
    },
    {
        id : 4,
        title : "Assassin's Creed IV: Black Flag",
        alt : "Обложка игры Assassin's Creed IV: Black Flag",
        rating : "4",
        year : "2013",
        genre : ["Action Adventure"],
        imgSrc : "styles/assets/covers/blackflag600x900-170.jpg" ,
        srcSet : "styles/assets/covers/blackflag600x900-85.jpg 85w, styles/assets/covers/blackflag600x900-170.jpg 170w, styles/assets/covers/blackflag600x900-255.jpg 255w"  
    },
    {
        id : 5,
        title : "Borderlands 2",
        alt : "Обложка игры Borderlands 2",
        rating : "3",
        year : "2012",
        genre : ["Action RGP"],
        imgSrc : "styles/assets/covers/borderlands-170.jpg" ,
        srcSet : "styles/assets/covers/borderlands-85.jpg 85w, styles/assets/covers/borderlands-170.jpg 170w, styles/assets/covers/borderlands-255.jpg 255w" 
    },
    {
        id : 6,
        title : "Fallout 4",
        alt : "Обложка игры Fallout 4",
        rating : "3",
        year : "2015",
        genre : ["Action RGP"],
        imgSrc : "styles/assets/covers/fallout600x900-170.jpg" ,
        srcSet : "styles/assets/covers/fallout600x900-85.jpg 85w, styles/assets/covers/fallout600x900-170.jpg 170w, styles/assets/covers/fallout600x900-255.jpg 255w"
    },
    {
        id : 7,
        title : "Dying Light",
        alt : "Обложка игры Dying Light",
        rating : "4.5",
        year : "2015",
        genre : ["Action Adventure"],
        imgSrc : "styles/assets/covers/dyinglight600x900-170.jpg" ,
        srcSet : "styles/assets/covers/dyinglight600x900-85.jpg 85w, styles/assets/covers/dyinglight600x900-170.jpg 170w, styles/assets/covers/dyinglight600x900-255.jpg 255w" 
    },
    {
        id : 8,
        title : "Grand Theft Auto V",
        alt : "Обложка игры Grand Theft Auto V",
        rating : "5",
        year : "2013",
        genre : ["Action Adventure"],
        imgSrc : "styles/assets/covers/gta600x900-170.jpg" ,
        srcSet : "styles/assets/covers/gta600x900-85.jpg 85w, styles/assets/covers/gta600x900-170.jpg 170w, styles/assets/covers/gta600x900-255.jpg 255w"
    },
    {
        id : 9,
        title : "Wolfenstein II: The New Colossus",
        alt : "Обложка игры Wolfenstein II: The New Colossus",
        rating : "4.5",
        year : "2017",
        genre : ["Action FPS"],
        imgSrc : "styles/assets/covers/wolfenstain600x900-170.jpg" ,
        srcSet : "styles/assets/covers/wolfenstain600x900-85.jpg 85w, styles/assets/covers/wolfenstain600x900-170.jpg 170w, styles/assets/covers/wolfenstain600x900-255.jpg 255w"
    },
    {
        id : 10,
        title : "The Elder Scrolls V: Skyrim",
        alt : "Обложка игры The Elder Scrolls V: Skyrim",
        rating : "5",
        year : "2011",
        genre : ["Action RGP"],
        imgSrc : "styles/assets/covers/tes600x900-170.jpg" ,
        srcSet : "styles/assets/covers/tes600x900-85.jpg 85w, styles/assets/covers/tes600x900-170.jpg 170w, styles/assets/covers/tes600x900-255.jpg 255w"
    },
    {
        id : 11,
        title : "Red Dead Redemption 2",
        alt : "Обложка игры Red Dead Redemption 2",
        rating : "4",
        year : "2019",
        genre : ["Action Adventure"],
        imgSrc : "styles/assets/covers/rdr600x900-170.jpg" ,
        srcSet : "styles/assets/covers/rdr600x900-85.jpg 85w, styles/assets/covers/rdr600x900-170.jpg 170w, styles/assets/covers/rdr600x900-255.jpg 255w" 
    },
    {
        id : 12,
        title : "Assassin’s Creed Odyssey",
        alt : "Обложка игры Assassin’s Creed Odyssey",
        rating : "4.5",
        year : "2018",
        genre : ["Action RGP"],
        imgSrc : "styles/assets/covers/odesey600x900-170.jpg" ,
        srcSet : srcset="styles/assets/covers/odesey600x900-85.jpg 85w, styles/assets/covers/odesey600x900-170.jpg 170w, styles/assets/covers/odesey600x900-255.jpg 255w" 
    },
    {
        id : 13,
        title : "Elden Ring",
        alt : "Обложка игры Elden Ring",
        rating : "4",
        year : "2022",
        genre : ["Action RGP"],
        imgSrc : "styles/assets/covers/eldenring600x900-170.jpg" ,
        srcSet : "styles/assets/covers/eldenring600x900-85.jpg 85w, styles/assets/covers/eldenring600x900-170.jpg 170w, styles/assets/covers/eldenring600x900-255.jpg 255w"
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

