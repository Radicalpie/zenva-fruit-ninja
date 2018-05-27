var FruitNinja = FruitNinja || {};

FruitNinja.LevelState = function () {
    "use strict";
    Phaser.State.call(this);
    
    this.prefab_classes = {
        "fruit_spawner": FruitNinja.FruitSpawner.prototype.constructor,
        "bomb_spawner": FruitNinja.BombSpawner.prototype.constructor,
        "background": FruitNinja.Prefab.prototype.constructor
    };
};

FruitNinja.LevelState.prototype = Object.create(Phaser.State.prototype);
FruitNinja.LevelState.prototype.constructor = FruitNinja.LevelState;

FruitNinja.LevelState.prototype.init = function (level_data) {
    "use strict";
    this.level_data = level_data;
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    // start physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;
    
    this.MINIMUM_SWIPE_LENGTH = 50;
    
    this.score = 0;
};

FruitNinja.LevelState.prototype.create = function () {
    "use strict";
    var group_name, prefab_name;
    
    // create groups
    this.groups = {};
    this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.game.add.group();
    }, this);
    
    // create prefabs
    this.prefabs = {};
    for (prefab_name in this.level_data.prefabs) {
        if (this.level_data.prefabs.hasOwnProperty(prefab_name)) {
            // create prefab
            this.create_prefab(prefab_name, this.level_data.prefabs[prefab_name]);
        }
    }
    
    // TODO: add events to check for swipe

    this.init_hud();
};

FruitNinja.LevelState.prototype.create_prefab = function (prefab_name, prefab_data) {
    "use strict";
    var prefab;
    // create object according to its type
    if (this.prefab_classes.hasOwnProperty(prefab_data.type)) {
        prefab = new this.prefab_classes[prefab_data.type](this, prefab_name, prefab_data.position, prefab_data.properties);
    }
};

// TODO: Add events for start and end swipe

// TODO Add function to check collision

FruitNinja.LevelState.prototype.init_hud = function () {
    "use strict";
    var score_position, score_style, score;
    // create score prefab
    score_position = new Phaser.Point(20, 20);
    score_style = {font: "48px Arial", fill: "#fff"};
    score = new FruitNinja.Score(this, "score", score_position, {text: "Fruits: ", style: score_style, group: "hud"});
};

FruitNinja.LevelState.prototype.game_over = function () {
    "use strict";
    this.game.state.restart(true, false, this.level_data);
};
