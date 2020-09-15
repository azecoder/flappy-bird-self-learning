import { Component } from 'react';
import { BIRD_RADIUS, GAME_HEIGHT, PADDING_SIZE, PIPE_DISTANCE } from './constants';

import { NeuralNetwork } from './neural/nn'

class Bird extends Component {

    posX
    posY
    acceleration = 0.4
    velocity = 0

    isOut
    isDead

    brain
    flyTime

    constructor(brain) {
        super()
        
        this.posX = (Math.random() * 400) + PADDING_SIZE
        this.posY = (Math.random() * 100) + PADDING_SIZE
        this.isOut = false
        this.isDead = false

        this.flyTime = 0
    
        // inputs:
        // [bird.x, bird.y]
        // [doorTop.x, doorTop.y]
        // [doorBottom.x, doorBottom.y]

        this.brain = brain || new NeuralNetwork(4, 10, 2)
        // this.brain = brain || new NeuralNetwork(6, 10, 2)
    }

    draw = (ctx) => {
        if(this.isOut || this.isDead) return

        ctx.beginPath();
        ctx.arc(this.posX, this.posY, BIRD_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = 'Crimson';
        ctx.fill()
        ctx.lineWidth = 0.3
        ctx.stroke();
    }

    update = (pipes) => {
        if(this.isOut || this.isDead) {
            // setScreen(SCREEN.GAME_OVER)
            return
        }

        this.velocity += this.acceleration  // new_v = old_v + delta_v, delta_v = acc * time
        this.velocity = Math.min(this.velocity, 4)
        this.posY += this.velocity

        if(this.posY + 2 * BIRD_RADIUS < 0 || this.posY > GAME_HEIGHT + BIRD_RADIUS) {
            this.isOut = true;
        }

        pipes.forEach(pipe => {
            const ST_PIPE_LEFT_TOP_X = pipe.leftX;
            const ST_PIPE_LEFT_TOP_Y = pipe.leftY;
            const ST_PIPE_RIGHT_BOTTOM_X = pipe.leftX + pipe.width;
            const ST_PIPE_RIGHT_BOTTOM_Y = pipe.leftY + pipe.heightUp;

            const ND_PIPE_LEFT_TOP_X = pipe.leftX;
            const ND_PIPE_LEFT_TOP_Y = pipe.leftY + pipe.heightUp + PIPE_DISTANCE;
            const ND_PIPE_RIGHT_BOTTOM_X = pipe.leftX + pipe.width;
            const ND_PIPE_RIGHT_BOTTOM_Y = GAME_HEIGHT;
        
            if( (this.posX + BIRD_RADIUS > ST_PIPE_LEFT_TOP_X && this.posX - BIRD_RADIUS < ST_PIPE_RIGHT_BOTTOM_X
                && this.posY + BIRD_RADIUS > ST_PIPE_LEFT_TOP_Y && this.posY - BIRD_RADIUS < ST_PIPE_RIGHT_BOTTOM_Y)
                || (this.posX + BIRD_RADIUS > ND_PIPE_LEFT_TOP_X && this.posX - BIRD_RADIUS < ND_PIPE_RIGHT_BOTTOM_X
                    && this.posY + BIRD_RADIUS > ND_PIPE_LEFT_TOP_Y && this.posY - BIRD_RADIUS < ND_PIPE_RIGHT_BOTTOM_Y)) {
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
                let diff = pipe.leftX - this.posX
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
                closestPipe.leftY + closestPipe.heightUp + BIRD_RADIUS, 
                closestPipe.leftY + closestPipe.heightUp + PIPE_DISTANCE - BIRD_RADIUS,
                closestPipe.width
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

    mutate = () => {
        this.brain.mutate = ((x) => {
            if (Math.random() < 0.1) {
                let offset = Math.round(Math.random()) * 0.5;
                let newx = x + offset;
                return newx;
            } else {
                return x;
            }
        });
    } 

}


export default Bird;