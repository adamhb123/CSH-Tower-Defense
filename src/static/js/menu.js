import * as Resources from "/js/resources.js" ;
import * as Entities from "/js/entities.js";
import * as Controls from "/js/controls.js";
import * as Utility from "/js/utility.js";
import {ACTIVE_DEFENDERS, MONEY} from "/js/game.js";

function menu(stage){
  let menu_items = [];
  let game_logo = new Entities.Entity("game_logo", stage, Utility.scaleX(0.5), Utility.scaleY(0.25), Resources.getSpriteAnimations("CSHLogoAnimation"));
  game_logo.setScale(Utility.scaleX(0.2), Utility.scaleX(0.2));
  game_logo.setAnchor(0.5, 0.5)
  game_logo.playAnimation("Default");
  game_logo.setAnimationSpeed(.5);
  let play_game_button = new Entities.Button("play_game_button", stage, Utility.scaleX(0.5), Utility.scaleY(0.5), Utility.scaleX(0.4), Utility.scaleY(0.1), Resources.getSpriteAnimations("StartMenuButton"), null, "START GAME");
  play_game_button.setAnchor(0.5, 0.5);
  play_game_button.setScale(play_game_button.width, play_game_button.height);
  
  let load_game_button = new Entities.Button("load_game_button", stage, Utility.scaleX(0.5), Utility.scaleY(0.65), Utility.scaleX(0.4), Utility.scaleY(0.1), Resources.getSpriteAnimations("StartMenuButton"), null, "LOAD GAME");
  load_game_button.setAnchor(0.5, 0.5);
  load_game_button.setScale(load_game_button.width, load_game_button.height);
  let visit_CSH_button = new Entities.Button("visit_CSH_button", stage, Utility.scaleX(0.5), Utility.scaleY(0.8), Utility.scaleX(0.4), Utility.scaleY(0.1), Resources.getSpriteAnimations("StartMenuButton"), null, "VISIT CSH");
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
  let current_page = 0;
  const DEFENDERS = [
    new Entities.DefenderInfo("a", {best_target: "a", attack: "a", blob: "a", price: 10}, Resources.getSpriteAnimations("GenericEnemy01")),
    new Entities.DefenderInfo("b", {best_target: "b", attack: "b", blob: "b", price: 10}, Resources.getSpriteAnimations("GenericEnemy01")),
    new Entities.DefenderInfo("c", {best_target: "c", attack: "c", blob: "c", price: 10}, Resources.getSpriteAnimations("GenericEnemy01")),
    new Entities.DefenderInfo("d", {best_target: "d", attack: "d", blob: "d", price: 10}, Resources.getSpriteAnimations("GenericEnemy01")),
    new Entities.DefenderInfo("d", {best_target: "t", attack: "d", blob: "t", price: 10}, Resources.getSpriteAnimations("GenericEnemy01")),
    new Entities.DefenderInfo("d", {best_target: "v", attack: "d", blob: "v", price: 10}, Resources.getSpriteAnimations("GenericEnemy01")),
    new Entities.DefenderInfo("d", {best_target: "b", attack: "d", blob: "b", price: 10}, Resources.getSpriteAnimations("GenericEnemy01")),
  ];
  let show_money = new Entities.Entity("show_money", stage, Utility.scaleX(0.5), Utility.scaleY(0.7),  Resources.getSpriteAnimations("ColorBackground"));
  show_money.setScale(Utility.scaleX(0.2), Utility.scaleY(0.2));
  show_money.addBMText(MONEY.money, 100, 0.5, 0.5);
  const DEFENDER_MENU_SIZE = {x: Utility.scaleX(0.4), y: Utility.scaleY(0.5)};
  let defender_menu_button = new Entities.ClickableEntity("DefenderMenuButton", stage, 0, Utility.scaleY(1), Resources.getSpriteAnimations("DefenderMenuButton"), null);
  defender_menu_button.setScale(Utility.scaleX(0.05), Utility.scaleX(0.05));
  defender_menu_button.setAnchor(0, 1);
  let defender_menu = new Entities.Entity("defender_menu", defender_menu_button, 0, -DEFENDER_MENU_SIZE.y, Resources.getSpriteAnimations("ColorBackground"));
  defender_menu.setScale(DEFENDER_MENU_SIZE.x, DEFENDER_MENU_SIZE.y);
  defender_menu.addText("Defenders", 50, 0.5, 0.1);
  let close_menu = new Entities.ClickableEntity("close_menu", defender_menu, 7 * DEFENDER_MENU_SIZE.x / 8, 0, Resources.getSpriteAnimations("DefenderMenuButtonFlipped"), null);
  close_menu.setScale(Utility.scaleX(0.05), Utility.scaleX(0.05));
  const SHOW_CARDS_POSITION = {x: Utility.scaleX(0.163), y: Utility.scaleY(0.455)};
  const SHOW_CARDS_SIZE = {x: Utility.scaleX(0.025), y: Utility.scaleY(0.03)};
  let show_next_cards = new Entities.ClickableEntity("show_next_cards", defender_menu, SHOW_CARDS_POSITION.x + Utility.scaleX(0.05), SHOW_CARDS_POSITION.y,  Resources.getSpriteAnimations("StartMenuButton"), null);
  show_next_cards.addText(">", 30, 0.5, 0.5);
  show_next_cards.setScale(SHOW_CARDS_SIZE.x, SHOW_CARDS_SIZE.y);
  let show_prev_cards = new Entities.ClickableEntity("show_prev_cards", defender_menu, SHOW_CARDS_POSITION.x, SHOW_CARDS_POSITION.y, Resources.getSpriteAnimations("StartMenuButton"), null);
  show_prev_cards.addText("<", 30, 0.5, 0.5);
  show_prev_cards.setScale(SHOW_CARDS_SIZE.x, SHOW_CARDS_SIZE.y);
  let defender_buy_cards = DEFENDERS.map( (defender, index) => {
    const BUY_CARD_GAP_SIZE = {x: Utility.scaleX(0.096), y: Utility.scaleY(0.15)};
    const BUY_CARD_POSITION = {x: Utility.scaleX(0.104), y: Utility.scaleY(0.2)}
    const BUY_CARD_SIZE = {x: 0.075, y: 0.075};
    let buy_card = new Entities.ClickableEntity(defender.name, defender_menu, BUY_CARD_GAP_SIZE.x * (index % 3) + BUY_CARD_POSITION.x, BUY_CARD_GAP_SIZE.y * Math.floor(index % 6 / 3) + BUY_CARD_POSITION.y, defender.animation, null, true);
    buy_card.scale(1.5);
    buy_card.setAnchor(0.5, 0.5);
    buy_card.setOnClick((e) => {
      close_menu.getChildNamedSpriteAnimation("Default").visible = false;
      show_prev_cards.getChildNamedSpriteAnimation("Default").visible = false;
      show_next_cards.getChildNamedSpriteAnimation("Default").visible = false;
      let defender_page = renderPageForDefender(defender);
      defender_menu.container.addChild(defender_page.container);
      defender_buy_cards.forEach(element => {
        element.getChildNamedSpriteAnimation("Default").visible = false;
      });

    });
    function checkIfValidPlacement(x, y){
      //theres a better way to do this but
      //check if in top rectangle
      let check = true;
      ACTIVE_DEFENDERS.forEach(element => {
        check &= Utility.distance(x, y, element.x, element.y) > Utility.scaleX(0.03);
      })
      if(!check) return false;
      let x_bounds = x > Utility.scaleX(0.05) && x < Utility.scaleX(0.9);
      if(x_bounds && y < Utility.scaleY(0.2) && y > Utility.scaleY(0.05)) return true;
      //check if in lower rectangle
      if(x_bounds && y < Utility.scaleY(0.45) && y > Utility.scaleY(0.3)) return true;
      //check if in right L 
      if(x < Utility.scaleX(0.96) && x > Utility.scaleX(0.91) && y > Utility.scaleY(0.05)&& y < Utility.scaleY(0.95)) return true;
      //check if in left L 
      if(x < Utility.scaleX(0.85) && x > Utility.scaleX(0.8) && y > Utility.scaleY(0.4)&& y < Utility.scaleY(0.95)) return true;
      //check in command center
      if(x < Utility.scaleX(0.08) && x > Utility.scaleX(0.03) && y > Utility.scaleY(0.2)&& y < Utility.scaleY(0.3)) return true;
      return false;
    }
    buy_card.setReleaseFunction(() => {
      let valid_drop = checkIfValidPlacement(buy_card.getGlobalX(), buy_card.getGlobalY());
      if(valid_drop){
        let defender_entity = new Entities.ClickableEntity(defender.name, stage, buy_card.getGlobalX(), buy_card.getGlobalY(), defender.animation, buy_card.on_click);
        defender_entity.setAnchor(0.5, 0.5);
        ACTIVE_DEFENDERS.push(defender_entity);
        buy_card.draggable = false;
        buy_card.addText("BOUGHT", 20, 0.5, 0.5);
        let new_money = parseInt(MONEY.money) - defender.description.price;
        MONEY.money = new_money.toString()
        show_money.updateBMText(MONEY.money);
      }
      buy_card.x = BUY_CARD_GAP_SIZE.x * (index % 3) + BUY_CARD_POSITION.x;
      buy_card.y = BUY_CARD_GAP_SIZE.y * Math.floor(index % 6 / 3) + BUY_CARD_POSITION.y;
      green_circle.getChildNamedSpriteAnimation("Default").visible = false;
      red_circle.getChildNamedSpriteAnimation("Default").visible = false;
    })
    let green_circle = new Entities.Entity("green_circle", buy_card, 0, 0, Resources.getSpriteAnimations("GreenCircle"));
        green_circle.setAnchor(0.5, 0.5);
        green_circle.setScale(Utility.scaleX(0.1), Utility.scaleX(0.1));
        green_circle.getChildNamedSpriteAnimation("Default").alpha = 0.5;
        let red_circle = new Entities.Entity("red_circle", buy_card, 0, 0, Resources.getSpriteAnimations("RedCircle"));
        red_circle.setAnchor(0.5, 0.5);
        red_circle.setScale(Utility.scaleX(0.1), Utility.scaleX(0.1));
        red_circle.getChildNamedSpriteAnimation("Default").alpha = 0.5;
        
    buy_card.setDragCallback(() => {
      let valid_drop = checkIfValidPlacement(buy_card.getGlobalX(), buy_card.getGlobalY()); // later
      green_circle.getChildNamedSpriteAnimation("Default").visible = valid_drop;
      red_circle.getChildNamedSpriteAnimation("Default").visible = !valid_drop;
    })
    return buy_card;
  })
  function renderPageForDefender(defender){
    let background = new Entities.Entity("DefenderPageBackground", null, 0, 0, Resources.getSpriteAnimations("ColorBackground"));
    background.setScale(Utility.scaleX(0.4), Utility.scaleY(0.5));
    let anim = new Entities.Entity("anim", background, Utility.scaleX(0.09), Utility.scaleY(0.1), defender.animation);
    anim.setAnchor(0.5, 0.5);
    anim.scale(1.5);
    const CARD_POSITION = {x: Utility.scaleX(0.05), y: Utility.scaleY(0.2)};
    const CARD_SIZE = {x: Utility.scaleX(0.1), y: Utility.scaleY(0.05)};
    const CARD_GAP = Utility.scaleY(0.025);
    let name = new Entities.Entity("name", background, CARD_POSITION.x, CARD_POSITION.y, Resources.getSpriteAnimations("ColorBackground"));
    name.addText(defender.name, 100, 0.5, 0.5);
    name.setScale(CARD_SIZE.x, CARD_SIZE.y);
    let best_target = new Entities.Entity("best_target", background, CARD_POSITION.x, CARD_POSITION.y + (CARD_GAP + CARD_SIZE.y), Resources.getSpriteAnimations("ColorBackground"));
    best_target.addText(defender.description.best_target, 100, 0.5, 0.5);
    best_target.setScale(CARD_SIZE.x, CARD_SIZE.y);
    let attack_type = new Entities.Entity("attack_type", background, CARD_POSITION.x, CARD_POSITION.y + 2 * (CARD_GAP + CARD_SIZE.y), Resources.getSpriteAnimations("ColorBackground"));
    attack_type.addText(defender.description.attack, 100, 0.5, 0.5);
    attack_type.setScale(CARD_SIZE.x, CARD_SIZE.y);
    let description = new Entities.Entity("description", background, Utility.scaleX(0.18), Utility.scaleY(0.02), Resources.getSpriteAnimations("ColorBackground"));
    description.addText(defender.description.blob, 100, 0.5, 0.5);
    description.setScale(Utility.scaleX(0.2), Utility.scaleY(0.46));
    let exit_button = new Entities.ClickableEntity("exit_button", background, Utility.scaleX(0.05), Utility.scaleY(0.42), Resources.getSpriteAnimations("ColorBackground"), null);
    exit_button.setScale(CARD_SIZE.x, CARD_SIZE.y);
    exit_button.addText("GO BACK", 100, 0.5, 0.5);
    exit_button.setOnClick(e => {
      defender_menu.container.removeChild(background.container);
      close_menu.getChildNamedSpriteAnimation("Default").visible = true;
      show_prev_cards.getChildNamedSpriteAnimation("Default").visible = true;
      show_next_cards.getChildNamedSpriteAnimation("Default").visible = true;
      defender_buy_cards.forEach((element, index) => {
        element.getChildNamedSpriteAnimation("Default").visible = Math.floor(index / 6) == current_page;
      });
    })
    return background;
  }
  defender_menu_button.setOnClick(e => {
    let defender_menu_container = defender_menu_button.container.children[1].children;
    // makes background visible
    defender_menu_container[0].visible = true;
    //makes buttons visible
    close_menu.getChildNamedSpriteAnimation("Default").visible = true;
      show_prev_cards.getChildNamedSpriteAnimation("Default").visible = true;
      show_next_cards.getChildNamedSpriteAnimation("Default").visible = true;
      defender_buy_cards.forEach((element, index) => {
        element.getChildNamedSpriteAnimation("Default").visible = Math.floor(index / 6) == current_page;
      });
  });
  function change_page(forward){
    //sets all to be invisible
    defender_buy_cards.forEach((element, index) => {
        element.getChildNamedSpriteAnimation("Default").visible = false;
    });
    current_page += (forward ? 1 : -1);
    //sets desired to be visible
    defender_buy_cards.forEach((element, index) => {
        element.getChildNamedSpriteAnimation("Default").visible = Math.floor(index / 6) == current_page;
    });
  }
  show_next_cards.setOnClick(e => {
    change_page(true);
  })
  show_prev_cards.setOnClick(e => {
    change_page(false);
  })
  close_menu.setOnClick(e => {
    defender_menu_button.callFunctionOnChildSprites(child => child.visible = false);
    defender_menu_button.container.children[0].visible = true;
  })
  defender_menu_button.callFunctionOnChildSprites(child => child.visible = false);

}

export {
  menu,
  buy_menu
}