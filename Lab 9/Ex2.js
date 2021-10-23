// move around wall
roomba.move()
roomba.turnRight()
roomba.move()
roomnba.move()
roomba.turnLeft()
roomba.move()

//prommatic problems 

roomba.turnRight();
while (roomba.isFacingWall()){
    roomba.turnLeft();
}
while
roomba.move();



num_turns_to_360 = 4; // four turns to 360
roomba.turnRight();
turns=0;
while (roomba.isFacingWall()&& turns++ < num_turns_to_360){
    roomba.turnLeft();
}
roomba.move();

while(roomba.move != true){
    if (roomba.move() == false){
       roomba.turnRight();
    }
    roomba.move();
    }