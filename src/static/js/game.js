import * as Resources from "/js/resources.js" ;
import * as Entities from "/js/entities.js";
import * as Controls from "/js/controls.js";
import * as Utility from "/js/utility.js";
import * as Menu from "/js/menu.js";
const app = new PIXI.Application({resizeTo: window, resizeThrottle: 250 });
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const ACTIVE_DEFENDERS = [];
//this looks dumb but primitives dont pass by reference in js so its easier.
const MONEY = {money: "100"};
const LIVES = {lives: 100}
const ROUNDS = [[{health: 20, animations_name: "GenericEnemy01", on_death: null, spawn_point: "south_side_stairs", gap: 2000}, {health: 20, animations_name: "GenericEnemy01", on_death: null, spawn_point: "south_side_stairs", gap: 2000}]];
const TIME_BETWEEN_ROUNDS = 5000;
//holds enemy objects
const ACTIVE_ENEMIES_LIST = [];
//container placed on top of the map that has the sprites/containers of the enemy objects
const ACTIVE_ENEMIES_CONTAINER = new PIXI.Container();
const ACTIVE_SPLASH_PROJECTILES_LIST = [];
const TIME_BETWEEN_ROUNDS = 10000
function game_loop(delta){
  // Update Entity positions
  Entities.getActiveEntities().forEach(entity => {
    entity.update(delta);
  });
}
//set times to spawn
function setTimesToSpawn(){
  let timestamp = Date.now();
  ROUNDS.forEach(round => {
    round.forEach(enemy => {
      enemy.when_to_spawn = timestamp;
      timestamp += enemy.gap;
    })
    timestamp += TIME_BETWEEN_ROUNDS;
  })
}

//increment times to spawn if paused
function incrementTimesToSpawn(){
  ROUNDS.forEach(round => {
    round.forEach(enemy => {
      enemy.when_to_spawn++;
    })
  })
}



function initialize(){
  document.body.appendChild(app.view);
  Resources.loadResources().then((exit_msg)=>{
    let start = Date.now();
    console.log(exit_msg);
    let Map = new Entities.ClickableEntity("Map", app.stage, 0, 0, Resources.getSpriteAnimations("Background"), null, false);
    Map.setScaleFromWindow(1, 1);
    Map.container.addChild(ACTIVE_ENEMIES_CONTAINER);
    let buy_menu = Menu.buy_menu(app.stage)
    ROUNDS.forEach(round => {
    })
    // Debug / Playground
    let test_defender = new Entities.Defender("test_defender", Map, 100,100, Resources.getSpriteAnimations("GenericEnemy01"), {type: "Precision", frequency: 2000, damage: 10}, null);
    // End Debug
    Controls.initialize();
    // Boot it up
    app.ticker.add(game_loop);
    
  });
}

function main(){
    initialize();
}

main();

export { 
  app,
   ACTIVE_DEFENDERS, 
   MONEY,
   LIVES,
   ROUNDS,
   ACTIVE_ENEMIES_LIST,
   ACTIVE_ENEMIES_CONTAINER,
   ACTIVE_SPLASH_PROJECTILES_LIST
}