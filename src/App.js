import React, { Component } from 'react';
import './App.css';

import { GAME_WIDTH, GAME_HEIGHT, BIRD_COUNT, PIPE_DISTANCE, GAME_SPEED, PIPE_WIDTH, BIRD_RADIUS } from './components/constants'

import Pipe from './components/pipe'
import Bird from './components/bird'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRecordVinyl, faDove, faAward, faChevronCircleRight, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { faEarlybirds } from '@fortawesome/free-brands-svg-icons'



class Game extends Component {

    canvas
    ctx

    pipes
    birds

    // Find best bird and train others
    bestBirds

    // 
    loopNumber
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

        this.loopNumber = 0
        this.recordFlyTime = -1
        this.bestBirds = []
                
        this.state = {
            gameSpeed: GAME_SPEED,
            birdCount: BIRD_COUNT,
            pipeWidth: PIPE_WIDTH,
            pipeDistance: PIPE_DISTANCE,
            bestBirds: [],
            recordFlyTime: 0,
            currentFlyTime: 0,
            loopNumber: 0,
            aliveBirdsCount: 0
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
        this.loopNumber += 1

        // set current best fly time
        this.setState({
            currentFlyTime: 0,
            loopNumber: this.loopNumber
        })
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
        if(this.frameCount%(80) === 0) {
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
            bird.draw(this.ctx, Math.floor(this.frameCount/6))
        })

        // if all birds are dead
        if(aliveBirds.length === 0) {
            // sort all dead birds by fly time and take best bird
            this.bestBirds.forEach(bird => {
                this.birds.push(bird)
            })
            this.birds.sort((a, b) => a.flyTime > b.flyTime ? -1 : 1)
            this.bestBirds = []
            for(let i = 0; i < 5; i++) {
                this.bestBirds.push(this.birds[i])
            }
            console.log(this.bestBirds)

            this.setState({
                recordFlyTime: this.bestBirds[0].flyTime,
                bestBirds: this.bestBirds,
                aliveBirdsCount: 0
            })

            // reset unnecessary data 
            this.reset()
            
            // make mutation using best bird brain
            this.bestBirds[0].mutate()
            // generate new birds using best bird
            this.generateBirds()

            // start game and train again
            this.start()
        } else {
            // set current best fly time
            this.setState({
                currentFlyTime: aliveBirds[0].flyTime,
                aliveBirdsCount: aliveBirds.length
            })
        }
    }

    // Generate N new trained birds
    generateBirds() {
        for(let i=0; i<this.state.birdCount; i++) {
            if(this.bestBirds && this.bestBirds.length) {
                var bestBirdIndex = i%this.bestBirds.length
                this.birds.push(new Bird(i+1, this.loopNumber, bestBirdIndex, this.bestBirds[bestBirdIndex].brain))
            } else {
                this.birds.push(new Bird(i+1, this.loopNumber))
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
        this.start()
    }

    changePipeDistance = (e) => {
        this.setState({
            pipeDistance: parseInt(e.target.value) + 2 * BIRD_RADIUS
        })
        this.start()
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <div className="site-logo container">
                        <div className="logo">
                            <FontAwesomeIcon icon={faDove} />
                        </div>
                        <h2>FlappyBird - Self Learning</h2>
                    </div>
                </div>
                <div className="App-content container">
                    <section className="statistics">
                        <div className="card">
                            <div className="card-header">
                                <h2>Statistics</h2>
                            </div>
                            <div className="card-body random-color">
                                <div className="card-item">
                                    <h3>Current</h3>
                                    <div>
                                        <div className="item-icon txt-info">
                                            <FontAwesomeIcon icon={faChevronCircleRight} />
                                        </div>
                                        <div className="item-data">
                                            <p>Loop: <span>{this.state.loopNumber}</span></p>
                                            <p>Alive Birds: <span>{this.state.aliveBirdsCount}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-item">
                                    <h3>Record</h3>
                                    <div>
                                        <div className="item-icon txt-primary">
                                            <FontAwesomeIcon icon={faRecordVinyl} />
                                        </div>
                                        <div className="item-data">
                                            <p>Best: <span>{this.state.recordFlyTime}</span></p>
                                            <p>Current: <span>{this.state.currentFlyTime}</span></p>
                                        </div>
                                        { this.state.currentFlyTime > this.state.recordFlyTime ? (
                                                <div className="record-icon txt-success">
                                                    <FontAwesomeIcon icon={faAward} />
                                                </div>
                                            ) : ( <span></span> )
                                        }
                                    </div>
                                </div>
                                { this.state.bestBirds.length ? (
                                <React.Fragment>
                                    <div className="card-item">
                                        <h3>Best Bird 1</h3>
                                        <div>
                                            <div className="item-icon txt-info">
                                                <FontAwesomeIcon icon={faEarlybirds} />
                                            </div>
                                            <div className="item-data">
                                                <p>Name: <span>{this.state.bestBirds[0].getName()}</span></p>
                                                <p>Fly Time: <span>{this.state.bestBirds[0].flyTime}</span></p>
                                            </div>
                                            <div className="record-icon txt-success">
                                                {this.state.bestBirds[0].flyTime < this.state.currentFlyTime ? (<FontAwesomeIcon icon={faAngleUp} />) : (<React.Fragment/>) }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-item">
                                        <h3>Best Bird 2</h3>
                                        <div>
                                            <div className="item-icon txt-success">
                                                <FontAwesomeIcon icon={faEarlybirds} />
                                            </div>
                                            <div className="item-data">
                                                <p>Name: <span>{this.state.bestBirds[1].getName()}</span></p>
                                                <p>Fly Time: <span>{this.state.bestBirds[1].flyTime}</span></p>
                                            </div>
                                            <div className="record-icon txt-success">
                                                {this.state.bestBirds[1].flyTime < this.state.currentFlyTime ? (<FontAwesomeIcon icon={faAngleUp} />) : (<React.Fragment/>) }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-item">
                                        <h3>Best Bird 3</h3>
                                        <div>
                                            <div className="item-icon txt-warning">
                                                <FontAwesomeIcon icon={faEarlybirds} />
                                            </div>
                                            <div className="item-data">
                                                <p>Name: <span>{this.state.bestBirds[2].getName()}</span></p>
                                                <p>Fly Time: <span>{this.state.bestBirds[2].flyTime}</span></p>
                                            </div>
                                            <div className="record-icon txt-success">
                                                {this.state.bestBirds[2].flyTime < this.state.currentFlyTime ? (<FontAwesomeIcon icon={faAngleUp} />) : (<React.Fragment/>) }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-item">
                                        <h3>Best Bird 4</h3>
                                        <div>
                                            <div className="item-icon txt-focus">
                                                <FontAwesomeIcon icon={faEarlybirds} />
                                            </div>
                                            <div className="item-data">
                                                <p>Name: <span>{this.state.bestBirds[3].getName()}</span></p>
                                                <p>Fly Time: <span>{this.state.bestBirds[3].flyTime}</span></p>
                                            </div>
                                            <div className="record-icon txt-success">
                                                {this.state.bestBirds[3].flyTime < this.state.currentFlyTime ? (<FontAwesomeIcon icon={faAngleUp} />) : (<React.Fragment/>) }
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                                ) : (<React.Fragment/>) }
                            </div>
                        </div>
                    </section>
                    <section className="game-panel">
                        <div className="card-game">
                            <canvas id="gameCanvas" width={GAME_WIDTH} height={GAME_HEIGHT} className="game-canvas">
                            Your browser does not support the HTML canvas tag.
                            </canvas>
                        </div>
                        <div className="live-confg">
                            <div className="card">
                                <div className="card-header">
                                    <h2>Game Speed</h2>
                                </div>
                                <div className="card-body">
                                    <div className="card-item">
                                        <p>{this.state.gameSpeed}</p>
                                        <input type="range" min="10" max="300"
                                        value={this.state.gameSpeed}
                                        onChange={this.changeGameSpeed}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="configurations">
                        <div className="card">
                            <div className="card-header">
                                <h2>Configuration</h2>
                            </div>
                            <div className="card-body">
                                <div className="card-item">
                                    <h3>
                                        Bird Count
                                        <span> ({this.state.birdCount})</span>
                                    </h3>
                                    <div>
                                        <input type="number" value=
                                        {this.state.birdCount}
                                        onChange={this.changeBirdCount}/>
                                    </div>
                                </div>
                                <div className="card-item">
                                    <h3>
                                        Pipe Width
                                        <span> ({this.state.pipeWidth})</span>
                                    </h3>
                                    <div>
                                        <input type="range" min="10" max="80"
                                        value={this.state.pipeWidth}
                                        onChange={this.changePipeWidth}/>
                                    </div>
                                </div>
                                <div className="card-item">
                                    <h3>
                                        Pipe Distance
                                        <span> ({this.state.pipeDistance})</span>
                                    </h3>
                                    <div>
                                        <input type="range" min="100" max="240"
                                        value={this.state.pipeDistance}
                                        onChange={this.changePipeDistance}/>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div>
                                    <button className="btn bg-primary txt-white">Restart Game</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

}

export default Game;