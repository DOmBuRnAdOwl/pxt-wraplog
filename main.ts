let arr = [];
for(let i=0;i<40;i++){
  let c = pins.createBuffer(10900);
  c.fill(0);
}

for(let i=0;i<20;i++){
  let c = pins.createBuffer(11000);
  c.fill(0);
  basic.pause(50)
  basic.showLeds(`
      # # # # .
      # # # # .
      # # # # .
      # # # # .
      # # # # .
      `)
  basic.pause(50)
  basic.showLeds(`
      # # # . #
      # # # . #
      # # # . #
      # # # . #
      # # # . #
      `)
}


// let c = pins.createBuffer(10900);
// let c = pins.createBuffer(11000);
basic.pause(2000)
basic.showLeds(`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)

// let e = pins.createBuffer(11000);
// e.fill(0)
// basic.pause(2000)
// basic.showLeds(`
//     # # # # #
//     # # # # #
//     # # # # #
//     # # # # #
//     # # # # .
//     `)

basic.pause(20000)

basic.showLeds(`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)

// wraplogger.createBufferWithColumns(
// "x",
// "y"
// )
// basic.showIcon(IconNames.Heart)
// for (let index = 0; index < 50; index++) {
//     wraplogger.logData(
//     wraplogger.createCV("x", input.acceleration(Dimension.X)),
//     wraplogger.createCV("y", input.acceleration(Dimension.Y))
//     )
//     basic.pause(20)
// }
// basic.showLeds(`
//     . . . . .
//     . . . . .
//     . . # . .
//     . . . . .
//     . . . . .
//     `)
// wraplogger.saveBuffer()
// basic.showLeds(`
//     # # # # #
//     # # # # #
//     # # # # #
//     # # # # #
//     # # # # #
//     `)
