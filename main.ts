wraplogger.createBufferWithColumns("x")
for (let index = 0; index < 4; index++) {
    wraplogger.logData(wraplogger.createCV("x", 0))
}
wraplogger.saveBuffer()
basic.showIcon(IconNames.Heart)
