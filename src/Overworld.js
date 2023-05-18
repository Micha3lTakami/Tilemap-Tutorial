class Overworld extends Phaser.Scene {
    constructor(){
        super({key:'overworldScene'})
        this.velocity = 100
    }
    preload(){
        this.load.path  = './assets/'
        this.load.spritesheet('slime', 'slime.png',{
            frameWidth:16,
            frameHeight:16
        })
        this.load.image('tilesetImage', 'tileset.png')
        this.load.tilemapTiledJSON('tilemapJSON', 'area01.json')
    }
    create(){
        const map = this.add.tilemap('tilemapJSON')
        const tileset = map.addTilesetImage('tileset', 'tilesetImage')

        // add layer by layer
        // note: 
        // add furthest layers first !
        // layer name should match name created in Tiled or similar tile mapping softrware 
        // i.e. needs to find layer name from JSON file
        const bgLayer = map.createLayer('Background', tileset, 0, 0)
        const terrainLayer = map.createLayer('Terrain', tileset,0,0)
        const treeLayer = map.createLayer('Trees', tileset, 0, 0)

        // add player
        const slimeSpawn = map.findObject('Spawns', obj => obj.name === 'slimeSpawn')
        this.slime = this.physics.add.sprite(slimeSpawn.x, slimeSpawn.y, 'slime', 0)
        
        // create animation for slime
        this.anims.create({
            key: 'wobble',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('slime', {start: 0, end: 1})
        })
        this.slime.play('wobble')

        this.slime.body.setCollideWorldBounds(true)

        // cameras
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.cameras.main.startFollow(this.slime, true, 0.25, 0.25)
        this.physics.world.bounds.setTo(0,0, map.widthInPixels, map.heightInPixels)
       
        // input handling
        this.cursors = this.input.keyboard.createCursorKeys()
        
        // enable collision based on the property created in Tiled
         terrainLayer.setCollisionByProperty({collides:true})
         treeLayer.setCollisionByProperty({collides:true})
         this.physics.add.collider(this.slime, terrainLayer)
         this.physics.add.collider(this.slime, treeLayer)
 
    }
    update(){
        // create normalized directional movement
        this.direction = new Phaser.Math.Vector2(0)
        if(this.cursors.left.isDown) {
            this.direction.x = -1
        }
        else if(this.cursors.right.isDown){
            this.direction.x = 1
        }
        if(this.cursors.up.isDown) {
            this.direction.y = -1
        }
        else if(this.cursors.down.isDown){
            this.direction.y = 1
        }
        this.direction.normalize()
        this.slime.setVelocity(this.velocity * this.direction.x, this.velocity * this.direction.y)
    }

}