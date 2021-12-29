import * as Utility from "/js/utility.js";
import * as Resources from "/js/resources.js";
import { app } from "/js/game.js";
  // Contains all active entities
const ACTIVE_ENTITIES = [];

function getActiveEntities(){
  return ACTIVE_ENTITIES;
}
function getActiveEntity(name){
  let requestedEntity = null;
  ACTIVE_ENTITIES.forEach(entity => {
    if(entity.name == name) {
      requestedEntity = entity;
      return;
    }
  });
  return requestedEntity;
}

class Entity {
  constructor(name, parent, x, y, animations){
    this.name = name;
    this.parent = parent;
    this.x = x;
    this.y = y;
    // ALL animations should have a "Default" entry to return to upon
    // Completion of other animations
    this.container = new PIXI.Container();
    this.container.type = "Container";
    (this.parent instanceof Entity ? this.parent.container : this.parent).addChild(this.container);
    Object.keys(animations).forEach(animation_key => {
      this.container.addChild(new Resources.NamedAnimatedSprite(animation_key, animations[animation_key]));
    });
    this.update_callbacks = {};
    ACTIVE_ENTITIES.push(this);
  }
  update(delta){
    // To be executed in the primary game loop
    this.container.children.forEach(named_sprite_animation => {
      named_sprite_animation.x = this.x;
      named_sprite_animation.y = this.y;
    });
    Object.keys(this.update_callbacks).forEach(funcname => {
      this.update_callbacks[funcname](this, delta);
    });
  }
  addUpdateCallback(name, func){
    // Adds a function to the update_callbacks list to be called in update()
    this.update_callbacks[name] = func;
  }
  removeUpdateCallback(name){
    // Removes a function from the update_callbacks list
    delete this.update_callbacks[name];
  }
  callFunctionOnChildSprites(func){
    // Calls given function on all child sprites
    function recursiveInvoke(element){
      if(element.type === "Container"){
        element.children.forEach((child) => {
          recursiveInvoke(child);
        });
      }
      else{
        func(element);
      }
    }
    this.container.children.forEach(element => {
      recursiveInvoke(element);
    });
  }
  getChildNamedSpriteAnimation(name){
    let retrieved_animation = undefined;
    this.container.children.forEach(named_sprite_animation => {
      if(name == named_sprite_animation.name){
        retrieved_animation = named_sprite_animation;
        return;
      }
    });
    return retrieved_animation;
  }
  setVisible(){
    this.callFunctionOnChildSprites(sprite_animation => sprite_animation.visible = false);
  }
  setAnchor(a, b){
    // Set all sprites' anchors to (a, b)
    this.callFunctionOnChildSprites(sprite_animation => sprite_animation.anchor.set(a,b));
  }
  setAnimationSpeed(speed){
    this.callFunctionOnChildSprites(sprite_animation => sprite_animation.animationSpeed = speed);
  }
  setScaleFromWindow(width, height){
    this.container.children.forEach(named_sprite_animation => {
      named_sprite_animation.width = Utility.scaleX(width);
      named_sprite_animation.height = Utility.scaleY(height);
    });
  }
  setScale(width, height){
    this.callFunctionOnChildSprites(sprite_animation => {
      sprite_animation.width = width;
      sprite_animation.height = height;
    });
  }
  playAnimation(name, loop=true, delete_on_complete=true){
    // May need to rethink some choices here
    // Update position prior to playing
    let animation = this.getChildNamedSpriteAnimation(name);
    animation.loop = loop;
    animation.onComplete = () => {
      // Remove this animation, then return to default, unless it is already default OR delete_on_complete is false
      if(name != "Default" || !delete_on_complete){
        animation.stop();
        animation.visible = false;
        // Return to default
        let default_animation = this.getChildNamedSpriteAnimation("Default");
        default_animation.play();
        default_animation.visible = true;
      }
    }
    animation.visible = true;
    animation.play();
  }
}
class MobileEntity extends Entity {
  constructor(name, parent, x, y, animations, x_velocity, y_velocity){
    super(name, parent, x, y, animations);
    this.x_velocity = x_velocity;
    this.y_velocity = y_velocity;
  }
  update(delta){
    super.update(delta);
    // To be executed in the primary game loop
    this.x += this.x_velocity * delta;
    this.y += this.y_velocity * delta;
  }
}
class MobileClickableEntity extends MobileEntity {
  constructor(name, parent, x, y, animations, x_velocity, y_velocity,  on_click){
    super(name, parent, x, y, animations, x_velocity, y_velocity);
    this.on_click = on_click;
    //should make all animations call onClick function on click
    this.container.children.forEach(named_sprite_animation => {
      named_sprite_animation.interactive = true;
      named_sprite_animation.on("pointertap", this.on_click, this);
    });
  }
  setOnClick(func){
    this.container.children.forEach(named_sprite_animation => {
      named_sprite_animation.interactive = true;
      named_sprite_animation.on("pointertap", func, this);
    });
   }
}
class ClickableEntity extends Entity {
  constructor(name, parent, x, y, animations, on_click, draggable=false){
    super(name, parent, x, y, animations);
    this.on_click = on_click != null ? on_click : ()=>{};
    //should make all animations call onClick function on click
    this.mouse_down = false;
    // theres probably gonna be a funcion called while an element is dragged,
    // like whether or not the placement for the tower is valid or whatever.
    this.drag_callback = () => {};
    this.mouseX = -1;
    this.mouseY = -1;
    this.timestamp = -1;
    this.mouse_down_duration = -1;
    this.container.children.forEach(named_sprite_animation => {
      named_sprite_animation.interactive = true;
      named_sprite_animation.on("pointertap", () => {
        if(this.mouse_down_duration < 100){ 
          this.on_click();
          this.mouse_down = false;
        }else{
          this.call_on_click_function = true;
        }
      }, this);
      if(draggable){
        named_sprite_animation.on("pointerup", () => {
          this.mouse_down_duration = Date.now() - this.timestamp;
          this.mouse_down = false;
          this.mouseX = -1;
          this.mouseY = -1;
        });
        named_sprite_animation.on("pointerdown", (e) => {
          this.timestamp = Date.now();
          this.mouse_down = true;
          this.mouseX = e.data.global.x;
          this.mouseY = e.data.global.y;
        });
        named_sprite_animation.on("pointermove", (e) => {
          if(this.mouse_down){
            this.x += (e.data.global.x - this.mouseX);
            this.y += (e.data.global.y - this.mouseY);
            this.mouseX = e.data.global.x;
            this.mouseY = e.data.global.y; 
          }
        });
      }
    });
    if(draggable){
      this.addUpdateCallback("dragFunctionCall", () => {
        if(this.mouse_down){
          this.drag_callback();
        }
      });
    }
  }
  setDragCallback(func){
    this.drag_callback = func;
  }
  setOnClick(func){
    this.on_click = func;
  }
}

class Button extends ClickableEntity {
  constructor(name, parent, x, y, width, height, animations, on_click, text, draggable=false){
    super(name, parent, x, y, animations, on_click, draggable);
    this.width = width;
    this.height = height;
    let cumpump = new PIXI.TextStyle({ fontFamily: "\"Comic Sans MS\", cursive, sans-serif", fontSize: this.height / 2.5});
    this.text_sprite = new PIXI.Text(text, cumpump);
    this.text_sprite.x = x;
    this.text_sprite.y = y;
    this.text_sprite.anchor.set(0.5, 0.5);
    this.addUpdateCallback("UpdateTextPosition", ()=>{
      let global_position = this.container.children[0].getGlobalPosition();
      this.text_sprite.x = global_position.x;
      this.text_sprite.y = global_position.y;
    });
    app.stage.addChild(this.text_sprite);
  }
  updateText(text){
    // If you don't want to update a property, just leave null or undefined
    if(text != undefined) this.text_sprite.text;
    this.text_sprite.updateText();
  }
}
class StationaryDefender extends Entity {
  constructor(name, parent, x, y, animations, description , price, ability) {
    super(name, parent, x, y, animations);
    this.description = description;
    this.price = price;
    this.ability = ability;
    this.owned = false;
  }
}
class DefenderInfo {
  constructor(name, description, animation){
    this.name = name;
    this.description = description;
    this.animation = animation;
  }
}
class MobileDefender extends MobileEntity {
  constructor(name, parent, x, y, animations, x_velocity, y_velocity, description, price, ability) {
    super(name, parent, x, y, animations, x_velocity, y_velocity);
    this.description = description;
    this.price = price;
    this.ability = ability;
    this.owned = false;
  }
}
class Enemy extends MobileEntity {
  constructor(name, parent, x, y, animations, x_velocity, y_velocity, health, ability) {
    super(name, parent, x, y, animations, x_velocity, y_velocity);
    this.health = health;
    this.ability = ability;
  }
}
export {
  Entity,
  MobileEntity,
  ClickableEntity,
  MobileClickableEntity,
  Button,
  StationaryDefender,
  MobileDefender,
  DefenderInfo,
  Enemy,
  getActiveEntities,
  getActiveEntity
}//         (-0-)
// 8==D~-_ (. )(. )