import { app } from "/js/game.js";
const LOADING_TEXT = new PIXI.Text("Loading resources...",{fontFamily : 'Verdana', 
fontSize: 24, fill : 0xb0197e});
const LOADED_TEXTURES = {}
const LOADED_SPRITES = {}

function textureListFromFullSheet(sheetsprite, frame_rows, frame_columns){
  // "sheetsprite" is not a misspelling, it is intentional, as this parses from a Sprite, not a Spritesheet...maybe we should have used Typescript
  let frame_width = sheetsprite.width / frame_columns;
  let frame_height = sheetsprite.height / frame_rows;
  let textures = []
  console.log(frame_rows);
  for(let x = 0; x < frame_columns; x++){
    for(let y = 0; y < frame_rows; y++){
      textures.push(new PIXI.Texture(sheetsprite.texture, new PIXI.Rectangle(x*frame_width, y*frame_height, frame_width, frame_height)));
    }
  }
  return textures;
}

function getSprite(name){
  return LOADED_SPRITES[name];
}

function onLoadingFileProgress(e){
    // Called once per loaded/errored file
    let progtxt = `Loading resources... progress: ${e.progress}`;
    LOADING_TEXT.text = progtxt;
    return progtxt;
}
function onLoadingFileError(){
    // Called once per errored file
    let errtxt = `Error loading resources!`;
    LOADING_TEXT.text = errtxt;
    return errtxt;
}
function onLoadingFile(e){
    // Called once per loaded file
    console.log(e._boundLoadResource);
}
function onLoadingComplete(e){
    // Called once when the queued resources all load
    app.stage.removeChild(LOADING_TEXT);
    // !! Convert LOADED_TEXTURES to SPRITES here !!
    LOADED_SPRITES.CSHLogoAnimation = new PIXI.AnimatedSprite(LOADED_TEXTURES.CSHLogoAnimation);
    LOADED_SPRITES.GenericEnemy01 = new PIXI.AnimatedSprite(LOADED_TEXTURES.GenericEnemy01);
    return "Finished loading all resources!";
}
function loadResources(resource_obj){
    LOADING_TEXT.anchor.set(0.5, 0.5);
    LOADING_TEXT.x = app.renderer.width/2;
    LOADING_TEXT.y = app.renderer.height/2;
    app.stage.addChild(LOADING_TEXT);
    return new Promise((resolve, reject)=>{
        const loader = PIXI.Loader.shared;
        loader
        .add("CSHLogoAnimationSpritesheet", "assets/misc/CSHLogoANIMATION01.png")
        .add("GenericEnemy01Spritesheet", "assets/entities/enemies/GenericEnemy01.png")
        .load((loader, resources) => {
          // !! Load TEXTURES here !!
          LOADED_TEXTURES.CSHLogoAnimation = textureListFromFullSheet(new PIXI.Sprite(resources.CSHLogoAnimationSpritesheet.texture), 1, 21);
          LOADED_TEXTURES.GenericEnemy01 = textureListFromFullSheet(new PIXI.Sprite(resources.GenericEnemy01Spritesheet.texture), 1, 1);
        });
        
        // Setup dispatch signals (see functions for description)
        loader.onProgress.add(() => onLoadingFileProgress); 
        loader.onError.add(() => reject(onLoadingFileError())); 
        loader.onLoad.add(onLoadingFile);
        loader.onComplete.add(() => resolve(onLoadingComplete())); 
    });
}

export {
    loadResources,
    getSprite
}