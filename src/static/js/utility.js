import { app } from "/js/game.js";

function scaleX(percentage){
  return percentage * app.screen.width;
}

function scaleY(percentage){
  return percentage * app.screen.height;
}

function distance(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export {
  scaleX, 
  scaleY, 
  distance
}