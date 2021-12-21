class Entity {
    constructor(x, y, sprite){
      this.x = x;
      this.y = y;
      this.sprite = sprite;
    }
}
class MovingEntity extends Entity {
    constructor(x, y, sprite, xVelocity, yVelocity){
      super(x, y, sprite);
      this.xVelocity = xVelocity;
      this.yVelocity = yVelocity;
    }
}
class Defender extends Entity {
    constructor(x, y, sprite, name, price, ability) {
      super(x, y, sprite);
      this.name = name;
      this.price = price;
      this.ability = ability;
    }
}
class Enemy extends MovingEntity {
    constructor(x, y, sprite, xVelocity, yVelocity, health, ability) {
      super(x, y, sprite, xVelocity, yVelocity);
      this.health = health;
      this.ability = ability;
    }
}
export {
    Entity,
    MovingEntity,
    Defender,
    Enemy
}
// 8==D~-_