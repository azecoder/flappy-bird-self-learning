Developing a Flappy bird game using Machine Learning
# Flappy Bird - Self Learning Game
### It is simple Flappy Bird game. But each bird has a brain in this game. 

![image](https://github.com/azecoder/flappy-bird-self-learning/blob/master/cleverbirds.gif)


#### To implement brain part of the code, I create a think function and use Neural Network to make decisions. 
```
this.brain = brain || new NeuralNetwork(4, 10, 2)

think = () => {
    let pipe = closestPipe(this.pipes)

    let inputs = []
    inputs = [
        this.posY, 
        pipe.leftY + pipe.height + BIRD_RADIUS * 2, 
        pipe.leftY + pipe.height + pipe.distance - BIRD_RADIUS * 2,
        pipe.width + BIRD_RADIUS * 2,
    ]

    let action = this.brain.predict(inputs);

    if (action[1] > action[0]) {
        this.jump()
    }
}
```

####  At the end of the each step it generates N new birds using the tactics (copy brain) of best birds.
```
generateBirds = () => {
    for(let i=0; i<this.birdsCount; i++) {
        if(this.bestBirds && this.bestBirds.length) {
            var bestBirdIndex = i%this.bestBirds.length
            this.birds.push(new Bird(this.bestBirds[bestBirdIndex].brain))
        } else {
            this.birds.push(new Bird())
        }
    }
}
```

## To try in Local

#### `git install https://github.com/azecoder/flappy-bird-self-learning`
Download code from repository

#### `npm install`
Install all packages and dependencies

#### `npm start`
Run the project
