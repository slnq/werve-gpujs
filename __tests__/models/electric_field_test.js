// __test__/models/template_test.js
/* eslint-disable no-alert, no-console, no-undef */

const ElectricField = require('sotuken_js/src/models/electric_field.js')

describe('ElectricField', () => {
  let a
  beforeEach(() => {
    a = new ElectricField(3, 3)
  })

  test('オブジェクトが生成できること', () => {
    expect(a).not.toBe(null)
  })

  test('値が正しく計算されること', () => {
    const k = 9E+9
    // const ansX = [-2.0, -1.0, 0.0, 1.0, 2.0].map(y => [-2.0, -1.0, 0.0, 1.0, 2.0].map(x => new Float32Array(k * x / Math.sqrt((x * x + y * y) * (x * x + y * y) * (x * x + y * y)))))
    const ansX = [-2.0, -1.0, 0.0, 1.0, 2.0].map(y => [-2.0, -1.0, 0.0, 1.0, 2.0].map(x => k * x / Math.sqrt((x * x + y * y) * (x * x + y * y) * (x * x + y * y))))
    // const ansY = [-2.0, -1.0, 0.0, 1.0, 2.0].map(y => [-2.0, -1.0, 0.0, 1.0, 2.0].map(x => new Float32Array(k * y / Math.sqrt((x * x + y * y) * (x * x + y * y) * (x * x + y * y)))))
    const ansY = [-2.0, -1.0, 0.0, 1.0, 2.0].map(y => [-2.0, -1.0, 0.0, 1.0, 2.0].map(x => k * y / Math.sqrt((x * x + y * y) * (x * x + y * y) * (x * x + y * y))))
    ansX[2][2] = 0.0
    ansY[2][2] = 0.0
    a.createTemplate()
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        expect(a.buffer_x[i][j] / 100000).toBeCloseTo(ansX[i][j] / 100000, 1)
        expect(a.buffer_y[i][j] / 100000).toBeCloseTo(ansY[i][j] / 100000, 1)
      }
    }
  })

  test('0配列を作成する', () => {
    a.fillZero()
    expect(a.buffer_x).toEqual(new Array(3).fill(new Array(3).fill(0.0)))
    expect(a.buffer_y).toEqual(new Array(3).fill(new Array(3).fill(0.0)))
  })

  test('重ね合わせができていること', () => {
    template = new ElectricField(3, 3)
    template.buffer_x = [-2.0, -1.0, 0.0, 1.0, 2.0].map(y => [-2.0, -1.0, 0.0, 1.0, 2.0].map(x => x))
    template.buffer_y = [-2.0, -1.0, 0.0, 1.0, 2.0].map(y => [-2.0, -1.0, 0.0, 1.0, 2.0].map(x => y))
    a.fillZero()
    a.plusTemplate(template, 2, 1)
    expect(a.buffer_x).toEqual([-1.0, 0.0, 1.0].map(y => new Float32Array([0.0, 1.0, 2.0].map(x => x))))
    expect(a.buffer_y).toEqual([-1.0, 0.0, 1.0].map(y => new Float32Array([0.0, 1.0, 2.0].map(x => y))))
  })

  test('色の値に変換', () => {
    a.fillZero()
    a.plusTemplate(template, 2, 1)
    a.createAbsPhase()
    // rgb255に収めるように配列全体の最大値で割って255を掛けている
    const DivMaxMul255 = 1 / 2 * 255
    expect(a.buffer_x).toEqual([-1.0, 0.0, 1.0].map(y => new Float32Array([0.0, 1.0, 2.0].map(x => x * DivMaxMul255))))
    expect(a.buffer_y).toEqual([-1.0, 0.0, 1.0].map(y => new Float32Array([0.0, 1.0, 2.0].map(x => y * DivMaxMul255))))
  })
})