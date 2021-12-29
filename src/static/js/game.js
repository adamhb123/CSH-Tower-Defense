import * as Resources from "/js/resources.js" ;
import * as Entities from "/js/entities.js";
import * as Controls from "/js/controls.js";
import * as Utility from "/js/utility.js";
import * as Menu from "/js/menu.js";
const app = new PIXI.Application({resizeTo: window, resizeThrottle: 250 });
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
//these will be used to render in defender buy cards and defender entities

function game_loop(delta){
  // Update Entity positions
  Entities.getActiveEntities().forEach(entity => {
    entity.update(delta);
  });
}

function initialize(){
  document.body.appendChild(app.view);
  Resources.loadResources().then((exit_msg)=>{
    console.log(exit_msg);
    let Map = new Entities.ClickableEntity("Map", app.stage, 0, 0, Resources.getSpriteAnimations("Background"), null, false);
    //Map.setOnClick(e => Map.callFunctionOnChildSprites(child => child._playing ? child.stop() : child.play()));
    Map.setScaleFromWindow(1, 1);
    //r(name, parent, x, y, width, height, animations, on_click, text, draggable=false){
    //Menu.buy_menu(app.stage);
    
    // Debug / Playground
    let CSH_logo_entity = new Entities.MobileEntity("CSHLogoAnimation", Map, 50, 20, Resources.getSpriteAnimations("CSHLogoAnimation"), 0, 0);
    CSH_logo_entity.playAnimation("Default");
    let CSH_logo_entity_2 = new Entities.MobileEntity("CSHLogoAnimation2", Map, 50, 20, Resources.getSpriteAnimations("CSHLogoAnimation"), 0, 0);
    
    //r(name, parent, x, y, animations, on_click, draggable=false)
    let EHouse_logo_entity = new Entities.ClickableEntity("EHouseLogoAnimation", Map, 50, 20, Resources.getSpriteAnimations("EHouseLogoAnimation"), e => console.log("balls"), true);
    
    CSH_logo_entity.playAnimation("Default");
    CSH_logo_entity.addUpdateCallback("Rotator",(self, delta) => {
      self.x = 160 + 80 * Math.cos(.002*Date.now());
      self.y = 160 + 20 * Math.sin(.001*Date.now());
    });
   
    EHouse_logo_entity.playAnimation("Default");
    
    EHouse_logo_entity.setAnimationSpeed(.5);
    /*EHouse_logo_entity.addUpdateCallback("Rotator",(self, delta) => {
      self.x = 160 + 60 * Math.sin(.001*Date.now());
      self.y = 160 + 40 * Math.cos(.003*Date.now());
    });*/
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
  app
   
}