import { Component } from 'react';
import { GAME_HEIGHT, PIPE_WIDTH, PIPE_DISTANCE, PADDING_SIZE, GAME_WIDTH, PIPE_SPEED } from './constants';

class Pipe extends Component {

    leftX = GAME_WIDTH
    leftY = 0
    heightUp
    heightDown

    isOut = false

    constructor() {
        super()

        this.heightUp = Math.random() * (GAME_HEIGHT - PIPE_DISTANCE);
        this.heightUp = Math.max(this.heightUp, PADDING_SIZE);
        this.heightUp = Math.min(this.heightUp, GAME_HEIGHT - PIPE_DISTANCE - PADDING_SIZE);
        this.heightDown = GAME_HEIGHT - this.heightUp - PIPE_DISTANCE;
    }

    draw = (ctx) => {
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.fillStyle = "OliveDrab";
        ctx.fillRect(this.leftX, this.leftY, PIPE_WIDTH, this.heightUp);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.fillStyle = "OliveDrab";
        ctx.fillRect(this.leftX, this.leftY + this.heightUp + PIPE_DISTANCE, PIPE_WIDTH, this.heightDown);
        ctx.stroke();
    }

    update = () => {
        if(this.isOut) return
        this.leftX -= PIPE_SPEED
        if(this.leftX + PIPE_WIDTH < 0) { 
            this.isOut = true
        }
    }

}

export default Pipe;