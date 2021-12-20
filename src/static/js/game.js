const ASSETSDIR = "/assets/";
function main(){
    let app = new PIXI.Application({ width: 640, height: 360 });
    document.body.appendChild(app.view);
    let sprite = PIXI.Sprite.from(ASSETSDIR + "entities/enemies/GenericEnemy01.png");
    app.stage.addChild(sprite);
}

main();