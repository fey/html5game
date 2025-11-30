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

  const root = document.querySelector<HTMLDivElement>(('#app'))!
  const canvas = makeCanvas(canvasConfig)
  const ctx = canvas.getContext('2d')!
  root.append(canvas)

  const state: GameData = {
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
        x: canvas.width / 2,
        y: canvas.height - 30,
      },
      direction: {dx: 4, dy: -4}
    }
  }

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key == KEYBOARD_ARROW_RIGHT_CODE) {
      state.control.rightPressed = true;
    } else if (e.key == KEYBOARD_ARROW_LEFT_CODE) {
      state.control.leftPressed = true;
    }
  }, false);

  document.addEventListener("keyup", (e: Event) => {
  if (e.key == KEYBOARD_ARROW_RIGHT_CODE) {
    state.control.rightPressed = false;
  } else if (e.key == KEYBOARD_ARROW_LEFT_CODE) {
    state.control.leftPressed = false;
  }
}, false);

  console.log(state)
  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall(ctx, state.ball)
    drawPaddle(ctx, state.paddle)

    move(state.ball)
    movePaddle(state.paddle, state.control, canvasConfig)
    bounce(state.ball, canvasConfig)
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

const move = (ball: Ball): void => {
  ball.position.x += ball.direction.dx
  ball.position.y += ball.direction.dy
}

const bounce = (ball: Ball, canvasConfig: CanvasConfig) => {
  const { position, direction } = ball;

  const nextPosition: Position = {
    x: position.x + direction.dx,
    y: position.y + direction.dy,
  }

  const topBorder = canvasConfig.height - ball.radius
  const botBorder = ball.radius
  const leftBorder = ball.radius
  const rightBorder = canvasConfig.width - ball.radius

  if (nextPosition.x > rightBorder || nextPosition.x < leftBorder) {
    direction.dx = -(direction.dx)
  }

  if ((nextPosition.y > topBorder ) || nextPosition.y < botBorder) {
    direction.dy = -(direction.dy)
  }
}

const movePaddle = (paddle: Paddle, control: any, canvasConfig: CanvasConfig) => {
  const positionX  = paddle.position.x;
  const leftBorder = 0;
  const rightBorder = canvasConfig.width - paddle.width;

  if (control.rightPressed && (positionX < rightBorder)) {
    paddle.position.x += 7
  }
  if (control.leftPressed && (positionX > leftBorder)) {
    paddle.position.x += -7
  }
}

// const inRadius = (point, circumference) => {
//   // Формула для определения принадлежности точки к окружности, если она задана координатами (x; y), 
//   // может быть такой: координаты точки должны удовлетворять условию
//   // (x-x0)^2+(y-y0)^2 <= R^2, где точка (х0, у0) — центр окружности, R — её радиус.
//   return ((point.x - circumference.x) ** 2 + (point.y - circumference.y) ** 2) <= (circumference.radius ** 2)
// }
