import { Callback } from "/js/utility.js";
class Key {
  // This class represents either a keyboard key or a mouse button
  // KeyCode finder: https://keycode.info/
  constructor(code, key_down_callback, key_up_callback, is_mouse=false){
    this.code = code;
    this.is_mouse = is_mouse
    // key_down_callback & key_up_callback should be of type: 'Utility.Callback' (see above)
    this.key_down_callback = key_down_callback;
    this.key_up_callback = key_up_callback;
    this._key_down_handler = (event) => {
      if((!this.is_mouse ? event.keyCode : event.button) == this.code){
        this.key_down_callback.call();
      }
      event.preventDefault();
    }
    this._key_up_handler = (event) => {
      if((!this.is_mouse ? event.keyCode : event.button) == this.code){
        this.key_up_callback.call();
      }
      event.preventDefault();
    }
    window.addEventListener(!this.is_mouse ? "keydown" : "mousedown", this._key_down_handler, false);
    window.addEventListener(!this.is_mouse ? "keyup" : "mouseup", this._key_up_handler, false);
  }
}

function setupControls(){
  // Define all necessary controls here;
  new Key(2, Camera.MoveMapToCursor, ()=>{}, true) // Mouse right
}
export {
  setupControls
}