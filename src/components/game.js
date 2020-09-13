import React, { Component } from 'react';
import { GAME_WIDTH, GAME_HEIGHT, BIRD_COUNT, PIPE_COUNT, PIPE_DISTANCE, PADDING_SIZE } from './constants'

import Pipe from './pipe'
import Bird from './bird'

class Game extends Component {

    canvas
    ctx

    pipes
    birds

    // Find best bird and train others
    bestBird1
    bestBird2
    // Calculate the heights of the first N pipes (Randomly)
    pipeHeights
    pipeIndex

    // 
    frameCount


    // Initialization
    constructor(props) {
        super(props)

        this.pipes = []
        this.birds = []

        this.recordFlyTime = -1

        this.pipeHeights = []
        this.pipeIndex = 0
        this.frameCount = 0
    }

    // Generate N new trained birds
    generateBirds(...bestBirds) {
        this.birds = []
        for(let i=0; i<BIRD_COUNT; i++) {
            if(bestBirds && bestBirds.length && Math.random() < 0.8) {
                this.birds.push(new Bird(bestBirds[i%bestBirds.length].brain))
            } else {
                this.birds.push(new Bird())
            }
        }
    }

    // Calculate the heights of the first N pipes (randomly)
    calculatePipeHeights() {
        var prevPipe_height = (GAME_HEIGHT / 2) - PIPE_DISTANCE
        this.pipeHeights.push(prevPipe_height)
        for(let i=1; i<PIPE_COUNT; i++) {
            var diff = Math.random() * PIPE_DISTANCE;
            var ph = Math.random(1) < 0.5 ? prevPipe_height - diff : prevPipe_height + diff
            ph = Math.max(ph, PADDING_SIZE);
            ph = Math.min(ph, GAME_HEIGHT - PIPE_DISTANCE - PADDING_SIZE);
            this.pipeHeights.push(ph)
        }
    }

    // Reset Game
    resetGame() {
        this.frameCount = 0
        this.pipeIndex = 0
        this.pipes = []
    }

    // Manually Jump, using Space button
    onKeyDown = (e) => {
        if (e.code === 'Space') {
            this.birds[0].jump()
        }
    }

    // Before Rendering 
    componentDidMount() {
        
        document.addEventListener('keydown', this.onKeyDown)

        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");

        // generate birds and pipes before starting
        this.generateBirds()
        this.calculatePipeHeights()

        this.frameCount = 0
        this.pipeIndex = 0
        setInterval(() => {
            // clear canvas context for each frame  
            this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            // create new pipe and add to the pipe list
            if(this.frameCount%100 === 0) {
                this.pipes.push(new Pipe(this.pipeHeights[this.pipeIndex]))
                this.pipeIndex += 1
            }
            this.frameCount += 1

            // remove pipes which are out of the screen
            this.pipes = this.pipes.filter(pipe => !pipe.isOut)
            // update and draw each pipe in the screen
            this.pipes.forEach(pipe => {
                pipe.update()
                pipe.draw(this.ctx)
            })

            // remove birds which are out of the screen or dead
            var aliveBirds = this.birds.filter(bird => !bird.isOut && !bird.isDead)
            // update and draw each alive birds
            aliveBirds.forEach(bird => {
                bird.update(this.pipes)
                bird.draw(this.ctx)
            })

            // if all birds are dead
            if(aliveBirds.length === 0) {
                // sort all dead birds by fly time and take best bird
                this.birds.forEach(bird => {
                    if(this.recordFlyTime < bird.flyTime) {
                        this.recordFlyTime = bird.flyTime
                        this.bestBird2 = this.bestBird1
                        this.bestBird1 = bird
                    }
                })

                console.log(this.bestBird1.flyTime, this.bestBird2.flyTime)

                // make mutation using best bird brain
                this.bestBird1.mutate()
                // generate new birds using best bird
                this.generateBirds(this.bestBird1, this.bestBird2)

                // reset game to train again
                this.resetGame()
            }

        }, 1000 / this.props.gameSpeed);
    }

    render() {
        return (
            <canvas
                id="gameCanvas"
                width={GAME_WIDTH}
                height={GAME_HEIGHT}
                className="game-canvas"
            >
            Your browser does not support the HTML canvas tag.
            </canvas>
        )
    }

}

export default Game;