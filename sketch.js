
var dog, happyDog, database, foodS, foodStock
var dogHungry, dogHappy;

var feed, addFood;
var fedTime, lastFed;
var foodObj;

function preload()
{
  dogHungry = loadImage("images/dogImg.png")
  dogHappy = loadImage("images/dogImg1.png")
}

function setup() {
  createCanvas(500, 500);
  database = firebase.database();
  dog = createSprite(250,400,50,50);
  dog.addImage(dogHungry);
  dog.scale = 0.20;
  
  foodObj = new Food();
  
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  
  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
background(46, 139, 87);
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed: " + lastFed%12 + "PM", 350,30);
  } else if(lastFed==0){
     text("Last Fed: 12AM", 350,30);
  } else{
     text("Last Feed: " + lastFed + "AM", 350,30);
  }
  foodObj.display();
  drawSprites();
  textSize(20);
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS); 
}

function writeStock(x){

  if(x<=0){
    x=0;
  } else{
    x = x - 1;
  }

  database.ref('/').update({
    Food:x
  });
}

function feedDog(){
  dog.addImage(dogHappy);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}


