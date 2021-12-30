//Environment setup 
const canvas =  document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext('2d');    

// Basic functionaly
let ligintWeightWeapon = 10;
let heavyWeightWeapon = 30;
let difficulty = 2;
const form = document.querySelector("form");
const scoreboard = document.querySelector(".scoreBoard");

document.querySelector("input").addEventListener("click", (e) => {
 e.preventDefault();

 form.style.display = "none";
 scoreboard.style.display = "block";

 const usreValue = document.getElementById("difficulty").value;

 if(usreValue === "Easy"){
    setInterval(spawnEnemy, 2000);
    difficulty = 1;
 }
 if(usreValue === "Medium"){
    setInterval(spawnEnemy, 1400);
    difficulty = 8;
}
if(usreValue === "Hard"){
    setInterval(spawnEnemy, 1000);
    difficulty = 10;
}
if(usreValue === "Tnsane"){
    setInterval(spawnEnemy, 700);
    difficulty = 12;
}
animation();
});




playerPostion = {
    x: canvas.width/2,
    y: canvas.height/2
}


// Player class
class Player{
   constructor(x, y, radius, color){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
   }

   draw() {
    context.beginPath();
    context.arc(
            this.x,
            this.y,
            this.radius,
            Math.PI / 180 * 0,
            Math.PI / 180 * 360,
            false
        );
    context.fillStyle = this.color;
    context.fill();           
       
   }
 
}



class Weapon{
    constructor(x, y, radius, color, velocity, damage){
     this.x = x;
     this.y = y;
     this.radius = radius;
     this.color = color;
     this.velocity = velocity;
     this.damage = damage;
    }
 
    draw() {
     context.beginPath();
     context.arc(
             this.x,
             this.y,
             this.radius,
             Math.PI / 180 * 0,
             Math.PI / 180 * 360,
             false
         );
     context.fillStyle = this.color;
     context.fill();
    }
    update(){
        this.draw();
        (this.x += this.velocity.x),
        (this.y += this.velocity.y)
  
    }
 }
 
//  *************************enemy class


class Enemy{
    constructor(x, y, radius, color, velocity){
     this.x = x;
     this.y = y;
     this.radius = radius;
     this.color = color;
     this.velocity = velocity;
    }
 
    draw() {
     context.beginPath();
     context.arc(
             this.x,
             this.y,
             this.radius,
             Math.PI / 180 * 0,
             Math.PI / 180 * 360,
             false
         );
     context.fillStyle = this.color;
     context.fill();
    }
    update(){
        this.draw();
        (this.x += this.velocity.x),
        (this.y += this.velocity.y)
        
    }
 }
 
//  ************* end

//partical class


let friction = 0.98;
class Partical{
    constructor(x, y, radius, color, velocity){
     this.x = x;
     this.y = y;
     this.radius = radius;
     this.color = color;
     this.velocity = velocity;
     this.alpha = 1;
    }
 
    draw() {
     context.save();
     context.globalAlpha = this.alpha;
     context.beginPath();
     context.arc(
             this.x,
             this.y,
             this.radius,
             Math.PI / 180 * 0,
             Math.PI / 180 * 360,
             false
         );
     context.fillStyle = this.color;
     context.fill();
     context.restore();
    }
    update(){
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        (this.x += this.velocity.x),
        (this.y += this.velocity.y),
        this.alpha -= 0.01;
        
    }
 }

// ****************************************** Main logic ********************************************

// Creating Player
 const abhi =  new Player(
     playerPostion.x ,
     playerPostion.y , 15,
    'white');


const weapons = [];
const enemies = [];
const particals = [];


// function to kill enemy at any location
const spawnEnemy = () => {
    const enemySize = Math.random() * (40 - 5) + 5;
    const enemyColor = 'hsl('+Math.floor( Math.random() * 360)+', 100%, 50%)';
    let random;

    if(Math.random() < 0.5){
        random = {
            x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
            y: Math.random() * canvas.height
        };
    } else{
        random = {
            x: Math.random() * canvas.width,
            y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize
            
        };
    }
    const myAngle = Math.atan2(
       canvas.height / 2 - random.y,
       canvas.width / 2 - random.x
    )

    const velocity = {
        x:Math.cos(myAngle) * difficulty,
        y:Math.sin(myAngle) * difficulty
    }
  

    enemies.push( new Enemy(random.x, random.y, enemySize, enemyColor, velocity));
}

let animationId ;
function animation(){
    animationId = requestAnimationFrame(animation);

    context.fillStyle = 'rgba(49, 49, 49, 0.2)'

    context.fillRect(0, 0, canvas.width, canvas.height);
    abhi.draw();

    particals.forEach( (partical, particalIndex) => {
        if(partical.alpha <= 0){
            particals.splice(particalIndex, 1);
        }
        else{
            partical.update();
        }
      
    })

    weapons.forEach( (weapon, weaponIndex) => {
        weapon.update();

        if(
            weapon.x - weapon.radius < 1 ||
            weapon.y - weapon.radius < 1 ||
            weapon.x + weapon.radius > canvas.width ||
            weapon.y + weapon.radius > canvas.height
        ){
            weapons.splice(weaponIndex, 1);
        }
    });
    enemies.forEach( (enemy, enemyIndex) => {
        enemy.update();
        weapons.forEach( (weapon, weaponIndex) => {

            const distenceBetweenPlayerAndEnemy = Math.hypot(
                abhi.x - enemy.x,
                abhi.y - enemy.y
            );
        
            if(distenceBetweenPlayerAndEnemy - abhi.radius - enemy.radius < 1){
             
               cancelAnimationFrame(animationId);
             }

            const distenceBetweenWeaponAndEnemy = Math.hypot(
                weapon.x - enemy.x,
                weapon.y - enemy.y
            );

            if(distenceBetweenWeaponAndEnemy - weapon.radius -enemy.radius < 1){

              

                if(enemy.radius  > weapon.damage + 5){
                    gsap.to(enemy, {
                        radius: enemy.radius - weapon.damage,
                    });
                    setTimeout(() => {
                        weapons.splice(weaponIndex, 1);
                    }, 0);
                }
                else{
                    for(let i = 0; i < enemy.radius * 5 ; i++){   
                        particals.push( 
                            new Partical(
                                weapon.x,
                                weapon.y,
                                Math.random() * 2,
                                enemy.color,
                                {
                                    x: Math.random() - 0.5 * Math.random() * 5,
                                    y: Math.random() - 0.5 * Math.random() * 5,
                                }
                            )
                        );
                    }
    
                    setTimeout(() => {
                        enemies.splice(enemyIndex, 1);
                        weapons.splice(weaponIndex, 1);
                    }, 0); 
                }
               
            }
        });
    });
    
}

setInterval(spawnEnemy, 1000);


//Event listener for weapon light (bulats)
canvas.addEventListener("click", (e) => {

    const myAngle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2

    )

    const velocity = {
        x:Math.cos(myAngle) * 6,
        y:Math.sin(myAngle) * 6
    }
   weapons.push(
       new Weapon(
           canvas.width/2,
           canvas.height/2,
           6,
           'white',
           velocity,
           ligintWeightWeapon
       )
   );
}); 



//Event listener for weapon light (bulats)
canvas.addEventListener('contextmenu', (e) => {

    e.preventDefault();

    const myAngle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2

    )

    const velocity = {
        x:Math.cos(myAngle) * 3,
        y:Math.sin(myAngle) * 3
    }
   weapons.push(
       new Weapon(
           canvas.width/2,
           canvas.height/2,
           30,
           'cyan',
           velocity,
           heavyWeightWeapon
       )
   );
}); 


addEventListener('keypress', (e) => {
    console.log('key'+e.key);
});