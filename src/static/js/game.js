import * as Resources from "/js/resources.js" ;
const app = new PIXI.Application({resizeTo: window, resizeThrottle: 250 });
function main(){
    document.body.appendChild(app.view);
    Resources.loadResources().then((exit_msg)=>{
      console.log(exit_msg);
      
    });
}

main();
export { app }