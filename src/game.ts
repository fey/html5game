
const startGame = (): void => {
  const state = {
  }
  const root = document.querySelector<HTMLDivElement>(('#app'))!
  const canvas = makeCanvas()
  const ctx = canvas.getContext('2d')!
  root.append(canvas)

  const ballPosition = {
    x: canvas.width / 2,
    y: canvas.height - 30,
  }

  setInterval(() => {
    ctx.clearRect(0, 0, 480, 320);

    drawBall(ctx, ballPosition)

    ballPosition.x += 2
    ballPosition.y += -2
  }, 16.7) // 60 frames per sec
}

const makeCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', '480')
  canvas.setAttribute('height', '320')

  return canvas
}

const drawBall = (ctx: CanvasRenderingContext2D, { x, y}) => {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

export default startGame;
