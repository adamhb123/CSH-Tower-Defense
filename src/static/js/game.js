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
    CSH_logo_entity.playAnimation(app.stage, "Default");
    CSH_logo_entity.addUpdateCallback("Rotator",(delta) => {
      console.log("Callback");
      CSH_logo_entity.x = 50 * Math.cos(delta);
      CSH_logo_entity.y = 50 * Math.sin(delta);
    });
    // Boot it up
    app.ticker.add(game_loop);
  });
}

function main(){
    initialize();
}

main();
export { app }