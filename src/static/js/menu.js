function showChildren(e){
  this.container.children.forEach(named_sprite_animation => {
    named_sprite_animation.visible = true;
  });
}
let ExpandMenuButton = new Entities.ClickableEntity("ExpandMenuButton", app.stage, Utility.scaleX(0.9), Utility.scaleY(0.1), Resources.getSpriteAnimations("Background"), showChildren);
ExpandMenuButton.setAnimationWidth("default", Utility.scaleX(0.05));
ExpandMenuButton.setAnimationWidth("default", Utility.scaleX(0.05));

