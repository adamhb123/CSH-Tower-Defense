import * as Resources from "/js/resources.js" ;
import * as Entities from "/js/entities.js";
import * as Camera from "/js/camera.js";
import * as Controls from "/js/controls.js";
const app = new PIXI.Application({resizeTo: window, resizeThrottle: 250 });

function game_loop(delta){
  Entities.getActiveEntities().forEach(entity => {
      entity.update(delta);
    });
}

function initialize(){
  document.body.appendChild(app.view);
  Resources.loadResources().then((exit_msg)=>{
    console.log(exit_msg);
    let Map = new Entities.ClickableEntity("Background", app.stage, 0, 0,Resources.getSpriteAnimations("Background"), e => console.log("background"));
    Map.setAnchor(0.5, 0.5);
    let CSH_logo_entity = new Entities.MobileEntity("CSHLogoAnimation", Map, 50, 20, Resources.getSpriteAnimations("CSHLogoAnimation"), 0, 0);
    let EHouse_logo_entity = new Entities.MobileClickableEntity("EHouseLogoAnimation", Map, 50, 20, Resources.getSpriteAnimations("EHouseLogoAnimation"), 0, 0, cum => console.log("balls"));
    // Debug / Playground
    Map.playAnimation("Default");
    CSH_logo_entity.playAnimation("Default");
    CSH_logo_entity.addUpdateCallback("Rotator",(self, delta) => {
      self.x = 160 + 60 * Math.cos(.02*Date.now());
      self.y = 160 + 20 * Math.sin(.01*Date.now());
    });
    EHouse_logo_entity.playAnimation("Default");
    EHouse_logo_entity.setAnimationSpeed("Default", .5);
    EHouse_logo_entity.addUpdateCallback("Rotator",(self, delta) => {
      self.x = 160 + 60 * Math.sin(.001*Date.now());
      self.y = 160 + 20 * Math.cos(.003*Date.now());
    });
    // End Debug
    // Setup controls
    Controls.setupControls();
    // Boot it up
    app.ticker.add(game_loop);
    Camera.MoveMapToCursor();

  });
}

function main(){
    initialize();
}

main();
export { app }