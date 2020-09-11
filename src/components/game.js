import React, { Component } from 'react';
import { GAME_WIDTH, GAME_HEIGHT, GAME_SPEED } from './constants'

import Pipe from './pipe'
import Bird from './bird'

class Game extends Component {

    canvas
    ctx

    pipes
    birds

    constructor(props) {
        super(props)

        this.pipes = []
        this.birds = []
    }

    componentDidMount() {
        document.addEventListener('keydown', this.onKeyDown)

        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
    
        var bird = new Bird()
        this.birds.push(bird)

        var frameCount = 0
        setInterval(() => {
            this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            if(frameCount%60 === 0) {
                this.pipes.push(new Pipe())
            }
            frameCount += 1

            this.pipes = this.pipes.filter(pipe => !pipe.isOut)
            this.pipes.forEach(pipe => {
                pipe.update()
                pipe.draw(this.ctx)
            })

            bird.update(this.pipes, this.props.setScreen)
            bird.draw(this.ctx)
        }, 1000 / GAME_SPEED);
    }

    onKeyDown = (e) => {
        if (e.code === 'Space') {
            this.birds[0].jump()
        }
    }

    render() {
        return (
            <div className="game-panel">
                <h1>FlappyBird - Self Learning</h1>
                <canvas
                    id="gameCanvas"
                    width={GAME_WIDTH}
                    height={GAME_HEIGHT}
                    className="game-canvas"
                >
                Your browser does not support the HTML canvas tag.
                </canvas>
            </div>
        )
    }

}

export default Game;