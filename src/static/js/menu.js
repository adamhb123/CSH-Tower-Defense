import * as Resources from "/js/resources.js" ;
import * as Entities from "/js/entities.js";
import * as Controls from "/js/controls.js";
import * as Utility from "/js/utility.js";

function menu(stage){
  let expand_menu_button = new Entities.ClickableEntity("expand_menu_button", stage, Utility.scaleX(0.9), Utility.scaleX(0.05), Resources.getSpriteAnimations("PlaceholderExpandMenuButton"), null);
    
}

export {
  menu
}