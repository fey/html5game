type Position = {
  x: number,
  y: number,
}

type Direction = {
  dx: number,
  dy: number,
}

type Ball = {
  radius: number
  position: Position,
  direction: Direction,
}

type CanvasConfig = {
  width: number,
  height: number,
}

type GameData = {
  ball: Ball,
  paddle: Paddle
}

type Paddle = {
  height: number,
  width: number,
  position: Position
}

const KEYBOARD_ARROW_LEFT_CODE = "ArrowLeft"
const KEYBOARD_ARROW_RIGHT_CODE = "ArrowRight"

const startGame = (): void => {
  const canvasConfig: CanvasConfig = {
    width: 680,
    height: 440
  }

  let state: GameData = {
    isGameOver: false,
    control: {
      leftPressted: false,
      rightPressted: false,
    },
    paddle: {
      height: 10,
      width: 75,
      position: {
        x: (canvasConfig.width - 75) / 2,
        y: (canvasConfig.height - 20),
      }
    },
    ball: {
      radius: 10,
      position: {
        x: canvasConfig.width / 2,
        y: canvasConfig.height - 30,
      },
      direction: {dx: 4, dy: -4}
    }
  }


  const root = document.querySelector<HTMLDivElement>(('#app'))!
  root.innerHTML = '';
  const canvas = makeCanvas(canvasConfig)
  const ctx = canvas.getContext('2d')!
  root.append(canvas)

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key == KEYBOARD_ARROW_RIGHT_CODE) {
      state.control.rightPressed = true;
    } else if (e.key == KEYBOARD_ARROW_LEFT_CODE) {
      state.control.leftPressed = true;
    }
  }, false);

  document.addEventListener("keyup", (e: KeyboardEvent) => {
  if (e.key == KEYBOARD_ARROW_RIGHT_CODE) {
    state.control.rightPressed = false;
  } else if (e.key == KEYBOARD_ARROW_LEFT_CODE) {
    state.control.leftPressed = false;
  }
}, false);

  let interval: number;
  interval = setInterval(function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBall(ctx, state.ball)
    drawPaddle(ctx, state.paddle)

    moveBall(state.ball)
    movePaddle(state.paddle, state.control, canvasConfig)
    bounce(state.ball, state.paddle, canvasConfig)

  const bottomSide = canvasConfig.height - state.ball.radius
    if (state.ball.position.y > bottomSide) {
      clearInterval(interval)
      const playAgain = confirm('Game Over. Play again?')
      if (playAgain) {
        startGame()
      }
    }
    console.log(state.ball.position)
  }, 16.7) // 60 frames per sec
}

const makeCanvas = (config: CanvasConfig): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', config.width.toString())
  canvas.setAttribute('height', config.height.toString())

  return canvas
}

const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
  ctx.beginPath();
  ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

const drawPaddle = (ctx: CanvasRenderingContext2D, paddle: Paddle) => {
  ctx.beginPath();
  ctx.rect(paddle.position.x, paddle.position.y, paddle.width, paddle.height);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

export default startGame;

const moveBall = (ball: Ball): void => {
  ball.position.x += ball.direction.dx
  ball.position.y += ball.direction.dy
}

const bounce = (ball: Ball, paddle: Paddle, canvasConfig: CanvasConfig) => {
  const { position, direction } = ball;

  const nextPosition: Position = {
    x: position.x + direction.dx,
    y: position.y + direction.dy,
  }

  const bottomSide = canvasConfig.height - ball.radius
  const topSide = ball.radius
  const leftSide = ball.radius
  const rightSide = canvasConfig.width - ball.radius

  if ((nextPosition.x >= rightSide) || (nextPosition.x <= leftSide)) {
    direction.dx = -(direction.dx)
  }

  // if ((nextPosition.y >= bottomSide) || (nextPosition.y <= topSide)) {
  if (nextPosition.y <= topSide) {
    direction.dy = -(direction.dy)
  }

  // return

  const ballBetweenPaddleSides = (nextPosition.x >= paddle.position.x) 
    && nextPosition.x <= (paddle.position.x + paddle.width)
  
  if ((nextPosition.y > paddle.position.y) && ballBetweenPaddleSides) {

    direction.dy = -(direction.dy)
  }
}

const movePaddle = (paddle: Paddle, control: any, canvasConfig: CanvasConfig) => {
  const positionX  = paddle.position.x;
  const leftBorder = 0;
  const rightBorder = canvasConfig.width - paddle.width;

  if (control.rightPressed && (positionX <= rightBorder)) {
    paddle.position.x += 7
  }
  if (control.leftPressed && (positionX >= leftBorder)) {
    paddle.position.x += -7
  }
}

// const inRadius = (point, circumference) => {
//   // Формула для определения принадлежности точки к окружности, если она задана координатами (x; y), 
//   // может быть такой: координаты точки должны удовлетворять условию
//   // (x-x0)^2+(y-y0)^2 <= R^2, где точка (х0, у0) — центр окружности, R — её радиус.
//   return ((point.x - circumference.x) ** 2 + (point.y - circumference.y) ** 2) <= (circumference.radius ** 2)
// }

const inCanvas = (position: Position, canvasConfig: CanvasConfig): boolean => {
  // console.log(position)
  if (position.x < 0 || (position.x >= canvasConfig.width)) {
    return false;
  }

  if (position.y < 0 || (position.y >= canvasConfig.height)) {
    return false;
  }

  return true;
}
