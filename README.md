# Проект игротека

Данный проект представляет собой субъективный рейтинг видеоигр, составленный на основе личного мнения автора и личного игрового опыта. Его цель — поделиться индивидуальными впечатлениями от различных игр, объяснить причины их расположения в рейтинге и предложить читателям личные рекомендации. Проект ориентирован на любителей видеоигр, интересующихся обзорами и мнениями других игроков.

## За развитием проекта можно следить по этой ссылке - https://syhanov.github.io/igroteka/

## Ссылка на макет сайта - https://stitch.withgoogle.com/projects/14489576858441068103

## Project assets

Обложки карточек игр являются объектами авторского права соответствующих
правообладателей. Все изображения обложек получены из официального CDN
платформы Steam (`cdn.akamai.steamstatic.com`), ассет `library_600x900.jpg`
(официальная библиотечная обложка игры, предоставляемая издателем/разработчиком
через Steamworks), и используются исключительно в демонстрационных/
образовательных целях.

### Правообладатели

| Игра / изображение | Правообладатель / источник |
|------|------------------|
| DualSens интро | Собственное изображение, сгенерировано мной |
| Assassin's Creed IV: Black Flag | Ubisoft Entertainment |
| Assassin's Creed Odyssey | Ubisoft Entertainment |
| Borderlands 2 | Gearbox Software / 2K |
| Dying Light | Techland |
| Grand Theft Auto V | Rockstar Games |
| Hotline Miami 2: Wrong Number | Dennaton Games / Devolver Digital |
| Metro: Last Light | Deep Silver (PLAION) |
| Red Dead Redemption 2 | Rockstar Games |
| The Elder Scrolls V: Skyrim | Bethesda Softworks |
| The Witcher 3: Wild Hunt | CD PROJEKT S.A. |
| Wolfenstein II: The New Colossus | Bethesda Softworks |
| Fallout 4 | Bethesda Softworks |

### Источник изображений

Все обложки игр получены из официального CDN Steam по шаблону:

https://cdn.akamai.steamstatic.com/steam/apps/{APP_ID}/library_600x900.jpg

где `{APP_ID}` — числовой идентификатор игры в Steam Store. Изображения
предоставляются платформой Valve/Steamworks на основе материалов,
загруженных издателями игр.

Изображение DualSense для интро сгенерировано мной и не относится
к изображениям, полученным со Steam.

Обложки игр являются интеллектуальной собственностью соответствующих
правообладателей и используются в проекте только для идентификации игр.
Все права на изображения принадлежат их законным владельцам.

## Нарезка изображений

Исходники обложек хранятся в `styles/assets/covers/src/`.
Все варианты сгенерированы через ImageMagick (`magick`), без ручной обработки.

### Обложки в каталоге (маленькие карточки, слот 85px)

Исходник: 600×900px (соотношение 2:3).

```bash
magick cover.jpg -resize 85x cover-85.jpg
magick cover.jpg -resize 170x cover-170.jpg
magick cover.jpg -resize 255x cover-255.jpg
```

Ширины: 85w, 170w, 255w (1x / 2x / 3x под фиксированный слот 85px).

### Featured-обложка (Elden Ring, крупная карточка)

Исходник: 1280×720px (16:9).

```bash
magick eldenring.jpg -resize 300x cover-300.jpg
magick eldenring.jpg -resize 450x cover-450.jpg
magick eldenring.jpg -resize 640x cover-640.jpg
magick eldenring.jpg -resize 830x cover-830.jpg
magick eldenring.jpg -resize 1280x cover-1280.jpg
```

Ширины: 300w, 450w, 640w, 830w, 1280w — покрывают диапазон слота от 286px
до 830px с запасом под retina-экраны (DPR 2x).

### Иллюстрация в блоке "О проекте" (DualSense)

Исходник: `dualsens.png`, 1024×1024px (квадрат).

**Обычные ширины (масштаб без кропа, для десктопа ≥1070px):**
```bash
magick dualsens.png -resize 400x dualsens-400.jpg
magick dualsens.png -resize 700x dualsens-700.jpg
magick dualsens.png -resize 932x dualsens-932.jpg
magick dualsens.png -resize 1024x dualsens-1024.jpg
```

**Горизонтальный кроп (мобильная/планшетная версия, ≤1069px)** —
вырезана центральная широкая полоса из квадратного исходника:
```bash
magick dualsens.png -gravity center -crop 1024x448+0+0 +repage dualsens-horizontal.jpg
magick dualsens-horizontal.jpg -resize 400x dualsens-h-400.jpg
magick dualsens-horizontal.jpg -resize 700x dualsens-h-700.jpg
magick dualsens-horizontal.jpg -resize 932x dualsens-h-932.jpg
magick dualsens-horizontal.jpg -resize 1024x dualsens-h-1024.jpg
```
Ширины: 400w, 700w, 932w, 1024w. Подключено через `<picture>` +
`<source media="(max-width: 1069px)">`, art-direction переключение
между горизонтальным кропом (мобайл) и полным квадратом (десктоп).