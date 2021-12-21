class DefenderPanel {
  //not sure how i want to do this
  //like im just imagining the menu would be strucutred like
  //it is in btd, where when you pull it up initially its a bunch
  //of panels with the different towers, then when you select
  //one the details about that tower shows over the panels.
  constructor(x, y, defender){
    this.x = x;
    this.y = y;
    this.defender = defender;
    
  }
  onClick(selectedTower){
    selectedTower = this.defender;
  }
}