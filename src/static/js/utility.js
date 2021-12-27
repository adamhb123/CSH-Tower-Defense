import { app } from "/js/game.js";

function scaleX(percentage){
  return percentage * app.screen.width;
}

function scaleY(percentage){
  return percentage * app.screen.height;
}

export {
  scaleX, 
  scaleY
}