// Importing Sound Effects
const introMusic = new Audio("./music/Monkeys-Spinning-Monkeys.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3");

let flag = true;

introMusic.play();
 const introWindow = document.querySelector(".intro-window");
 const form = document.querySelector("form");
 const gotBtn = document.querySelector(".got-it-btn");


 gotBtn.onclick  = () => {
    
   introWindow.style.display  = "none";
   form.style.visibility = "visible";

 }

//Environment setup 
const canvas =  document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext('2d');    

// Basic functionaly
let ligintWeightWeapon = 10;
let heavyWeightWeapon = 30;
let hugeWeightWeapon = 50;
let difficulty = 2;
let playerScore = 0 ;

const scoreboard = document.querySelector(".scoreBoard");

document.querySelector("input").addEventListener("click", (e) => {

    flag = false;
 e.preventDefault();
 introMusic.pause();
 form.style.display = "none";
 scoreboard.style.display = "block";

 const usreValue = document.getElementById("difficulty").value;

 if(usreValue === "Easy"){
    setInterval(spawnEnemy, 3000);
    difficulty = 1;
 }
 if(usreValue === "Medium"){
    setInterval(spawnEnemy, 200);
    difficulty = 2;
}
if(usreValue === "Hard"){
    setInterval(spawnEnemy, 2000);
    difficulty = 3;
}
if(usreValue === "Tnsane"){
    setInterval(spawnEnemy, 1000);
    difficulty = 4;
}
animation();
});


const gameoverLoader = () => {
  const gameoverBanner = document.createElement("div");
  const gameoverButton = document.createElement("button");
  const highscore = document.createElement("div");


  let playerhighscore =  localStorage.getItem("highscore") ? localStorage.getItem("highscore") : playerScore ;
  gameoverButton.innerText = "Play game again";
  highscore.innerHTML = "High score:  " + (playerhighscore > playerScore ? playerhighscore : playerScore) ;
  gameoverBanner.appendChild(highscore);
  gameoverBanner.appendChild(gameoverButton);

  if( playerScore >= playerhighscore ){
      localStorage.setItem("highscore", playerScore);
  }


  gameoverButton.onclick = () => {
     window.location.reload();
  };

  gameoverBanner.classList.add("gameover");
  document.querySelector("body").appendChild(gameoverBanner);

}


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
    let img  = document.createElement('img');
      img.src = "./gun.png"; 
      img.style.width = "40px";
      img.style.height = "40px";

      context.drawImage(img, this.x - 30, this.y - 30);
     
    context.beginPath();
           
       
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
 
 
class HugeWeapon{
    constructor(x, y, damage){
     this.x = x;
     this.y = y;
     this.color =  'pink';
     this.damage = damage;
    }
 
    draw() {
     context.beginPath();
     context.fillStyle = this.color;
     context.fillRect(this.x, this.y, 100, canvas.height) 
     context.fill();
    }
    update(){
        this.draw();
        (this.x += 10)
  
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
const hugeweapons = [];
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
    
    if( flag == false){ abhi.draw(); }
  

    hugeweapons.forEach( (hugeweapon, hugeweaponIndex) => {
        if(hugeweapon.alpha <= 0){
            hugeweapons.splice(particalIndex, 1);
        }
        else{
            hugeweapon.update();
        }
    });
    
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

        if(flag == true) return;

        hugeweapons.forEach(hugeweapon => {
            const  distenceBetweenHugeWeaponAndEnemy = hugeweapon.x - enemy.x;
            if(distenceBetweenHugeWeaponAndEnemy <= 200 &&  distenceBetweenHugeWeaponAndEnemy >= -200){
                playerScore += 10;
                scoreboard.innerHTML = "Score:" + playerScore;
                setTimeout(() => {
                    killEnemySound.play();
                    enemies.splice(enemyIndex, 1);
                   
                }, 0); 
            }
         });

         const distenceBetweenPlayerAndEnemy = Math.hypot(
            abhi.x - enemy.x,
            abhi.y - enemy.y
        );
    
        if(distenceBetweenPlayerAndEnemy - abhi.radius - enemy.radius < 1){
           
           cancelAnimationFrame(animationId);
           gameOverSound.play();
           return  gameoverLoader();
           
         }

        weapons.forEach( (weapon, weaponIndex) => {

          

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
                    playerScore += 10;
                    scoreboard.innerHTML = "Score:" + playerScore;
                 
                    setTimeout(() => {
                        killEnemySound.play();
                        enemies.splice(enemyIndex, 1);
                        weapons.splice(weaponIndex, 1);
                    }, 0); 
                }
               
            }
        });
    });
    
}

if(flag == true){
    spawnEnemy();
    animation();
    
}


//Event listener for weapon light (bulats)
canvas.addEventListener("click", (e) => {
    shootingSound.play();
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



//Event listener for weapon heavy (bulats)
canvas.addEventListener('contextmenu', (e) => {

    e.preventDefault();

    if(playerScore <= 0) return ;
    heavyWeaponSound.play();
    playerScore -= 5 ;
    scoreboard.innerHTML = "Score:" + playerScore;
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
    if(playerScore <= 0) return ;
    hugeWeaponSound.play();
    playerScore -= 20 ;
    scoreboard.innerHTML = "Score:" + playerScore;
    if(e.key == " "){
        hugeweapons.push(
            new HugeWeapon(
                0,
                0,
                hugeWeightWeapon
            )
        );
    }
});

addEventListener("resize", (e) => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
})