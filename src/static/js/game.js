function main(){
    const app = new PIXI.Application({resizeTo: window, resizeThrottle: 250 });
    document.body.appendChild(app.view);
    let sprite = PIXI.Sprite.from("/assets/entities/enemies/GenericEnemy01.png");
    app.stage.addChild(sprite);
}

main();