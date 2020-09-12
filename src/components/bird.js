import { Component } from 'react';
import { BIRD_RADIUS, BIRD_VELOCITY_MAX, GAME_HEIGHT, PIPE_DISTANCE, PIPE_WIDTH, SCREEN } from './constants';

import { NeuralNetwork } from './neural/nn'

class Bird extends Component {

    posX
    posY
    acceleration = 0.25
    velocity = 0

    isOut
    isDead

    brain

    constructor() {
        super()
        
        this.posX = 100
        this.posY = 100
        this.isOut = false
        this.isDead = false
    
        // inputs:
        // [bird.x, bird.y]
        // [doorTop.x, doorTop.y]
        // [doorBottom.x, doorBottom.y]
        this.brain = new NeuralNetwork(6, 10, 2)
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

    update = (pipes, setScreen) => {
        if(this.isOut || this.isDead) {
            // setScreen(SCREEN.GAME_OVER)
            return
        }

        this.velocity += this.acceleration  // new_v = old_v + delta_v, delta_v = acc * time
        this.velocity = Math.min(this.velocity, BIRD_VELOCITY_MAX)
        this.posY += this.velocity

        if(this.posY + 2 * BIRD_RADIUS < 0 || this.posY > GAME_HEIGHT + BIRD_RADIUS) {
            this.isOut = true;
        }

        pipes.forEach(pipe => {
            const ST_PIPE_LEFT_TOP_X = pipe.leftX;
            const ST_PIPE_LEFT_TOP_Y = pipe.leftY;
            const ST_PIPE_RIGHT_BOTTOM_X = pipe.leftX + PIPE_WIDTH;
            const ST_PIPE_RIGHT_BOTTOM_Y = pipe.leftY + pipe.heightUp;

            const ND_PIPE_LEFT_TOP_X = pipe.leftX;
            const ND_PIPE_LEFT_TOP_Y = pipe.leftY + pipe.heightUp + PIPE_DISTANCE;
            const ND_PIPE_RIGHT_BOTTOM_X = pipe.leftX + PIPE_WIDTH;
            const ND_PIPE_RIGHT_BOTTOM_Y = GAME_HEIGHT;
        
            if( (this.posX + BIRD_RADIUS > ST_PIPE_LEFT_TOP_X && this.posX - BIRD_RADIUS < ST_PIPE_RIGHT_BOTTOM_X
                && this.posY + BIRD_RADIUS > ST_PIPE_LEFT_TOP_Y && this.posY - BIRD_RADIUS < ST_PIPE_RIGHT_BOTTOM_Y)
                || (this.posX + BIRD_RADIUS > ND_PIPE_LEFT_TOP_X && this.posX - BIRD_RADIUS < ND_PIPE_RIGHT_BOTTOM_X
                    && this.posY + BIRD_RADIUS > ND_PIPE_LEFT_TOP_Y && this.posY - BIRD_RADIUS < ND_PIPE_RIGHT_BOTTOM_Y)) {
                        this.isDead = true;
                }
        })

        this.think(pipes)
    }

    think = (pipes) => {
        let closestPipe = null
        let record = Infinity
        pipes.forEach(pipe => {
            let diff = pipe.leftX - this.posX
            if(diff > 0 && diff < record) {
                record = diff
                closestPipe = pipe
            }
        });

        if(closestPipe) {
            let inputs = []
            inputs = [
                this.posX, 
                this.posY, 
                closestPipe.leftX, 
                closestPipe.leftY + closestPipe.heightUp, 
                closestPipe.leftX, 
                closestPipe.leftY + closestPipe.heightUp + PIPE_DISTANCE]

            let action = this.brain.predict(inputs);
            console.log(action)
            if (action[1] > action[0]) {
                this.jump()
            }
        }

    }

    jump = () => {
        this.velocity = -5
    }

}


export default Bird;