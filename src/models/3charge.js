export class Charge {
  constructor () {
    this.x = []
    this.y = []
    this.vx = []
    this.vy = []
    this.fx = []
    this.fy = []
    this.q = []
    this.l = 0
  }

  setElectricCharge (array) {
    this.x.push(array[0])
    this.y.push(array[1])
    this.vx.push(0)
    this.vy.push(0)
    this.fx.push(0)
    this.fy.push(0)
    this.q.push(array[2])
    this.l++
    return this
  }

  calcCoulombForce (electricFieldX, electricFieldY) {
    const q = this.q
    const x = this.x
    const y = this.y
    for (let i = 0; i < this.l; i++) {
      this.fx[i] = q[i] * electricFieldX[y[i]][x[i]]
      this.fy[i] = q[i] * electricFieldY[y[i]][x[i]]
    }
    return this
  }

  calcPositions (w, h) {
    const x = this.x
    const y = this.y
    const vx = this.vx
    const vy = this.vy
    const fx = this.fx
    const fy = this.fy
    const q = this.q.map(Math.abs)
    for (let i = 0; i < this.l; i++) {
      const CoefficientOfRestitution = -0.1
      // const t = 1 / 1000
      // const m = 1
      const t = 1 / 50000
      const m = q[i] / 500
      vx[i] = vx[i] - fx[i] / m * t
      x[i] = x[i] + Math.trunc(vx[i] * t + fx[i] / m * t * t / 2)
      if (x[i] >= w - 1) {
        vx[i] = CoefficientOfRestitution * vx[i]
        x[i] = w - 2
      } else if (x[i] <= 0) {
        vx[i] = CoefficientOfRestitution * vx[i]
        x[i] = 1
      }
      vy[i] = vy[i] - fy[i] / m * t
      y[i] = y[i] + Math.trunc(vy[i] * t + fy[i] / m * t * t / 2)
      if (y[i] >= h - 1) {
        vy[i] = CoefficientOfRestitution * vy[i]
        y[i] = h - 2
      } else if (y[i] <= 0) {
        vy[i] = CoefficientOfRestitution * vy[i]
        y[i] = 1
      }
      if (i!==0) {
        if(x[i-1] === x[i]){
          if(x[i] < w/2){
            x[i]++
          }else{
            x[i]--
          }
        }
        if(y[i-1] === y[i]){
          if(y[i] < h/2){
            y[i]++
          }else{
            y[i]--
          }
        }
        
      }
    }
    return this
  }
};