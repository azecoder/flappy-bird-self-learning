import React, { Component } from 'react';
import './App.css';

import { GAME_WIDTH, GAME_HEIGHT, BIRD_COUNT, PIPE_COUNT, PIPE_DISTANCE, PADDING_SIZE, GAME_SPEED, PIPE_WIDTH } from './components/constants'

import Pipe from './components/pipe'
import Bird from './components/bird'


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
    state
    
    componentDidMount() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d")

        this.restart()
    }

    // Initialization
    constructor(props) {
        super(props)

        this.recordFlyTime = -1
        this.pipeHeights = []
                
        this.state = {
            gameSpeed: GAME_SPEED,
            birdCount: BIRD_COUNT,
            pipeWidth: PIPE_WIDTH,
        }
    }

    // Start Game
    start() {
        clearInterval(this.interval)
        this.interval = setInterval(() => {
            this.loop()
        }, 1000 / this.state.gameSpeed)
    }

    // Reset Game
    reset() {
        this.pipes = []
        this.birds = []
        
        this.pipeIndex = 0
        this.frameCount = 0
    }

    // Restart Game
    restart() {
        this.reset()

        // generate birds and pipes before starting
        this.generateBirds()
        this.calculatePipeHeights()

        this.start()
    }

    loop() {
        this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        // create new pipe and add to the pipe list
        if(this.frameCount%60 === 0) {
            this.pipes.push(new Pipe(this.pipeHeights[this.pipeIndex], this.state.pipeWidth))
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

            this.reset()
            
            // make mutation using best bird brain
            this.bestBird1.mutate()
            // generate new birds using best bird
            this.generateBirds(this.bestBird1, this.bestBird2)

            // start game and train again
            this.start()
        }
    }

    // Generate N new trained birds
    generateBirds(...bestBirds) {
        this.birds = []
        for(let i=0; i<this.state.birdCount; i++) {
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

    changeGameSpeed = (e) => {
        this.setState({
            gameSpeed: e.target.value
        })
        this.start()
    }

    changeBirdCount = (e) => {
        this.setState({
            birdCount: e.target.value
        })
        this.restart()
    }

    changePipeWidth = (e) => {
        this.setState({
            pipeWidth: e.target.value
        })
        this.restart()
    }

    render() {
        return (
            <div className="Game">
                <React.Fragment>
                    <h1>FlappyBird - Self Learning</h1>
                    <canvas id="gameCanvas" width={GAME_WIDTH} height={GAME_HEIGHT} className="game-canvas">
                    Your browser does not support the HTML canvas tag.
                    </canvas>
                </React.Fragment>
                <div className="control">
                    <div>
                        <h2>Game Speed</h2>
                        <p>{this.state.gameSpeed}</p>
                        <input type="range" min="10" max="300"
                        value={this.state.gameSpeed}
                        onChange={this.changeGameSpeed}/>
                    </div>
                    <div>
                        <h2>Bird Count</h2>
                        <p>{this.state.birdCount}</p>
                        <input type="number" value=
                        {this.state.birdCount}
                        onChange={this.changeBirdCount}/>
                    </div>
                    <div>
                        <h2>Pipe Width</h2>
                        <p>{this.state.pipeWidth}</p>
                        <input type="range" min="10" max="80"
                        value={this.state.pipeWidth}
                        onChange={this.changePipeWidth}/>
                    </div>
                </div>
            </div>
        );
    }

}

export default Game;