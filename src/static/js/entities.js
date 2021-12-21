// Contains all active entities
const ACTIVE_ENTITIES = [];

function getActiveEntities(){
  return ACTIVE_ENTITIES;
}

class Entity {
    constructor(x, y, animations){
      this.x = x;
      this.y = y;
      // ALL animations should have a "Default" entry to return to upon
      // Completion of other animations
      this.animations = animations;
      this.update_callbacks = [];
      ACTIVE_ENTITIES.push(this);
    }
    update(delta){
      // To be executed in the primary game loop
      Object.keys(this.animations).forEach(key => {
        this.animations[key].x = this.x;
        this.animations[key].y = this.y;
      });
      Object.keys(this.update_callbacks).forEach(funcname => {
        this.update_callbacks[funcname](delta);
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
    setAnimationSpeed(name, speed){
      this.animations[name].animationSpeed = speed;
    }
    playAnimation(stage, name, loop=true, delete_on_complete=true){
      // May need to rethink some choices here
      // Update position prior to playing
      

      this.animations[name].loop = loop;
      this.animations[name].onComplete = () => {
        // Remove this animation, then return to default, unless it is already default OR delete_on_complete is false
        if(name != "Default" || !delete_on_complete){
          stage.removeChild(this.animations[name]);
          stage.addChild(this.animations["Default"])
        }
      }
      stage.addChild(this.animations[name]);
      this.animations[name].play();
    }
}
class MobileEntity extends Entity {
    constructor(x, y, animations, x_velocity, y_velocity){
      super(x, y, animations);
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
class StationaryDefender extends Entity {
    constructor(x, y, animations, name, description ,price, ability) {
      super(x, y, animations);
      this.name = name;
      this.description = description;
      this.price = price;
      this.ability = ability;
      this.owned = false;
    }
}
class MobileDefender extends MobileEntity {
    constructor(x, y, animations, x_velocity, y_velocity, name, description, price, ability) {
      super(x, y, animations, x_velocity, y_velocity);
      this.name = name;
      this.description = description;
      this.price = price;
      this.ability = ability;
      this.owned = false;
    }
}
class Enemy extends MobileEntity {
    constructor(x, y, animations, x_velocity, y_velocity, health, ability) {
      super(x, y, animations, x_velocity, y_velocity);
      this.health = health;
      this.ability = ability;
    }
}
export {
    Entity,
    MobileEntity,
    StationaryDefender,
    MobileDefender,
    Enemy,
    getActiveEntities
}//         (-0-)
// 8==D~-_ (. )(. )