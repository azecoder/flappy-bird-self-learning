import { Component } from 'react';
import { GAME_HEIGHT, GAME_WIDTH, PADDING_SIZE, PIPE_SPEED } from './constants';

class Pipe extends Component {

    leftX = GAME_WIDTH
    leftY = 0
    heightUp
    heightDown
    width
    distance

    isOut = false

    constructor(pipeWidth, pipeDistance) {
        super()

        this.width = parseInt(pipeWidth)
        this.distance = parseInt(pipeDistance)

        this.heightUp = Math.random() * (GAME_HEIGHT - this.distance);
        this.heightUp = Math.max(this.heightUp, PADDING_SIZE);
        this.heightUp = Math.min(this.heightUp, GAME_HEIGHT - this.distance - PADDING_SIZE);
        this.heightDown = GAME_HEIGHT - this.heightUp - this.distance;
    }

    draw = (ctx) => {
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.fillStyle = "#252733";
        ctx.fillRect(this.leftX, this.leftY, this.width, this.heightUp);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.fillStyle = "#252733";
        ctx.fillRect(this.leftX, this.leftY + this.heightUp + this.distance, this.width, this.heightDown);
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