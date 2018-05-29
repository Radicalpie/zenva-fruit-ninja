# zenva-fruit-ninja - Движение на мишката в играта

[Оригинална статия](https://gamedevacademy.org/how-to-make-a-fruit-ninja-game-in-phaser-part-1)

Какво е GitHub?
-----------

Идеята на системите за контрол на версиите (Version control system), каквато е GitHub, е да улесни работата ни като програмисти. Представете си, че работите по голям проект заедно с още 100 програмиста. Всеки работи по някаква отделна функционалност на продукта. Някой от вас прави някаква промяна по даден файл и кодът се чупи. Да се намери някаква грешка в 4000 реда код е наистина много трудно. Именно тук е силата на системите като GitHub. Подобна система ни позволява във всеки един момент да видим кой какъв код е написал, каква промяна по него е направена, да се види написания код преди направената промяна. Може да използваме GitHub дори ако разработваме сами някакъв проект. В случая аз проследявам всички промени, които съм направила чрез него. Също е доста полезен, ако имаме работещо състояние и има шанс да го счупим :) 

Какво представлява играта "Fruit Ninja"?
-----------

`"Fruit Ninja"` е игра, в която целта е да събираме точки, като разсичаме плодове на половина и се пазим от бомби. В случая е реализирана с `phaser`.
Интересните моменти на играта са следните:
* Имаме един файл, който описва играта - ако искаме да я усложним може да добавим повече от едно ниво с различно начално състояние, тоест още файлове.
* Имаме движение по екрана с мишката, което описва удар, с който искаме да разсечем плодчетата
* Трябва да можем да разберем дали сме уцелили плодче или бомба и какво ще се случи после.

Как да си подкараме играта?
-----------

Сваляме си сорс кода от GitHub:

![source](https://github.com/niWiki/zenva-fruit-ninja/blob/master/download.png)

След като го разархивираме, отваряме конзолка в папката game или work, която игра искаме да подкараме. Ако нямаме инсталиран [node http-server](https://www.npmjs.com/package/http-server#installing-globally), го инсталираме

![install](https://github.com/niWiki/zenva-fruit-ninja/blob/master/install.PNG)

и пускаме с командата:

`http-server`

В конзолата виждаме на кой адрес работи сайтът ни и го отваряме:

![run](https://github.com/niWiki/zenva-fruit-ninja/blob/master/run.PNG)

![game](https://github.com/niWiki/zenva-fruit-ninja/blob/master/game.PNG)


Какво сме написали до сега?
-----------
### Състояния на играта (Game States)
За да работи нашата игра имаме следните състояния:
* Boot State: В този момент ще заредим файла с информацията за нивото - тоест всички картинки, размери, скорости на обектите. Картинката, която ще е фон и т.н. След това ще стартираме следващото Loading State състояние.
* Loading Sate: Това състояние, както подсказва името, ще инициализира спрайтовете и спрайшитовете, за които знаем от файла, който сме прочели.
* Level State: И последното Level State, ще бъде самата игра - в него ще се случва всичко интересно.

### Level State
Основна задча е да заредим `sprites` и `prefabs`. Както знаете, `prefabs` са обекти, които разширяват спрайтовете и добавят допълнителна логика, необходима за играта ни. В нашата игра ще имаме нужда от няколко такива обекта - бомба, плодче, хвърляч на бомби и хвърляч на плодчета. Също ще ни трябва и обект, който да описва какво е да срежеш плодче или бомба. И накрая обект, за да пазим резултата си.
Тъй като бомбите и плодчетата ще имат доста общи характеристики, като например могат да бъдат разсечени, ще се появяват на екрана в произволен ред, като ще подскачат нагоре, после ще падат, докато не изчезнат. За това сме добавили пропъртитата `checkWorldBounds` и `outOfBoundsKill`. Това, че искаме те да са верни, означава, че спрайтът ще бъде разрушен щом напусне очертанията на света.

Единствената разлика между бомбите и плодчетата е, че ако разсечем плодче получаваме точка, а ако разсечем бомба умираме. За това имаме отделни методи `cut`, където това е отразено.

Хвърлячите също са доста подобни, за това също са обединени в един обект - те избират момент, в който да създадат нова бомба или плодче и го пускат в света. Тук има интересно подобряване на работата на играта - тъй като ще генерираме много плодчета и бомби с времето играта ни може да стане бавна, особено, ако я пуснем на телефон например. За това прилагаме следния трик - когато един prefab умре, тоест излезе от границите на света, ние не го унищожаве, а само зануляване скоростта му. Така следващия път, когато имаме нужда от prefab преди да създадем нов, питаме имаме ли някой занулен и ако да ползваме него. Така реално може да изглежда, че сме изстреляли 100 обекта, а те да са само 10.

### Табло с резултат
За да следим резултата си, сме добавили един обект, който да представлява табло, на което стойността да се сменя с всеки разсечен плод. Както знаете основна функция по време на играта е `update`. Тя се изпълняза във всеки момент и там можем да проверяваме условия, от които ни зависи логиката. Всеки `prefab` може да има свой собствен `update`, като в случая ще използваме този на Score prefab-a, за да записваме резултата.

Какво ще добавим ние?
-----------
### Разрешаване на движението на мишката
Първо ще разрешим интеракцията на потребителя с мишката, което става по следния начин:

```javascript
// add events to check for swipe
this.game.input.onDown.add(this.start_swipe, this);
this.game.input.onUp.add(this.end_swipe, this);
```

### Засичане на удара ни
За да изчислим какъв е ударът ни ще използваме следната стратегия:
* Когато човек натисне мишката, запазваме позицията й като начална точка:
```javascript
FruitNinja.LevelState.prototype.start_swipe = function (pointer) {
    "use strict";
    this.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);
};
```
* Когато играчът отпусне мишката ще запазим позицията й като крайна точка.
* Ако разстоянието между началната и крайната точки е по-голямо от минималното определящо удар (ние сме си го избрали), значи имаме такъв и изрисуваме една линия, за да го отбележим. За целта имаме още един обект, който просто ще изрисува тази линия.

```javascript
FruitNinja.LevelState.prototype.end_swipe = function (pointer) {
    "use strict";
    var swipe_length, cut_style, cut;
    this.end_swipe_point = new Phaser.Point(pointer.x, pointer.y);
    swipe_length = Phaser.Point.distance(this.end_swipe_point, this.start_swipe_point);
    // if the swipe length is greater than the minimum, a swipe is detected
    if (swipe_length >= this.MINIMUM_SWIPE_LENGTH) {
        // create a new line as the swipe and check for collisions
        cut_style = {line_width: 5, color: 0xE82C0C, alpha: 1}
        cut = new FruitNinja.Cut(this, "cut", {x: 0, y: 0}, {group: "cuts", start: this.start_swipe_point, end: this.end_swipe_point, duration: 0.3, style: cut_style});
        this.swipe = new Phaser.Line(this.start_swipe_point.x, this.start_swipe_point.y, this.end_swipe_point.x, this.end_swipe_point.y);
    }
};
```

Как става разсичането на плодчетата?
-----------

Остава да разберем дали сме уцелили плодче или бомба.
В метода `check_collision` ще проверяваме за пресичане между линията на удара ни и всеки от живите плодчета и бомби. За целта рисуваме правоъгълничета около обектите, които са на екрана и проверяваме дали има пресичане. Всичко това го има вградено във phaser, така че ние само го използваме.

```javascript
FruitNinja.LevelState.prototype.check_collision = function (object) {
    "use strict";
    var object_rectangle, line1, line2, line3, line4, intersection;
    // create a rectangle for the object body
    object_rectangle = new Phaser.Rectangle(object.body.x, object.body.y, object.body.width, object.body.height);
    // check for intersections with each rectangle edge
    line1 = new Phaser.Line(object_rectangle.left, object_rectangle.bottom, object_rectangle.left, object_rectangle.top);
    line2 = new Phaser.Line(object_rectangle.left, object_rectangle.top, object_rectangle.right, object_rectangle.top);
    line3 = new Phaser.Line(object_rectangle.right, object_rectangle.top, object_rectangle.right, object_rectangle.bottom);
    line4 = new Phaser.Line(object_rectangle.right, object_rectangle.bottom, object_rectangle.left, object_rectangle.bottom);
    intersection = this.swipe.intersects(line1) || this.swipe.intersects(line2) || this.swipe.intersects(line3) || this.swipe.intersects(line4);
    if (intersection) {
        // if an intersection is found, cut the object
        object.cut();
    }
};
```

За да можем да разберем по-добре как работи, може да оцветим всяко правоъгълниче и да видим какво се случва на екрана:
```javascript
var graphics=game.add.graphics(0,0);
graphics.lineStyle(10, 0xffd900, 1);
graphics.moveTo(line1.start.x,line1.start.y);//moving position of graphic if you draw mulitple lines
graphics.lineTo(line1.end.x,line1.end.y);
graphics.endFill();

graphics.lineStyle(10, 0xfff900, 1);
graphics.moveTo(line2.start.x,line2.start.y);//moving position of graphic if you draw mulitple lines
graphics.lineTo(line2.end.x,line2.end.y);
graphics.endFill();

graphics.lineStyle(10, 0xffd970, 1);
graphics.moveTo(line3.start.x,line3.start.y);//moving position of graphic if you draw mulitple lines
graphics.lineTo(line3.end.x,line3.end.y);
graphics.endFill();

graphics.lineStyle(10, 0xffd966, 1);
graphics.moveTo(line4.start.x,line4.start.y);//moving position of graphic if you draw mulitple lines
graphics.lineTo(line4.end.x,line4.end.y);
graphics.endFill();
```

Сега, като пуснем играта и може да видим как се показват правоъгълничетата. 

И накрая, ако имаме уцелен обект извикваме неговия метод `cut`, който или ни убива, или ни дава точка.

Да добавим нещо ново :)
-----------

Видяхме как можем да използваме мишката, за да "разсичаме" екрана, но с нея може да правим още нещо - може да "влачим" (drag) разни обекти по екрана. За да видим как става това във phaser, нека добавим малко трудност в играта - бутонче "dead trap". Това бутонче ще слага в центъра на екрана смъртоносен капан, който ще може да влачим с мишката и да го поставяме където искаме в света на играта. Ако, докато разсичаме насам-натам, го уцелим ще умрем. Натискайки бутончето той ще изчезне. 

За целта ще си добавим един нов спрайт:
```javascript
"dead_image": {"type": "image", "source": "assets/images/dead.png"},
```

Ще го създадем и ще кажем, че искаме да му е разрешена интеракцията с потребителя - тоест да може да се натиска. Като се натисне ще извикаме метод, който ще добави смъртоносния капан:
```javascript
var deadBtn = this.game.add.sprite(200, 15, 'dead_image');
deadBtn.scale.setTo(0.2);
deadBtn.inputEnabled = true;
deadBtn.events.onInputDown.add(this.addDead, this);
this.uiBlocked = false;
this.dead = null;
```

Тъй като капанът ще е един за цялата игра, ще си го създадем тук като нулев. Когато го добавим на екрана в метода за добавяне, няма да е вече нула и така ще знаем кога имаме на екрана капан и кога не:

```javascript
FruitNinja.LevelState.prototype.addDead = function (sprite, event){
if (!this.uiBlocked) {
  if (this.dead === null) {
    this.deadX = this.game.world.centerX;
    this.deadY = this.game.world.centerY;
    this.dead = this.game.add.sprite(this.deadX, this.deadY, 'dead_image')
    this.dead.scale.setTo(0.5);
    this.dead.inputEnabled = true;
    this.dead.input.enableDrag();
    this.dead.events.onDragStart.add(onDragStart, this);
    this.dead.events.onDragStop.add(onDragStop, this);
    }
    else {
      this.dead.destroy();
      this.dead = null;
    }
  }
}
```
Като го създаваме казваме изрично, че той може да бъде "влачен от мишката" и показваме кои методи да се изпълнят, когато започне и когато спре "влаченето":
```javascript
function onDragStart(sprite, pointer) {
  this.uiBlocked = true;
}
-
function onDragStop(sprite, pointer) {
    this.uiBlocked = false;
    this.deadX = sprite.position.x;
    this.deadY = sprite.position.y;
}
```
Виждате, че имаме една променлива, която използваме, за да разберем дали нещо се случва по екрана или не. Идеята е, че не искаме да може хем да владим капана, хем да удряме. За това, докато влаюим казваме, че екранът е блокиран и добавяме проверка за това в методите за начало и край на удара:
```javascript
    if (this.uiBlocked){
        return;
    }
```

Сега остава да проверим дали имаме пресичане на нашите удари с капана. За целта добавяме още една проверка за пресичане, този път с обект, който има размерите и координатите на нашия капан. А координатите знаем от метода, който се вика в края на влаченето, където ги запазихме.

```javascript
if (this.dead != null) {
            var that = this;
            this.check_collision(
                {"body": {"x": this.deadX, "y": this.deadY,"width": 25, "height":30}, "cut": that.game_over, "game": that.game, "level_data": that.level_data});
        }
```

Важното тук е да не забравяме, че ще се извика метод `cut`, ако имаме успешен удар, за това изплзваме вече съществуващия game_over метод.
