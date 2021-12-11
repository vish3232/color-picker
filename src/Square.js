import React, { useRef, useEffect } from "react"
import styled from "styled-components"
import throttle from "lodash.throttle"
import { convertRGBtoHSL } from "./utils"
import Svg from "./Svg"
import usePaintSquare from "./usePaintSquare"
import config from "./config"

const { squareSize, barSize, crossSize, inputSize, delay } = config

export const SquareWrapper = styled.div`
  position: relative;
  width: ${squareSize + "px"};
  height: ${squareSize + "px"};
  cursor: crosshair;
`

export const Canvas = styled.canvas.attrs(p => ({
  width: squareSize,
  height: squareSize
}))``

export const Cross = styled.div.attrs(p => ({
  style: {
    top: p.top + "px",
    left: p.left + "px",
    width: crossSize + "px",
    height: crossSize + "px",
    transition: p.animate ? "top .2s ease-out, left .2s ease-out" : "0s"
  }
}))`
  position: absolute;
  display: grid;
  justify-items: center;
  align-items: center;
  svg {
    width: 100%;
    height: 100%;
  }
`

const Square = ({
  hue,
  squareXY,
  animate,
  setSquare,
  offsetTop,
  offsetLeft,
  setSquareXY,
  setAnimate
}) => {
  const square = useRef(null)
  const canvas = useRef(null)

  usePaintSquare(canvas, hue)

  useEffect(() => {
    const canvasRef = canvas.current
    const ctx = canvasRef.getContext("2d")

    function computePosition(e) {
     
      const x = Math.max(
        crossSize / -2,
        Math.min(
          e.clientX - offsetLeft + squareSize / 2 - crossSize / 2,
          squareSize - crossSize / 2
        )
      )
      const y = Math.max(
        crossSize / -2,
        Math.min(
          e.clientY -
            offsetTop +
            squareSize / 2 +
            barSize / 2 +
            inputSize / 2 -
            crossSize / 2,
          squareSize - crossSize / 2
        )
      )

      return [x, y]
    }

    function changeColor(e) {
      const [x, y] = computePosition(e)
      const x1 = Math.min(x + crossSize / 2, squareSize - 1)
      const y1 = Math.min(y + crossSize / 2, squareSize - 1)
      const [r, g, b] = ctx.getImageData(x1, y1, 1, 1).data
      const [h, s, l] = convertRGBtoHSL([r, g, b])
      setSquare([s, l])
      setSquareXY([x, y])
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
      

    const onMouseMove = throttle(e => {
      changeColor(e)
    }, delay)

    function onMouseUp(e) {
      changeColor(e)
      document.body.removeEventListener("mousemove", onMouseMove)
      document.body.removeEventListener("mouseup", onMouseUp)
    }

    function onMouseDown(e) {
      setAnimate(false)
      document.body.addEventListener("mousemove", onMouseMove)
      document.body.addEventListener("mouseup", onMouseUp)
    }

    canvasRef.addEventListener("mousedown", onMouseDown)

    return () => {
      canvasRef.removeEventListener("mousedown", onMouseDown)
    }
  }, [offsetTop, offsetLeft, setSquare, setSquareXY, setAnimate])

  return (
    <SquareWrapper ref={square}>
      <Cross top={squareXY[1]} left={squareXY[0]} animate={animate}>
        <Svg name="cross" />
      </Cross>
      <Canvas ref={canvas} />
    </SquareWrapper>
  )
}

export default Square
