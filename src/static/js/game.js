import * as Resources from "/js/resources.js" ;
import * as Entities from "/js/entities.js";
import * as Controls from "/js/controls.js";
import * as Utility from "/js/utility.js";
const app = new PIXI.Application({resizeTo: window, resizeThrottle: 250 });

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
    let Map = new Entities.ClickableEntity("Map", app.stage, 0, 0,Resources.getSpriteAnimations("Background"),null);
    Map.setOnClick(e => Map.callFunctionOnChildSprites(child => child._playing ? child.stop() : child.play()));
    

    // Debug / Playground
    
    let expand_menu_button = new Entities.ClickableEntity("expand_menu_button", app.stage, Utility.scaleX(0.85), Utility.scaleX(0.05), Resources.getSpriteAnimations("PlaceholderExpandMenuButton"), null);
    expand_menu_button.setOnClick(e => expand_menu_button.callFunctionOnChildSprites(child => child.visible = true));
    expand_menu_button.setScaleFromWindow(0.1, 0.1)
    
    let menu_background = new Entities.Entity("menu_background", expand_menu_button, -Utility.scaleX(0.05), -Utility.scaleX(0.05), Resources.getSpriteAnimations("PlaceholderMenuBackground"));
    menu_background.setScaleFromWindow(0.2, 1);
    expand_menu_button.callFunctionOnChildSprites(child => child.visible = false);
    let kill_menu_button = new Entities.ClickableEntity("kill_menu_button", menu_background, Utility.scaleX(0.85), Utility.scaleX(0.05), Resources.getSpriteAnimations("PlaceholderKillMenuButton"), null);
    kill_menu_button.setScaleFromWindow(0.1, 0.1);
    kill_menu_button.setOnClick(e => expand_menu_button.callFunctionOnChildSprites(child => child.visible = false));
    /*
    let toggle_buy_menu = new Entities.ClickableEntity("toggle_buy_menu", menu_background, menu_background.scaleXForChildren(0.2), menu_background.scaleYForChildren(0.2), Resources.getSpriteAnimations("PlaceholderToggleBuyMenu"), null);
    toggle_buy_menu.setScaleFromParent(0.2, 0.05);
    let toggle_tower_menu = new Entities.ClickableEntity("toggle_tower_menu", menu_background, menu_background.scaleXForChildren(0.6), menu_background.scaleYForChildren(0.2), Resources.getSpriteAnimations("PlaceholderToggleTowerMenu"), null);
    toggle_tower_menu.setScaleFromParent(0.2, 0.05);
    let defenders = [];
    for(let i = 1; i <= 6; i++)
      defenders.push(new Entities.ClickableEntity("PlaceholderDefender" + i, toggle_buy_menu, menu_background.scaleXForChildren(0.2 * (1 + i % 2)), menu_background.scaleYForChildren(0.2 * (1 + i % 3)), Resources.getSpriteAnimations("PlaceholderDefender" + i), null));
      defenders[i - 1].setScaleFromWindow(0.1, 0.05);
    let tower_menu = new Entities.ClickableEntity("tower_menu", toggle_tower_menu, menu_background.scaleXForChildren(0.1), menu_background.scaleYForChildren(0.2), Resources.getSpriteAnimations("PlaceholderTowerMenu"), null);
    tower_menu.setScaleFromWindow(0.1, 0.6);
    */
    let CSH_logo_entity = new Entities.MobileEntity("CSHLogoAnimation", Map, 50, 20, Resources.getSpriteAnimations("CSHLogoAnimation"), 0, 0);
    let CSH_logo_entity_2 = new Entities.MobileEntity("CSHLogoAnimation2", Map, 50, 20, Resources.getSpriteAnimations("CSHLogoAnimation"), 0, 0);
    let EHouse_logo_entity = new Entities.MobileClickableEntity("EHouseLogoAnimation", Map, 50, 20, Resources.getSpriteAnimations("EHouseLogoAnimation"), 0, 0, e => console.log("balls"));
    Map.playAnimation("Default");
    CSH_logo_entity.playAnimation("Default");
    CSH_logo_entity.addUpdateCallback("Rotator",(self, delta) => {
      self.x = 160 + 80 * Math.cos(.002*Date.now());
      self.y = 160 + 20 * Math.sin(.001*Date.now());
    });
    EHouse_logo_entity.playAnimation("Default");
    EHouse_logo_entity.setAnimationSpeed("Default", .5);
    EHouse_logo_entity.addUpdateCallback("Rotator",(self, delta) => {
      self.x = 160 + 60 * Math.sin(.001*Date.now());
      self.y = 160 + 40 * Math.cos(.003*Date.now());
    });
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
export { app }