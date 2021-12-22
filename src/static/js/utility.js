class Callback {
  constructor(name, func){
    this.name = name;
    this._func = func;
  }
  call(){
    return this._func();
  }
}

export {
  Callback
}