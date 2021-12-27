import * as Utility from "/js/utility.js";
import * as Resources from "/js/resources.js"
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
      animations.forEach(animation => {
        this.container.addChild(new Resources.NamedAnimatedSprite(animation.name, animation.textures));
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
    callFunctionOnChildSprites(f){
      // Calls given function on all child sprites
      function recursiveInvoke(element){
        if(element.type === "Container"){
          element.children.forEach((child) => {
            recursiveInvoke(child);
          });
        }
        else{
          f(element);
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
      return retrieved_animation;
    }
    setAnchor(a, b){
      // Set all sprites' anchors to (a, b)
      this.container.children.forEach(named_sprite_animation => {
        named_sprite_animation.anchor.set(a, b);
      });
    }
    setAnimationSpeed(name, speed){
      this.getChildNamedSpriteAnimation(name).animationSpeed = speed;
    }
    setScaleFromWindow(width, height){
      this.container.children.forEach(named_sprite_animation => {
        named_sprite_animation.width = Utility.scaleX(width);
        named_sprite_animation.height = Utility.scaleY(height);
      });
    }
    setScaleFromParent(width, height){
      this.container.children.forEach(named_sprite_animation => {
        named_sprite_animation.width = this.parent.width * width;
        named_sprite_animation.height = this.parent.height * height;
      });
    }
    scaleXForChildren(percentage){
      return this.width * percentage;
    }
    scaleYForChildren(percentage){
      return this.height * percentage;
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
        named_sprite_animation.on("click", this.on_click, this);
    });
  }
  setOnClick(func){
      this.container.children.forEach(named_sprite_animation => {
          named_sprite_animation.interactive = true;
          named_sprite_animation.on("click", func, this);
      });
   }
}
class ClickableEntity extends Entity {
  constructor(name, parent, x, y, animations, on_click){
    super(name, parent, x, y, animations);
    this.on_click = on_click != null ? on_click : ()=>{};
    //should make all animations call onClick function on click
    this.container.children.forEach(named_sprite_animation => {
        named_sprite_animation.interactive = true;
        named_sprite_animation.on("click", this.on_click, this);
    });
  }
  setOnClick(func){
    this.container.children.forEach(named_sprite_animation => {
        named_sprite_animation.interactive = true;
        named_sprite_animation.on("click", func, this);
    });
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
    StationaryDefender,
    MobileDefender,
    Enemy,
    getActiveEntities,
    getActiveEntity
}//         (-0-)
// 8==D~-_ (. )(. )