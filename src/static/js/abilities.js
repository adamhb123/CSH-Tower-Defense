class SplashAbility extends Ability{
  constructor(sprite, damage, frequency, radius){
    super(sprite, damage, frequency);
    this.radius = radius;
  }
}
class Ability {
  constructor(sprite, damage, frequency){
    this.sprite = sprite;
    this.damage = damage;
    this.frequency = frequency;
  }
}
export {
  SplashAbility, 
  PrecisionAbility,
  LineAbility
}