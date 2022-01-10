import * as Utility from "/js/utility.js";
import * as Resources from "/js/resources.js";
import { app, ACTIVE_ENEMIES_LIST, ACTIVE_SPLASH_PROJECTILES_LIST, LIVES} from "/js/game.js";
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
    this.animations = animations;
    Object.keys(animations).forEach(animation_key => {
      this.container.addChild(new Resources.NamedAnimatedSprite(animation_key, animations[animation_key]));
    });
    this.update_callbacks = {};
    this.playAnimation("Default");
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
  destroy(){
    ACTIVE_ENTITIES.forEach((i, idx) => {
      if(this == i) {
        ACTIVE_ENTITIES.splice(idx, 1);
        return;
      }
    });
    if(this.parent instanceof PIXI.Container){
      this.parent.removeChild(this.container);
    }else{
      this.parent.container.removeChild(this.container);
    }
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
    return retrieved_animation == undefined ? null : retrieved_animation;
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
  addBMText(text, font_size, relative_x, relative_y, offset_x, offset_y){
    PIXI.BitmapFont.from("comic", {
      fill: "#ffffff", // White, will be colored later
      fontFamily: "Comic Sans MS",
      fontSize: font_size
    });
    this.text = text;
    let size = this.getSizeOfDefaultAnimation();
    let anch = this.getChildNamedSpriteAnimation("Default").anchor;
    this.text_sprite = new PIXI.BitmapText(this.text,
    {
        fontName: "comic",
        fontSize: font_size,
        tint: 0x000000 
    });
    this.text_sprite.x = relative_x * size.width - (anch.x * size.width) + offset_x;
    this.text_sprite.y = relative_y * size.height - (anch.y * size.height) + offset_y;
    this.text_sprite.scale.x = 4;
    this.text_sprite.scale.y = 4;
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
    let text_style = new PIXI.TextStyle({ fontFamily: "\"Verdana\", cursive, sans-serif", fontSize: font_size});
    this.text_sprite = new PIXI.Text(text, text_style);
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
    // Stop all other animations, and make them invisible
    this.container.children.forEach(named_sprite_animation => {
      if(name != named_sprite_animation.name){
        named_sprite_animation.stop();
        named_sprite_animation.visible = false;
      }
    });
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
    this.x += this.x_velocity instanceof Function ? this.x_velocity() : this.x_velocity * delta;
    this.y += this.y_velocity instanceof Function ? this.y_velocity() : this.y_velocity * delta;
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
    this.last_attack = Date.now();
    this.addUpdateCallback("attack", () => {
      if(ACTIVE_ENEMIES_LIST.length > 0){
        if(this.attack_info.type == "Precision"){
          if(Date.now() - this.last_attack > this.attack_info.frequency){
            this.sendPrecisionAttack(null);
            this.last_attack = Date.now();
          }
        }else if(this.attack_info.type == "Splash"){
          if(Date.now() - this.last_attack > this.attack_info.frequency){
            this.sendSplashAttack(null);
            this.last_attack = Date.now();
          }
        }
      }
    })
  }
  sendPrecisionAttack(targeting){
    //this.playAnimation("Attack"); 
    let projectile = new Projectile("projectile", this, 0, 0, Resources.getSpriteAnimations("RedCircle"), () => ACTIVE_ENEMIES_LIST.length == 0 ? null : ACTIVE_ENEMIES_LIST[0], {type: "Precision", speed: 2, damage: this.attack_info.damage});
  }
  sendSplashAttack(targeting){
    let projectile = new Projectile("projectile", this, 0, 0, Resources.getSpriteAnimations("RedCircle"), () => ACTIVE_ENEMIES_LIST.length == 0 ? null : ACTIVE_ENEMIES_LIST[0], {type: "Splash", speed: 2, duration: 5000, radius: 25, damage: this.attack_info.damage})
  }
}
class Projectile extends MobileEntity {
  constructor(name, parent, x, y, animations, findTarget, attack_info, speed=2){
    super(name, parent, x, y, animations, 0, 0);
    this.setScale(Utility.scaleX(0.02), Utility.scaleX(0.02));
    this.attack_info = attack_info;
    this.findTarget = findTarget;
    this.target = findTarget();
    this.time_activated = -1;
    
    this.addUpdateCallback("checkIfInBounds", () => {
      if(this.getGlobalX() > Utility.scaleX(1) || this.getGlobalY() > Utility.scaleY(1) || this.getGlobalX() < 0 || this.getGlobalY() < 0){
        this.destroy();
      }
    });
    this.addUpdateCallback("updateTarget", () => {
      if(this.target != this.findTarget()){
        this.target = this.findTarget();
      }
    });
    this.addUpdateCallback("updateVelocity", () => {
      if(this.target != null){
        let delta_x = this.target.x - this.getGlobalX();
        let delta_y = this.target.y - this.getGlobalY();
        this.x_velocity = this.attack_info.speed * delta_x / Math.sqrt(delta_x ** 2 + delta_y ** 2);
        this.y_velocity = this.attack_info.speed * delta_y / Math.sqrt(delta_x ** 2 + delta_y ** 2);
        //scuffed but will work for now
      }
    });
    this.addUpdateCallback("checkIfHitTarget", () => {
      if(this.target != null){
        if(Utility.distance(this.getGlobalX(), this.getGlobalY(), this.target.x, this.target.y) < 5){
          if(this.attack_info.type == "Precision"){
            this.target.health -= this.parent.attack_info.damage;
            this.destroy();
            if(this.target.health <= 0) this.target.destroy();
          }else if(this.attack_info.type == "Splash"){
            //play splash animation
            this.x_velocity = 0;
            this.y_velocity = 0;
            this.removeUpdateCallback("updateVelocity");
            this.removeUpdateCallback("checkIfInBounds");
            this.removeUpdateCallback("updateTarget");
            this.index = ACTIVE_SPLASH_PROJECTILES_LIST.length;
            ACTIVE_SPLASH_PROJECTILES_LIST.push(this);
            this.time_activated = Date.now();
            this.addUpdateCallback("checkIfTimeToDestroy", () => {
              if(Date.now() - this.attack_info.duration > this.time_activated){
                ACTIVE_SPLASH_PROJECTILES_LIST.forEach((i, idx) => {
                  if(idx > this.index){
                    i.index++;
                  }
                })
                ACTIVE_SPLASH_PROJECTILES_LIST.splice(this.index, 1);
                this.destroy();
              }
              
            })
            this.removeUpdateCallback("checkIfHitTarget");
          }
        }
      }
    })
  }
}

class DefenderInfo {
  constructor(name, description, animations){
    this.name = name;
    this.description = description;
    this.animations = animations;
  }
}
class Enemy extends MobileEntity {
  constructor(name, parent, animations, health, on_death, spawn_point, parent_x=-1, parent_y=-1, parent_x_velocity=-1, parent_y_velocity=-1) {
    super(name, parent, 0, 0, animations, 0, 0);
    this.index = ACTIVE_ENEMIES_LIST.length;
    this.on_death = on_death ?? (() => {});
    this.when_to_spawn = -1;
    ACTIVE_ENEMIES_LIST.push(this);
    this.health = health;
    this.spawn_point = spawn_point;
    switch(this.spawn_point){
      case "south_side_stairs": 
        this.x = Utility.scaleX(0.1);
        this.y = Utility.scaleY(0.2);
        this.x_velocity = 1;
        this.y_velocity = 0;
      break;
      case "elevators":
        this.x = Utility.scaleX(0.1);
        this.y = Utility.scaleY(0.2);
        this.x_velocity = 1;
        this.y_velocity = 0;
      break;
      case "north_side_stairs":
        this.x = Utility.scaleX(0.1);
        this.y = Utility.scaleY(0.2);
        this.x_velocity = 1;
        this.y_velocity = 0;
      break;
      case "l_well":
        this.x = Utility.scaleX(0.9);
        this.y = Utility.scaleY(0.9);
        this.x_velocity = 0;
        this.y_velocity = -1;
      break;
      case "parent":
        this.x = parent_x;
        this.y = parent_y;
        this.x_velocity = parent_x_velocity;
        this.y_velocity = parent_y_velocity;
      break;
    }
    const SERVER_ROOM = {x: Utility.scaleX(0.9), y: Utility.scaleY(0.2)};
    this.addUpdateCallback("checkIfReachedServerRoom", () => {
      if(Utility.distance(this.x, this.y, SERVER_ROOM.x, SERVER_ROOM.y) < 5){
        LIVES.lives--;
        this.destroy();
      }
    })
    this.addUpdateCallback("checkIfBeingSplashDamaged", () => {
      ACTIVE_SPLASH_PROJECTILES_LIST.forEach(i => {
        if(Utility.distance(i.getGlobalX(), i.getGlobalY(), this.x, this.y) < i.attack_info.radius){
          this.health -= i.attack_info.damage;
          if(this.health <= 0){
            this.destroy();
          }
        }
      })
    })
    this.addUpdateCallback("onDeath", () => {
      this.on_death();
    })
  }
  destroy(){
    super.destroy();
    for(let i = this.index + 1; i < ACTIVE_ENEMIES_LIST.length; i++){
      ACTIVE_ENEMIES_LIST[i].index--;
    }
    ACTIVE_ENEMIES_LIST.splice(this.index, 1);
  }
}

export {
  Entity,
  MobileEntity,
  ClickableEntity,
  MobileClickableEntity,
  Button,
  DefenderInfo,
  Enemy,
  Defender,
  getActiveEntities,
  getActiveEntity
}//         (-0-)
// 8==D~-_ (. )(. )