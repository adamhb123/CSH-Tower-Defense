import { app } from "/js/game.js";
const LOADING_TEXT = new PIXI.Text("Loading resources...",{fontFamily : 'Verdana', 
fontSize: 24, fill : 0xb0197e});

let LOADED_SPRITES = {};

class QueuedTexture{
  constructor(file, frame_rows, frame_columns){
    this.file = file;
    this.frame_rows = frame_rows;
    this.frame_columns = frame_columns;
  }
}
// ADD SPRITES HERE
const SPRITES_TO_LOAD = [
  {"CSHLogoAnimation": 
    {"Default": new QueuedTexture("assets/misc/CSHLogoANIMATION01.png", 1, 21)}
  },
  {"EHouseLogoAnimation":
    {"Default": new QueuedTexture("assets/misc/EHouseLogoANIMATION01.png", 1, 4)}
  },
  {"GenericEnemy01": 
    {"Default": new QueuedTexture("assets/entities/enemies/GenericEnemy01.png", 1, 1)}
  },
  {"Background":
    {"Default": new QueuedTexture("assets/misc/background.png", 1, 1)}
  },
  {"StartMenuButton" :
    {"Default": new QueuedTexture("assets/misc/start_menu_button.png", 1, 1)}
  }
];

class NamedAnimatedSprite extends PIXI.AnimatedSprite{
  constructor(name, textures){
    super(textures);
    this.name = name;
    this.type = "Sprite";
  }
}


function textureListFromFullSheet(sheetsprite, frame_rows, frame_columns){
  // "sheetsprite" is not a misspelling, it is intentional, as this parses from a Sprite, not a Spritesheet...maybe we should have used Typescript
  let frame_width = sheetsprite.width / frame_columns;
  let frame_height = sheetsprite.height / frame_rows;
  let textures = []
  for(let x = 0; x < frame_columns; x++){
    for(let y = 0; y < frame_rows; y++){
      textures.push(new PIXI.Texture(sheetsprite.texture, new PIXI.Rectangle(x*frame_width, y*frame_height, frame_width, frame_height)));
    }
  }
  return textures;
}

function getSpriteAnimations(name){
  console.log(name);
  console.log(LOADED_SPRITES[name]);
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
      console.log(LOADED_SPRITES);

    /*LOADED_SPRITES.CSHLogoAnimation = ("CSHLogoAnimation", new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.CSHLogoAnimation));
    LOADED_SPRITES.EHouseLogoAnimation = ("EHouseLogoAnimation", new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.EHouseLogoAnimation));
    LOADED_SPRITES.GenericEnemy01 = [new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.GenericEnemy01)];
    LOADED_SPRITES.Background = [new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.Background)];
    LOADED_SPRITES.PlaceholderMuteButton = [new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.Placeholder)];
    LOADED_SPRITES.PlaceholderCSHTowerDefenseLogo = [new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.Placeholder)];
    LOADED_SPRITES.PlaceholderButton = [new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.Placeholder)];
    LOADED_SPRITES.PlaceholderMuteButton = [new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.Placeholder)];
    LOADED_SPRITES.PlaceholderMuteButton = [new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.Placeholder)];
    LOADED_SPRITES.PlaceholderGameLogo = [new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.PlaceholderGameLogo)];
    LOADED_SPRITES.PlaceholderExpandBuyMenuButton = [new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.Placeholder)];
    LOADED_SPRITES.PlaceholderDefender = [new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.Placeholder)];
    LOADED_SPRITES.PlaceholderCardBackground = [new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.Placeholder)];
    LOADED_SPRITES.PlaceholderCardInfoBackground = [new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.Placeholder)];
    LOADED_SPRITES.PlaceholderTowerMenu = [new NamedAnimatedSprite("Default", LOADED_TEXTURE_GROUPS.Placeholder)];*/
    return "Finished loading all resources!";
}
function loadResources(resource_obj){
    LOADING_TEXT.anchor.set(0.5, 0.5);
    LOADING_TEXT.x = app.renderer.width/2;
    LOADING_TEXT.y = app.renderer.height/2;
    app.stage.addChild(LOADING_TEXT);
    return new Promise((resolve, reject)=>{
      // One day, we can make Sprite addition a one command process. For now, it's 2
      const loader = PIXI.Loader.shared;
      SPRITES_TO_LOAD.forEach(spritestl_group => {
        Object.keys(spritestl_group).forEach(group_key => {
          Object.keys(spritestl_group[group_key]).forEach(animation_key => {
            let queued_texture = spritestl_group[group_key][animation_key];
            loader.add(group_key+animation_key, queued_texture.file);
            console.log(group_key+animation_key);
          });
        });
      });
      loader.load((loader, resources) => {
          SPRITES_TO_LOAD.forEach(spritestl_group => {
            Object.keys(spritestl_group).forEach(group_key => {
              Object.keys(spritestl_group[group_key]).forEach(animation_key => {
                let queued_texture = spritestl_group[group_key][animation_key];
                if(!(group_key in LOADED_SPRITES)){
                  LOADED_SPRITES[group_key] = {};
                }
                LOADED_SPRITES[group_key][animation_key] = textureListFromFullSheet(new PIXI.Sprite(resources[group_key+animation_key].texture), queued_texture.frame_rows, queued_texture.frame_columns);
              });
            });
          });
        
      });
      loader.onProgress.add(() => onLoadingFileProgress); 
      loader.onError.add(() => reject(onLoadingFileError())); 
      loader.onLoad.add(onLoadingFile);
      loader.onComplete.add(() => resolve(onLoadingComplete())); 
    });
        // Setup dispatch signals (see functions for description)
    //});
}

export {
    NamedAnimatedSprite,
    loadResources,
    getSpriteAnimations
}