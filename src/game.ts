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
}

type CanvasConfig = {
  width: number,
  height: number,
}

type GameData = {
  ball: Ball
}

const startGame = (): void => {
  const canvasConfig: CanvasConfig = {
    width: 480,
    height: 320
  }

  const root = document.querySelector<HTMLDivElement>(('#app'))!
  const canvas = makeCanvas(canvasConfig)
  const ctx = canvas.getContext('2d')!
  root.append(canvas)

  const state: GameData = {
    ball: {
      radius: 10,
      position: {
        x: canvas.width / 2,
        y: canvas.height - 30,
      }
    }
  }

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.height, canvas.width);

    drawBall(ctx, state.ball)

    move(state.ball, {dx: 2, dy: -2})
  }, 16.7) // 60 frames per sec
  setInterval(() => {
    console.log(state.ball.position.y)
  }, 1000)
}

const makeCanvas = (config): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', config.width)
  canvas.setAttribute('height', config.height)

  return canvas
}

const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
  const { position } = ball;

  ctx.beginPath();
  ctx.arc(position.x, position.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

export default startGame;



const draw = (canvas: HTMLCanvasElement, state: object): void => {

}

const move = (figure: any, direction: Direction): void => {
  figure.position += direction.dx
  figure.position += direction.dy
}
