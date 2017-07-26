class Alien extends Phaser.Sprite {
    /**
     * Create a sprite and add it to the parent group. 
     */    
    public static create(game: Phaser.Game, group: Phaser.Group, x: number, y: number) : Alien {
        var newAlien : Alien = new Alien(game, x, y);
        group.add(newAlien);

        return newAlien;
    }

    // Parent group for this sprite.  Used for collision detection.
    private group: Phaser.Group;

    // Json Map of X - Y locations 
    private static pathMap;

    // Reference to start location
    private xOrigin : number;
    private yOrigin : number;
    private currentAngle : number = 0;

    // Reference to the current location in the path map.
    private pathLocation : number = 0;

    private constructor(game: Phaser.Game, x: number, y: number) {
        super(game,x, y, 'alien');
        this.xOrigin = x;
        this.yOrigin = y;
        this.animations.add('fly', [0, 1, 2, 3], 20, true);
        this.animations.play('fly');
        game.physics.arcade.enable(this);

        Alien.pathMap = game.cache.getJSON('CirclePath10');
    }
        
    public move() {
        // Simple movement based off of path map.
        this.x += Alien.pathMap[this.pathLocation].X;
        this.y += Alien.pathMap[this.pathLocation].Y;

        // Go to the next location in the path map.
        this.pathLocation++;
        if (Alien.pathMap[this.pathLocation] == undefined) {
            this.pathLocation = 0;
        }
    }
}

class AlienWave {
    public aliens : Phaser.Group;
    private readonly yLowerBound : number = 100;
    private readonly yUpperBound : number = 800;
    private movingUp : boolean = false;
    private movingRight: boolean = true;
    private readonly h : number = 200;
    private readonly k : number = 20;
    private readonly r : number = 50;
    private readonly speed : number = 2;

    constructor(game: Phaser.Game) {
        var self : AlienWave = this;
        this.aliens = game.add.group();
        Alien.create(game, this.aliens, 100, 100);
        Alien.create(game, this.aliens, 200, 400);
        Alien.create(game, this.aliens, 200, 300);
        Alien.create(game, this.aliens, 400, 100);
        Alien.create(game, this.aliens, 400, 800);
        Alien.create(game, this.aliens, 100, 400);
    }

    public moveAliens() {
        this.aliens.forEach(function(alien: Alien) 
        {

            // Don't move dead aliens
            if (alien.alive == false) {
                return;
            }

            alien.move();

        }, this);
    }

    /**
     * Are all of the aliens in the wave dead.
     */
    public allDead() : boolean {
        return (this.aliens.countLiving() < 1);
    }

};