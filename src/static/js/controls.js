import { app } from "/js/game.js";
import { getActiveEntity } from "/js/entities.js";
// Convenience method, tracks last known mouse position by hooking onto some mouse events
const MOUSE_POSITION = {x: 0, y: 0};
let _trackMousePos = (e) => {
  MOUSE_POSITION.x = e.clientX;
  MOUSE_POSITION.y = e.clientY;
}
// mouseup and mousedown are probably unnecessary, if a big performance hit results, just remove them
["mousedown", "mousemove", "mouseup"].forEach(event_name => window.addEventListener(event_name, _trackMousePos));

class Key {
  // This class represents either a keyboard key or a mouse button
  // KeyCode finder: https://keycode.info/
  constructor(code, key_down_callback, key_up_callback, is_mouse=false){
    this.code = code;
    this.is_mouse = is_mouse
    // key_down_callback & key_up_callback should be of type: 'Utility.Callback' (see above)
    this.key_down_callback = key_down_callback != undefined ? key_down_callback.bind(null, code) : ()=>{};
    this.key_up_callback = key_up_callback != undefined ? key_up_callback.bind(null, code) : ()=>{};
    this._key_down_handler = (e) => {
      if((!this.is_mouse ? e.keyCode : e.button) == this.code){
        this.key_down_callback(e);
      }
      event.preventDefault();
    }
    this._key_up_handler = (e) => {
      if((!this.is_mouse ? e.keyCode : e.button) == this.code){
        this.key_up_callback(e);
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

/*class Camera {
  constructor(base_entity){
    this.base_entity = base_entity;
    this.offset_x = 0;
    this.offset_y = 0;
    this._running_camera_zoom_func = undefined;
  }
  updateCameraPosition(mouse_start_pos, base_entity_start_pos, e){
    let delta_pos = {x: e.clientX - mouse_start_pos.x, y: e.clientY - mouse_start_pos.y};
    this.base_entity.x = base_entity_start_pos.x + delta_pos.x;
    this.base_entity.y = base_entity_start_pos.y + delta_pos.y;
  }

  setupCameraControls(){
    // RMB Camera drag
    let rmb_cam_control = new Key(2, null, null, true);
    rmb_cam_control.setKeyUpCallback((code, e)=>{
      window.removeEventListener("mousemove", this._running_camera_zoom_func, true);
      rmb_cam_control._running_camera_zoom_func = undefined;
    });
    rmb_cam_control.setKeyDownCallback((code, e)=>{
      this._running_camera_zoom_func = this.updateCameraPosition.bind(this, {x: e.clientX, y: e.clientY}, {x: this.base_entity.x, y: this.base_entity.y});
      window.addEventListener("mousemove", this._running_camera_zoom_func, true);
    });
    // Zoom Camera
  }
}*/


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
}


export {
  initialize,
  Key,
  MOUSE_POSITION
}