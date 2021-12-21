import * as Resources from "/js/resources.js" ;
import * as Entities from "/js/entities.js";
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
    let CSH_logo_entity = new Entities.MobileEntity(50, 20, {"Default": Resources.getSprite("CSHLogoAnimation")}, 0, 0);
    let EHouse_logo_entity = new Entities.MobileEntity(50, 20, {"Default": Resources.getSprite("EHouseLogoAnimation")}, 0, 0);
    // Debug / Playground
    CSH_logo_entity.playAnimation(app.stage, "Default");
    CSH_logo_entity.addUpdateCallback("Rotator",(self, delta) => {
      self.x = 160 + 60 * Math.cos(.001*Date.now());
      self.y = 160 + 20 * Math.sin(.003*Date.now());
    });
    EHouse_logo_entity.playAnimation(app.stage, "Default");
    EHouse_logo_entity.setAnimationSpeed("Default", .5);
    EHouse_logo_entity.addUpdateCallback("Rotator",(self, delta) => {
      self.x = 160 + 60 * Math.sin(.001*Date.now());
      self.y = 160 + 20 * Math.cos(.003*Date.now());
    });
    // End Debug
    // Boot it up
    app.ticker.add(game_loop);
  });
}

function main(){
    initialize();
}

main();
export { app }