import { app } from "/js/game.js";
import { getActiveEntity } from "/js/entities.js";

const MOUSE_DELTA = {x: 0, y: 0};
const MOUSE_POSITION = {x: 0, y: 0};

class Key {
  // This class represents either a keyboard key or a mouse button
  // KeyCode finder: https://keycode.info/
  constructor(code, key_down_callback, key_up_callback, is_mouse=false){
    this.code = code;
    this.is_mouse = is_mouse
    // key_down_callback & key_up_callback should be of type: 'Utility.Callback' (see above)
    this.key_down_callback = key_down_callback.bind(null, code);
    this.key_up_callback = key_up_callback.bind(null, code);
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
}

function initialize(){
  // Track mouse coords and delta
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
  app.ticker.add(stfBind);
  // Disable context menu
  window.addEventListener("contextmenu",e=>e.preventDefault());
  setupCameraControls();
}

function setupCameraControls(){
  let map_entity = getActiveEntity("Map");
  function updateMapPosition(map_entity){
    console.log(MOUSE_DELTA);
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
}

export {
  initialize,
  Key
}