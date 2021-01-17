var database ,dog
var position
var feed,add
var foodObj
var Feedtime, Lastfeed
var dogimg1, dogimg2
var foodS
var garden, washroom, bedroom
//Create variables here

function preload(){
  dogimg1 = loadImage("images/dogImg.png")
  dogimg2 = loadImage("images/dogImg1.png")
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");
  bedroom=loadImage("images/Bed Room.png");
} 

function setup() {
	createCanvas(1000, 500);
  database = firebase.database();
  console.log(database);
 
  foodObj=new Food()
  foodStock = database.ref('Food')
  foodStock.on("value", readStock)
  dog = createSprite(550,250,10,10);
  dog.addImage(dogimg1)
  dog.scale=0.2
  
  
feed = createButton("FEED DRAGO")
feed.position(500,15)
feed.mousePressed(FeedDog)
add = createButton("ADD FOOD")
add.position(400,15)
add.mousePressed(AddFood)

readState=database.ref('gameState');
readState.on("value",function(data){
  gameState=data.val();
});

fedtime= database.ref('FeedTime');
 fedtime.on("value", function(data){
   Lastfeed=data.val();
 });
}

function AddFood(){
  foodS++;
  database.ref("/").update({
    Food:foodS
  })
}

function FeedDog(){
  dog.addImage(dogimg2)
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref("/").update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
   feed.show();
   addFood.show();
   
  }
}

function draw(){
  background(46,139,87);
        foodObj.display()
 currentTime=hour();
  if(currentTime==(Lastfeed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(Lastfeed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(Lastfeed+2) && currentTime<=(Lastfeed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   
 drawSprites();
  
  

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}