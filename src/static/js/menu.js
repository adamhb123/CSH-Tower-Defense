import * as Resources from "/js/resources.js" ;
import * as Entities from "/js/entities.js";
import * as Controls from "/js/controls.js";
import * as Utility from "/js/utility.js";

function menu(stage){
  let menu_items = [];
  let game_logo = new Entities.Entity("game_logo", stage, Utility.scaleX(0.5), Utility.scaleY(0.25), Resources.getSpriteAnimations("PlaceholderGameLogo"));
  game_logo.setScale(Utility.scaleX(0.2), Utility.scaleX(0.2));
  game_logo.setAnchor(0.5, 0.5)
  game_logo.playAnimation("Default");
  game_logo.setAnimationSpeed(.5);
  let play_game_button = new Entities.Button("play_game_button", stage, Utility.scaleX(0.5), Utility.scaleY(0.5), Utility.scaleX(0.4), Utility.scaleY(0.1), Resources.getSpriteAnimations("PlaceholderButton"), null, "START GAME");
  play_game_button.setAnchor(0.5, 0.5);
  play_game_button.setScale(play_game_button.width, play_game_button.height);
  
  let load_game_button = new Entities.Button("load_game_button", stage, Utility.scaleX(0.5), Utility.scaleY(0.65), Utility.scaleX(0.4), Utility.scaleY(0.1), Resources.getSpriteAnimations("PlaceholderButton"), null, "LOAD GAME");
  load_game_button.setAnchor(0.5, 0.5);
  load_game_button.setScale(load_game_button.width, load_game_button.height);
  let visit_CSH_button = new Entities.Button("visit_CSH_button", stage, Utility.scaleX(0.5), Utility.scaleY(0.8), Utility.scaleX(0.4), Utility.scaleY(0.1), Resources.getSpriteAnimations("PlaceholderButton"), null, "VISIT CSH");
  visit_CSH_button.setAnchor(0.5, 0.5);
  visit_CSH_button.setScale(visit_CSH_button.width, visit_CSH_button.height);

  menu_items = menu_items.concat([game_logo, play_game_button, load_game_button, visit_CSH_button]);
  play_game_button.setOnClick((e)=>{
    // hide all menu_items
    menu_items.forEach(item => item.setVisible(false));
  }); 

  let mute_button = new Entities.ClickableEntity("mute_button", stage, Utility.scaleX(1), 0, Resources.getSpriteAnimations("PlaceholderMuteButton"), null);
  mute_button.setScale(Utility.scaleX(0.1), Utility.scaleX(0.1));
  mute_button.setAnchor(1, 0);
}

function buy_menu(stage){
  const DEFENDERS = [
  new Entities.DefenderInfo("a", {best_target: "a", attack: "a", blob: "a"}, Resources.getSpriteAnimations("PlaceholderDefender")),
  new Entities.DefenderInfo("b", {best_target: "b", attack: "b", blob: "b"}, Resources.getSpriteAnimations("PlaceholderDefender")),
  new Entities.DefenderInfo("c", {best_target: "c", attack: "c", blob: "c"}, Resources.getSpriteAnimations("PlaceholderDefender"))
];
  let expand_buy_menu = new Entities.ClickableEntity("PlaceholderExpandBuyMenuButton", stage, 0, Utility.scaleY(1), Resources.getSpriteAnimations("PlaceholderExpandBuyMenuButton"), null);
  let defender_buy_cards = DEFENDERS.map( (defender, index) => {
    let temp = new Entities.ClickableEntity(defender.name, expand_buy_menu, Utility.scaleX(0.05) * (index % 3) + Utility.scaleX(0.05), Utility.scaleY(0.05) * Math.floor(index % 6 / 3) + Utility.scaleY(0.05), Resources.getSpriteAnimations("PlaceholderDefender"), null);
    temp.setScaleFromWindow(0.025, 0.025);
    let defender_description_card_background = new Entities.Entity("defender_description_card_background", temp, 0, 0, Resources.getSpriteAnimations("PlaceholderCardBackground"));
    defender_description_card_background.setScaleFromWindow(0.3, 0.3);
    console.log(defender);
    let picture = new Entities.Entity("picture", defender_description_card_background, Utility.scaleX(0.05), 0, defender.animation);
    picture.setScaleFromWindow(0.2, 0.05)
    let name_card = new Entities.Button("name_card", defender_description_card_background, Utility.scaleX(0.025), Utility.scaleY(0.1), Utility.scaleX(0.1), Utility.scaleY(0.05), Resources.getSpriteAnimations("PlaceholderButton"), null, defender.name);
    let best_target_card = new Entities.Button("best_target_card", defender_description_card_background, Utility.scaleX(0.025), Utility.scaleY(0.175), Utility.scaleX(0.1), Utility.scaleY(0.05), Resources.getSpriteAnimations("PlaceholderButton"), null, defender.description.best_target);
    let ability_card = new Entities.Button("ability_card", defender_description_card_background, Utility.scaleX(0.025), Utility.scaleY(0.25), Utility.scaleX(0.1), Utility.scaleY(0.05), Resources.getSpriteAnimations("PlaceholderButton"), null, defender.description.attack);
    let description_blob = new Entities.Button("description_blob", defender_description_card_background, Utility.scaleX(0.15), Utility.scaleY(0.025), Utility.scaleX(0.125), Utility.scaleY(0.25), Resources.getSpriteAnimations("PlaceholderButton"), null, defender.description.blob);
    temp.setOnClick((e) => {
      temp.callFunctionOnChildSprites(child => child.visible = !child.visible);
    })
    temp.callFunctionOnChildSprites(child => child.visible = false);
     //show big card, not sure how i want to do this yet
    return temp;
  })
  expand_buy_menu.setScale(Utility.scaleX(0.1), Utility.scaleX(0.1));
  expand_buy_menu.setAnchor(0, 1);
  expand_buy_menu.setOnClick(e => {
    console.log(expand_buy_menu);
    
    //play expand animation 
    //this will haev a list of all of the different defender card entities
    for(let i = 1; i < expand_buy_menu.container.children.length; i++){
      expand_buy_menu.container.children[i].children[0].visible = i < 7;
      console.log(expand_buy_menu.container.children[i]);
    }
    //this function will render in the first n of them
    
  });
}

export {
  menu,
  buy_menu
}