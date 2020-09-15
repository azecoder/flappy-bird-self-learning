import React, { Component } from 'react';
import './App.css';

import { GAME_WIDTH, GAME_HEIGHT, BIRD_COUNT, PIPE_DISTANCE, GAME_SPEED, PIPE_WIDTH } from './components/constants'

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
                
        this.state = {
            gameSpeed: GAME_SPEED,
            birdCount: BIRD_COUNT,
            pipeWidth: PIPE_WIDTH,
            pipeDistance: PIPE_DISTANCE
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

        // generate birds before starting
        this.generateBirds()

        this.start()
    }

    loop() {
        this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        // create new pipe and add to the pipe list
        if(this.frameCount%(60) === 0) {
            var newPipe = new Pipe(
                this.state.pipeWidth,
                this.state.pipeDistance
            )
            this.pipes.push(newPipe)
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

    changePipeDistance = (e) => {
        this.setState({
            pipeDistance: e.target.value
        })
        this.restart()
    }

    render() {
        return (
            <div className="App">
                <h1>FlappyBird - Self Learning</h1>
                <div className="Game">
                    <div className="Game-left">
                        <section>
                            <h2>Statistics</h2>
                            <div>
                                <h3>Record</h3>
                                <p>Best: <span>{this.state.gameSpeed}</span></p>
                                <p>Current: <span>{this.state.gameSpeed}</span></p>
                            </div>
                            <div>
                                <h3>Best Bird 1</h3>
                                <p>ID: <span>{this.state.gameSpeed}</span></p>
                                <p>Fly Time: <span>{this.state.gameSpeed}</span></p>
                            </div>
                            <div>
                                <h3>Best Bird 2</h3>
                                <p>ID: <span>{this.state.gameSpeed}</span></p>
                                <p>Fly Time: <span>{this.state.gameSpeed}</span></p>
                            </div>
                        </section>
                    </div>
                    <div className="Game-center">
                        <React.Fragment>
                            <canvas id="gameCanvas" width={GAME_WIDTH} height={GAME_HEIGHT} className="Game-canvas">
                            Your browser does not support the HTML canvas tag.
                            </canvas>
                        </React.Fragment>
                        <section>
                            <h2>Live Configuration</h2>
                            <div>
                                <div>
                                    <h3>Game Speed</h3>
                                    <p>{this.state.gameSpeed}</p>
                                    <input type="range" min="10" max="300"
                                    value={this.state.gameSpeed}
                                    onChange={this.changeGameSpeed}/>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="Game-right">
                        <section>
                            <h2>Initial Configuration</h2>
                            <div>
                                <div>
                                    <h3>Bird Count</h3>
                                    <p>{this.state.birdCount}</p>
                                    <input type="number" value=
                                    {this.state.birdCount}
                                    onChange={this.changeBirdCount}/>
                                </div>
                                <div>
                                    <h3>Pipe Width</h3>
                                    <p>{this.state.pipeWidth}</p>
                                    <input type="range" min="10" max="80"
                                    value={this.state.pipeWidth}
                                    onChange={this.changePipeWidth}/>
                                </div>
                                <div>
                                    <h3>Pipe Distance</h3>
                                    <p>{this.state.pipeDistance}</p>
                                    <input type="range" min="40" max="240"
                                    value={this.state.pipeDistance}
                                    onChange={this.changePipeDistance}/>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }

}

export default Game;