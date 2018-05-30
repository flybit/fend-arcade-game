function randomInt(end) {
    // From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    return Math.floor(Math.random() * Math.floor(end))
}

// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Set position and speed
    this.reset();
};

Enemy.prototype.reset = function() {
    // Pick a random row (uniform over [0, 2])
    this.x = this.MIN_X;
    this.y = 62 + randomInt(3) * 82;

    // Pick a random speed (uniform over {100, 200, 300})
    this.speed = 100 + randomInt(3) * 100;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;

    if (this.x > this.MAX_Y) {
        this.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Static constants
Enemy.prototype.MAX_Y = 500;
Enemy.prototype.MIN_X = -100;

class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        // For freezing the player when the game is over
        this.frozen = false;
        // Reset posiiton
        this.reset();
    }

    // Unfreeze and reset position
    reset() {
        this.frozen = false;
        [this.x, this.y] = [(this.MIN_X + this.MAX_X)/2, this.MAX_Y];
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    update() {
        // Return early if frozen
        if (this.frozen) {
            return;
        }

        // Check for collisions
        let colliding = allEnemies.filter((e) => {
            const dX = this.x - e.x;
            const dY = this.y - e.y;

            return dX > -30 && dX < 30 && dY < 0 && dY > -50;
        });

        // Go back to the bottom if there is a collision
        if (colliding.length) {
            console.log('Collision detected');
            this.reset();
        }

        // Won the game?
        if (this.y < 0) {
            // Freeze
            this.frozen = true;
            // Show the modal dialog
            document.querySelector('.modal').showModal();
        }
    }

    handleInput(key) {
        // Return early if frozen or unsupported key
        if (!key || this.frozen) {
            return;
        }

        // Update position
        switch(key) {
            case 'left':
                this.x -= this.X_STEP;
                break;
            case 'up':
                this.y -= this.Y_STEP;
                break;
            case 'right':
                this.x += this.X_STEP;
                break;
            case 'down':
                this.y += this.Y_STEP;
                break;
            default:
                console.error('Unknown key: ', key);
                return;
        }

        // Clip
        this.x = Math.max(this.MIN_X, Math.min(this.x, this.MAX_X));
        this.y = Math.max(this.MIN_Y, Math.min(this.y, this.MAX_Y));
    }
}

// Static constants
Player.prototype.Y_STEP = 82;
Player.prototype.X_STEP = 100;
Player.prototype.MIN_X = 0;
Player.prototype.MAX_X = 4*Player.prototype.X_STEP+Player.prototype.MIN_X;;
Player.prototype.MIN_Y = -25;
Player.prototype.MAX_Y = 5*Player.prototype.Y_STEP+Player.prototype.MIN_Y;

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const NUMBER_OF_ENEMIES = 5;
const allEnemies = [];
for (let i = 0; i < NUMBER_OF_ENEMIES; ++i) {
    allEnemies.push(new Enemy());
}

const player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

document.querySelector('.modal .ok-button').addEventListener('click', () => {
    player.reset();
    document.querySelector('.modal').close();
});

