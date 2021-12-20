function main(){
    const app = new PIXI.Application({
        autoResize: true,
        resolution: devicePixelRatio 
    });
    document.body.appendChild(app.view);
    let sprite = PIXI.Sprite.from("/assets/entities/enemies/GenericEnemy01.png");
    app.stage.addChild(sprite);
    // Listen for window resize events
    let resize = () => {
        // Resize the renderer
        app.renderer.resize(window.innerWidth, window.innerHeight);
        // You can use the 'screen' property as the renderer visible
        // area, this is more useful than view.width/height because
        // it handles resolution
        rect.position.set(app.screen.width, app.screen.height);
    }
    window.addEventListener('resize', resize);
    resize()
}

main();