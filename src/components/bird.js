import { Component } from 'react';
import { BIRD_RADIUS, GAME_HEIGHT, PADDING_SIZE } from './constants';

import { NeuralNetwork } from './neural/nn'


class Bird extends Component {

    posX
    posY
    acceleration = 0.5
    velocity = 0

    isOut
    isDead

    brain
    flyTime

    ID
    genID
    color

    constructor(ID, genID, parentID=4, brain) {
        super()
        
        this.ID = ID
        this.genID = genID
        this.parentID = parentID
        // this.color = parentID >= 0 ? BIRD_COLORS[parentID] : "#d92550"

        this.posX = (Math.random() * 400) + PADDING_SIZE
        this.posY = (Math.random() * 100) + PADDING_SIZE
        this.isOut = false
        this.isDead = false

        this.flyTime = 0
    
        // inputs:
        // [bird.x, bird.y]
        // [doorTop.x, doorTop.y]
        // [doorBottom.x, doorBottom.y]

        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
            this.brain.mutate(this.mutate);
        } else {
            this.brain = brain || new NeuralNetwork(4, 10, 2)
        }
        // this.brain = brain || new NeuralNetwork(6, 10, 2)
    }

    getName = () => {
        var name = 'G' + this.addZero(this.genID, 4)
        name = name + '-N' + this.addZero(this.ID, 4)
    
        return name;
    }

    addZero = (number, length) => {
        var my_string = '' + number;
        while (my_string.length < length) {
            my_string = '0' + my_string;
        }
    
        return my_string;
    }

    draw = (ctx, fn) => {
        if(this.isOut || this.isDead) return
        
        var birdImg = new Image()
        birdImg.src = process.env.PUBLIC_URL + '/birds/' + this.parentID + (fn%9) + '.png'
        ctx.drawImage(birdImg, this.posX, this.posY)
        
        // ctx.beginPath();
        // ctx.arc(this.posX, this.posY, BIRD_RADIUS, 0, 2 * Math.PI);
        // ctx.fillStyle = this.color;
        // ctx.fill()
        // ctx.lineWidth = 0.3
        // ctx.stroke();
    }

    update = (pipes) => {
        if(this.isOut || this.isDead) {
            // setScreen(SCREEN.GAME_OVER)
            return
        }

        this.velocity += this.acceleration  // new_v = old_v + delta_v, delta_v = acc * time
        this.velocity = Math.min(this.velocity, 5)
        this.posY += this.velocity

        if(this.posY + BIRD_RADIUS < 0 || this.posY > GAME_HEIGHT) {
            this.isOut = true;
        }

        pipes.forEach(pipe => {
            const ST_PIPE_LEFT_TOP_X = pipe.leftX;
            const ST_PIPE_LEFT_TOP_Y = pipe.leftY;
            const ST_PIPE_RIGHT_BOTTOM_X = pipe.leftX + pipe.width;
            const ST_PIPE_RIGHT_BOTTOM_Y = pipe.leftY + pipe.heightUp;

            const ND_PIPE_LEFT_TOP_X = pipe.leftX;
            const ND_PIPE_LEFT_TOP_Y = pipe.leftY + pipe.heightUp + pipe.distance;
            const ND_PIPE_RIGHT_BOTTOM_X = pipe.leftX + pipe.width;
            const ND_PIPE_RIGHT_BOTTOM_Y = GAME_HEIGHT;
        
            if( (this.posX + BIRD_RADIUS > ST_PIPE_LEFT_TOP_X && this.posX < ST_PIPE_RIGHT_BOTTOM_X
                && this.posY + BIRD_RADIUS > ST_PIPE_LEFT_TOP_Y && this.posY < ST_PIPE_RIGHT_BOTTOM_Y)
                || (this.posX + BIRD_RADIUS > ND_PIPE_LEFT_TOP_X && this.posX < ND_PIPE_RIGHT_BOTTOM_X
                    && this.posY + BIRD_RADIUS > ND_PIPE_LEFT_TOP_Y && this.posY < ND_PIPE_RIGHT_BOTTOM_Y)) {
                        this.isDead = true;
                }
        })

        this.flyTime += 1
        this.think(pipes)
    }

    think = (pipes) => {
        let closestPipe = null
        let record = Infinity
        pipes.forEach(pipe => {
            if(pipe.leftX > this.posX) {
                let diff = pipe.leftX + pipe.width - this.posX
                if(diff > 0 && diff < record) {
                    record = diff
                    closestPipe = pipe
                }
            }
        });

        if(closestPipe) {
            let inputs = []
            inputs = [
                this.posY, 
                closestPipe.leftY + closestPipe.heightUp + BIRD_RADIUS * 2, 
                closestPipe.leftY + closestPipe.heightUp + closestPipe.distance - BIRD_RADIUS * 2,
                closestPipe.width + BIRD_RADIUS * 2,
            ]

            let action = this.brain.predict(inputs);

            if (action[1] > action[0]) {
                this.jump()
            }
        }

    }

    jump = () => {
        this.velocity = -8
    }

    // Create a copy of this bird
    copy = () => {
        return new Bird(this.brain);
    }

    mutate = (x) => {
        if (Math.random() < 0.1) {
            let offset = Math.round(Math.random()) * 0.5;
            let newx = x + offset;
            return newx;
        } else {
            return x;
        }
    } 

}


export default Bird;