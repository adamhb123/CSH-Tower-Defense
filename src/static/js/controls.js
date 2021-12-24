import { app } from "/js/game.js";
import { getActiveEntity } from "/js/entities.js";

class Key {
  // This class represents either a keyboard key or a mouse button
  // KeyCode finder: https://keycode.info/
  constructor(code, key_down_callback, key_up_callback, is_mouse=false){
    this.code = code;
    this.is_mouse = is_mouse
    // key_down_callback & key_up_callback should be of type: 'Utility.Callback' (see above)
    this.key_down_callback = key_down_callback != undefined ? key_down_callback.bind(null, code) : ()=>{};
    this.key_up_callback = key_up_callback != undefined ? key_up_callback.bind(null, code) : ()=>{};
    this._key_down_handler = (event) => {
      if((!this.is_mouse ? event.keyCode : event.button) == this.code){
        this.key_down_callback();
      }
      event.preventDefault();
    }
    this._key_up_handler = (event) => {
      if((!this.is_mouse ? event.keyCode : event.button) == this.code){
        this.key_up_callback();
      }
      event.preventDefault();
    }
    window.addEventListener(!this.is_mouse ? "keydown" : "mousedown", this._key_down_handler, false);
    window.addEventListener(!this.is_mouse ? "keyup" : "mouseup", this._key_up_handler, false);
  }
  setKeyDownCallback(func){
    this.key_down_callback = func.bind(null, this.code);
  }
  setKeyUpCallback(func){
    this.key_up_callback = func.bind(null, this.code);
  }
}
/*
Camera v2 idea:
Attach to the mousemove event on right click, detach on right unclick
get start mouse pos on right click
map pos = difference between current in mousemove event and start mouse pos
*/

function updateCameraPosition(map_entity, mouse_start_x, mouse_start_y, e){
  map_entity.x = e.clientX - mouse_start_x;
  map_entity.y = e.clientY - mouse_start.y;
}

function setupCameraControls(){
  let map_entity = getActiveEntity("Map");
  let rmb_cam_control = new Key(2);
  rmb_cam_control.setKeyUpCallback((code, e)=>{
    window.addEventListener("mousemove", updateCameraPosition.bind(null, map_entity, e.clientX,e.clientY), true);
  });
  rmb_cam_control.setKeyDownCallback((code, e)=>{
    window.removeEventListener("mousemove", updateCameraPosition.bind(null, map_entity, e.clientX, e.clientY), true);
  });
}

/*
function setupCameraControls(){
  let map_entity = getActiveEntity("Map");
  function updateMapPosition(map_entity){
    map_entity.x += MOUSE_DELTA.x;
    map_entity.y += MOUSE_DELTA.y;
  }
  let enable_camera_movement = () => {
    map_entity.addUpdateCallback("updateMapPosition", updateMapPosition);
  }
  let disable_camera_movement = () => {
    MOUSE_DELTA.x = 0;
    MOUSE_DELTA.y = 0;
    map_entity.removeUpdateCallback("updateMapPosition");
  }
  // Right mouse button enables camera movement
  let rmb_cam_control = new Key(2, enable_camera_movement, disable_camera_movement, true);
}*/

function initialize(){
  // Track mouse coords and delta
  /*
  let stopTimer = {timer: 1.0, running: true};
  window.addEventListener("mousemove", (e)=>{
      MOUSE_DELTA.x = e.clientX - MOUSE_POSITION.x;
      MOUSE_DELTA.y = e.clientY - MOUSE_POSITION.y;
      MOUSE_POSITION.x = e.clientX;
      MOUSE_POSITION.y = e.clientY;
      stopTimer.timer = 1.0;
      stopTimer.running = true;
  });
  let stopTimingFunction = (stopTimer, delta) =>{
    if(stopTimer.running){
      stopTimer.timer -= .15*delta;
      if(stopTimer.timer <= 0){
        MOUSE_DELTA.x = 0;
        MOUSE_DELTA.y = 0;
        stopTimer.running = false;
      }
    }
  }
  let stfBind = stopTimingFunction.bind(null, stopTimer)
  app.ticker.add(stfBind);*/
  // Disable context menu
  window.addEventListener("contextmenu",e=>e.preventDefault());
  setupCameraControls();
}


export {
  initialize,
  Key
}