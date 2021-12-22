import { app } from "/js/game.js";
import * as Entities from "/js/entities.js";
function MoveMapToCursor(){
  let background_entity = Entities.getActiveEntity("Background");
  console.log(background_entity);
}

export {
  MoveMapToCursor
}