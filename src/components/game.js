import React, { useEffect } from 'react';
import { GAME_WIDTH, GAME_HEIGHT, GAME_SPEED } from './constants'

import Pipe from './pipe'
import Bird from './bird'

function Game() {

    useEffect(() => {

        let bird = new Bird()

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                bird.jump()
            }
        })

        let canvas = document.getElementById("gameCanvas");
        let ctx = canvas.getContext("2d");

        let pipe = new Pipe();
        pipe.draw(ctx)

        let frameCount = 0
        let pipes = []
        setInterval(() => {
            ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            frameCount += 1

            bird.draw(ctx)

            if(frameCount%50 === 0) {
                pipes.push(new Pipe())
            }

            pipes = pipes.filter(pipe => !pipe.isOut)
            pipes.forEach(pipe => {
                pipe.update()
                pipe.draw(ctx)
            })

            bird.update()
            bird.draw(ctx)
        }, 1000 / GAME_SPEED);

    });

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

export default Game;