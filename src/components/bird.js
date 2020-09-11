import { Component } from 'react';

class Bird extends Component {

    posX
    posY
    gravity = 1
    velocity = 10

    constructor() {
        super()
        
        this.posX = 100
        this.posY = 100
    }

    draw = (ctx) => {
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, 15, 0, 2 * Math.PI);
        ctx.fillStyle = 'Crimson';
        ctx.fill()
        ctx.lineWidth = 0.3
        ctx.stroke();
    }

    update = () => {
        this.velocity += this.gravity
        this.velocity = Math.min(this.velocity, this.gravity)
        this.posY += this.gravity
    }

    jump = () => {
        this.velocity = -10
    }

}


export default Bird;