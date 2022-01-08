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
//holds enemy objects
const ACTIVE_ENEMIES_LIST = [];
//container placed on top of the map that has the sprites/containers of the enemy objects
const ACTIVE_ENEMIES_CONTAINER = new PIXI.Container();
function game_loop(delta){
  // Update Entity positions
  Entities.getActiveEntities().forEach(entity => {
    entity.update(delta);
  });
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
    // Debug / Playground
    let test_defender = new Entities.Defender("test_defender", Map, 100,100, Resources.getSpriteAnimations("GenericEnemy01"), {type: "PrecisionAttack", frequency: 1000, damage: 10}, null);
    let enemy = new Entities.Enemy("test_enemy", ACTIVE_ENEMIES_CONTAINER, 400,200, Resources.getSpriteAnimations("GenericEnemy01"), () => Math.sin((start - Date.now()) / 10000), 0, 1000, null, null);
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
   ACTIVE_ENEMIES_LIST,
   ACTIVE_ENEMIES_CONTAINER
}