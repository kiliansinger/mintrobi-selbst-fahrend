input.onSound(DetectedSound.Loud, function () {
    if (clapped == 0) {
        clapped = 1
        JoyCar.stop(StopIntensity.Intense)
        basic.pause(1000)
    } else {
        clapped = 0
    }
})
let licht = 0
let clapped = 0
bluetooth.startUartService()
basic.showLeds(`
    # # . # #
    # # . # #
    . . . . .
    # . . . #
    . # # # .
    `)
music.playSoundEffect(music.createSoundEffect(WaveShape.Noise, 1220, 1219, 255, 0, 1008, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), SoundExpressionPlayMode.UntilDone)
clapped = 0
let servo = 100
let ref = (input.lightLevel() + 255) / 2
basic.forever(function () {
    if (input.lightLevel() < ref) {
        licht = 1
    } else {
        if (licht == 1) {
            if (input.lightLevel() > ref) {
                licht = 0
                if (clapped == 0) {
                    clapped = 1
                } else {
                    basic.showLeds(`
                        # # . # #
                        # # . # #
                        . . . . .
                        # . . . #
                        . # # # .
                        `)
                    clapped = 0
                }
            }
        }
    }
    if (clapped == 0) {
        JoyCar.servo(1, 90)
        if (JoyCar.sonar() > 30) {
            if (JoyCar.obstacleavoidance(SensorLRSelection.Left)) {
                bluetooth.uartWriteString("l")
                JoyCar.turn(
                FRDirection.Forward,
                LRDirection.Right,
                50,
                0
                )
            } else {
                if (JoyCar.obstacleavoidance(SensorLRSelection.Right)) {
                    bluetooth.uartWriteString("r")
                    JoyCar.turn(
                    FRDirection.Forward,
                    LRDirection.Left,
                    50,
                    0
                    )
                } else {
                    JoyCar.drive(FRDirection.Forward, 50)
                }
            }
        } else {
            JoyCar.stop(StopIntensity.Intense)
            music.playSoundEffect(music.createSoundEffect(WaveShape.Square, 1600, 1, 255, 0, 300, SoundExpressionEffect.None, InterpolationCurve.Curve), SoundExpressionPlayMode.UntilDone)
            JoyCar.servo(1, servo)
            if (servo == 100) {
                servo = 80
            } else {
                servo = 100
            }
        }
    } else {
        JoyCar.stop(StopIntensity.Intense)
        basic.showLeds(`
            . . . . .
            # # . # #
            . . . . .
            . # # # .
            . . . . .
            `)
    }
})
