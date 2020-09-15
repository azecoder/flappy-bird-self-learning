import { Component } from 'react';
import { GAME_HEIGHT, PIPE_DISTANCE, GAME_WIDTH, PIPE_SPEED } from './constants';

class Pipe extends Component {

    leftX = GAME_WIDTH
    leftY = 0
    heightUp
    heightDown
    width

    isOut = false

    constructor(pipeHeight, pipeWidth) {
        super()

        // this.heightUp = Math.random() * (GAME_HEIGHT - PIPE_DISTANCE);
        // this.heightUp = Math.max(this.heightUp, PADDING_SIZE);
        // this.heightUp = Math.min(this.heightUp, GAME_HEIGHT - PIPE_DISTANCE - PADDING_SIZE);
        this.heightUp = parseInt(pipeHeight)
        this.width = parseInt(pipeWidth)
        this.heightDown = GAME_HEIGHT - this.heightUp - PIPE_DISTANCE;
    }

    draw = (ctx) => {
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.fillStyle = "OliveDrab";
        ctx.fillRect(this.leftX, this.leftY, this.width, this.heightUp);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.fillStyle = "OliveDrab";
        ctx.fillRect(this.leftX, this.leftY + this.heightUp + PIPE_DISTANCE, this.width, this.heightDown);
        ctx.stroke();
    }

    update = () => {
        if(this.isOut) return
        if(this.leftX + this.width < 0) {
            this.isOut = true
        }
        this.leftX -= PIPE_SPEED
    }

}

export default Pipe;