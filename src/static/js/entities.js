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
    if(this.parent != null){
      (this.parent instanceof Entity ? this.parent.container : this.parent).addChild(this.container);
    }
    Object.keys(animations).forEach(animation_key => {
      this.container.addChild(new Resources.NamedAnimatedSprite(animation_key, animations[animation_key]));
    });
    this.update_callbacks = {};
    ACTIVE_ENTITIES.push(this);
  }
  getSizeOfDefaultAnimation(){
    let anim = this.getChildNamedSpriteAnimation("Default");
    return {width: anim._texture.width, height: anim._texture.height};
  }
  getGlobalX(){
    return this.parent == app.stage ? this.x : this.x + this.parent.getGlobalX();
  }
  getGlobalY(){
    return this.parent == app.stage ? this.y : this.y + this.parent.getGlobalY();
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
      if(element.type === "Container"){
        recursiveInvoke(element);
      }
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
    return retrieved_animation == undefined ? "not valid animation" : retrieved_animation;
  }
  setVisible(){
    this.callFunctionOnChildSprites(sprite_animation => sprite_animation.visible = false);
  }
  setAnchor(a, b){
    // Set all sprites' anchors to (a, b)
    this.container.children.forEach(named_sprite_animation => {
      named_sprite_animation.anchor.set(a, b);
    });
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
    this.container.children.forEach(named_sprite_animation => {
      named_sprite_animation.width = width;
      named_sprite_animation.height = height;
    });
  }
  scale(factor){
    this.callFunctionOnChildSprites(sprite_animation => {
      sprite_animation.width *= factor;
      sprite_animation.height *= factor;
    });
  }
  //this along with the updateBMText method should be used for non-constant text
  addBMText(text, font_size, relative_x, relative_y){
    PIXI.BitmapFont.from("comic", {
      fill: "#ffffff", // White, will be colored later
      fontFamily: "Comic Sans MS",
      fontSize: font_size
    });
    this.text = text;
    let size = this.getSizeOfDefaultAnimation();
    let anch = this.getChildNamedSpriteAnimation("Default").anchor;
    let cumpump = new PIXI.TextStyle({ fontFamily: "\"Comic Sans MS\", cursive, sans-serif", fontSize: font_size});
    this.text_sprite = new PIXI.BitmapText(this.text,
    {
        fontName: "comic",
        fontSize: font_size, // Making it too big or too small will look bad
        tint: 0x000000 // Here we make it red.
    });
    this.text_sprite.x = relative_x * size.width - (anch.x * size.width);
    this.text_sprite.y = relative_y * size.height - (anch.y * size.height);
    this.text_sprite.anchor.set(0.5, 0.5);
    this.addUpdateCallback("UpdateTextPosition", ()=>{
      this.text_sprite.x = relative_x * size.width - (anch.x * size.width);
      this.text_sprite.y = relative_y * size.height - (anch.y * size.height);
    });
    this.getChildNamedSpriteAnimation("Default").addChild(this.text_sprite);
  }
  updateBMText(_text){
    this.text_sprite.text = _text;
  }
  addText(text, font_size, relative_x, relative_y){
    this.text = text;
    let size = this.getSizeOfDefaultAnimation();
    let anch = this.getChildNamedSpriteAnimation("Default").anchor;
    let cumpump = new PIXI.TextStyle({ fontFamily: "\"Comic Sans MS\", cursive, sans-serif", fontSize: font_size});
    this.text_sprite = new PIXI.Text(text, cumpump);
    this.text_sprite.x = relative_x * size.width - (anch.x * size.width);
    this.text_sprite.y = relative_y * size.height - (anch.y * size.height);
    this.text_sprite.anchor.set(0.5, 0.5);
    this.addUpdateCallback("UpdateTextPositionAndText", ()=>{
      this.text_sprite.updateText(this._text);
      this.text_sprite.x = relative_x * size.width - (anch.x * size.width);
      this.text_sprite.y = relative_y * size.height - (anch.y * size.height);
    });
    this.getChildNamedSpriteAnimation("Default").addChild(this.text_sprite);
  }
  removeText(){
    this.getChildNamedSpriteAnimation("Default").removeChild(this.text_sprite);
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
    this.draggable = draggable;
    this.container.children.forEach(named_sprite_animation => {
      named_sprite_animation.interactive = true;
      named_sprite_animation.on("pointertap", () => {
        if(this.mouse_down_duration < 100){ 
          this.on_click();
          if(this.draggable){
            this.release_function();
          }
          this.mouse_down = false;
        }else{
          if(this.draggable){
            this.release_function();
          }
          this.call_on_click_function = true;
        }
      }, this);
        named_sprite_animation.on("pointerup", () => {
          if(this.draggable){
            this.mouse_down_duration = Date.now() - this.timestamp;
            this.mouse_down = false;
            this.mouseX = -1;
            this.mouseY = -1;
          }
        });
        named_sprite_animation.on("pointerdown", (e) => {
          if(this.draggable){
            this.timestamp = Date.now();
            this.mouse_down = true;
            this.mouseX = e.data.global.x;
            this.mouseY = e.data.global.y;
          }
        });
        named_sprite_animation.on("pointermove", (e) => {
          if(this.draggable){
            if(this.mouse_down){
              this.x += (e.data.global.x - this.mouseX);
              this.y += (e.data.global.y - this.mouseY);
              this.mouseX = e.data.global.x;
              this.mouseY = e.data.global.y; 
            }
          }
        });
    });
      this.addUpdateCallback("dragFunctionCall", () => {
        if(this.draggable){
          if(this.mouse_down){
            this.drag_callback();
          }
        }
      });
  }
  setDragCallback(func){
    this.drag_callback = func;
  }
  setReleaseFunction(func){
    this.release_function = func;
  }
  setOnClick(func){
    this.on_click = func;
  }
}

//this should be removed 
class Button extends ClickableEntity {
  constructor(name, parent, x, y, width, height, animations, on_click, text, draggable=false, text_size=2.5){
    //this needs to take into accouint the anchor of the button
    //or all buttons just need to have the same anchor.
    super(name, parent, x, y, animations, on_click, draggable);
    
  }
  updateText(text){
    // If you don't want to update a property, just leave null or undefined
    if(text != undefined) this.text_sprite. text;
    this.text_sprite.updateText();
  }
}
class Defender extends ClickableEntity {
  constructor(name, parent, x, y, animations, attack_info, attack_animations) {
    super(name, parent, x, y, animations, null);
    this.attack_info = attack_info;
    this.attack_animations = attack_animations;
  }
  sendPrecisionAttack(enemies){
    let attack = new MobileEntity("attack", this, this.x, this.y, this.attack_animations, 0, 0);
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