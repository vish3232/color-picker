import React,{useState, useRef, useEffect} from 'react'
import './ColorPickerDesign.css'
import Picker from './Picker'
import config from "./config"
import Square from "./Square"
import styled from "styled-components"
import throttle from "lodash.throttle"
import { convertRGBtoHSL } from "./utils"
import Svg from "./Svg"
import usePaintSquare from "./usePaintSquare"
import Hue from './Hue'

const { squareSize, barSize, crossSize, inputSize,delay } = config
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
const ColorPickerDesign=(
    
)=>{
//drag code
const elemRef = useRef(null)
  const dragProps = useRef()
  const parentRef=useRef(null)
  
  const initialiseDrag = event => {
    const { target, clientX, clientY } = event
    const { offsetTop, offsetLeft } = target
    const { left, top } = elemRef.current.getBoundingClientRect()
   // console.log(left,top);
    
    dragProps.current = {
      dragStartLeft: left ,
      dragStartTop: top ,
      dragStartX: clientX,
      dragStartY: clientY
    }
   

    window.addEventListener('mousemove', startDragging, false)
    window.addEventListener('mouseup', stopDragging, false)

  }
  
  
  const startDragging = ({ clientX, clientY }) => {  
    var parentPos = parentRef.current.getBoundingClientRect()
    const childPos = elemRef.current.getBoundingClientRect()
    console.log(dragProps.current.dragStartLeft);
//console.log(parentPos);
if(childPos.left>=parentPos.left&&childPos.top>=parentPos.top&&childPos.right<=parentPos.right&&childPos.bottom<=parentPos.bottom){

    elemRef.current.style.transform = `translate(${dragProps.current.dragStartLeft + clientX - dragProps.current.dragStartX}px, ${dragProps.current.dragStartTop + clientY - dragProps.current.dragStartY}px)`
}else{
  
}
  } 

  const stopDragging = () => {
    window.removeEventListener('mousemove', startDragging, false)
    window.removeEventListener('mouseup', stopDragging, false)
  }


    const [show, setShow] = useState(true)
  const [hue, setHue] = useState(180)
  const [hueX, setHueX] = useState(() => squareSize / 2 - barSize / 2)
  const [square, setSquare] = useState([100, 50])
  const [squareXY, setSquareXY] = useState(() => [
    squareSize - crossSize / 2,
    crossSize / -2
  ])
  const [offsetTop, setOffsetTop] = useState(0)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const [color, setColor] = useState(`hsla(180, 100%, 50%, 1)`)
  const [animate, setAnimate] = useState(false)
  const [hexCode,sethexCode]=useState('#FF8A25')
  const [rgb,setrgb]=useState('255, 138, 37')
  const [hsl,sethsl]=useState('28, 100%, 57%')
  const [selectedColorType,setselectedColorType]=useState('hexcode')
  const [selectedColorTypeModal,setselectedColorTypeModal]=useState(false)
  const [transparency,settransparency]=useState(100)
  const [transparencyToHex,settransparencyToHex]=useState(null)
  
useEffect(() => {
    function setOffsets() {
      setOffsetTop(modal.current.offsetTop)
      setOffsetLeft(modal.current.offsetLeft)
    }
    if (show) {
      setOffsets()
      window.addEventListener("resize", setOffsets)
    } else {
      window.removeEventListener("resize", setOffsets)
    }

    return () => {
      window.removeEventListener("resize", setOffsets)
    }
  }, [show])

  useEffect(() => {
    setColor(`hsla(${hue}, ${square[0]}%, ${square[1]}%, 1)`)
  }, [hue, square])


   const square1 = useRef(null)
  
  const canvas = useRef(null)
  const modal = useRef(null)


  usePaintSquare(canvas, hue)

  useEffect(() => {
    const canvasRef = canvas.current
    const ctx = canvasRef.getContext("2d")

    function computePosition(e) {
      var x2 = e.offsetX ;
      var y2 = e.offsetY ;
       
      //   const x = Math.max(
      //   crossSize / -2,
      //   Math.min(
      //     e.clientX - offsetLeft + squareSize / 2 - crossSize / 2,
      //     squareSize - crossSize / 2
      //   )
      // )
      // const y = Math.max(
      //   crossSize / -2,
      //   Math.min(
      //     e.clientY -
      //       offsetTop +
      //       squareSize / 2 +
      //       barSize / 2 +
      //       inputSize / 2 -
      //       crossSize / 2,
      //     squareSize - crossSize / 2
      //   )
      // )

      return [x2, y2]
    }
    

    

    function changeColor(e) {
      const [x, y] = computePosition(e)
      const x1 = Math.min(x + crossSize / 2, squareSize - 1)
      const y1 = Math.min(y + crossSize / 2, squareSize - 1)
      const [r, g, b] = ctx.getImageData(x1, y1, 1, 1).data
      sethexCode(rgbToHex(r, g,b))
      setrgb(`${r},${g},${b}`)
      
      const [h, s, l] = convertRGBtoHSL([r, g, b])
      sethsl(`${h},${s}%,${l}%`)
      setSquare([s, l])
      setSquareXY([x-7, y-7])
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

  const percentToHex = (p) => {
    const intValue = Math.round(p / 100 * 255); // map percent to nearest integer (0 - 255)
    const hexValue = intValue.toString(16); // get hexadecimal representation
    return hexValue.padStart(2, '0').toUpperCase(); // format with leading 0 and upper case characters
}

    const data=[{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9}]

    return(
        <div ref={parentRef} style={{width:600,height:800,backgroundColor:'red'}} onMouseDown={initialiseDrag} >
        <div
        
        ref={elemRef}
        className="color-picker-main-container" >
            <div className="dropdown-icons-container" >
                <div className="dropdown-container" >
                   <div className="dropdown-container-header" > Solid</div>
                   <div><i class="material-icons dropdown-icon">expand_more</i></div>
                </div>

                <div className="icons-container" >
                <div><i class="material-icons">create</i></div>
                <div><i class="material-icons">close</i></div>
                </div>
            </div>

            <div ref={modal} className="color-picker-container" >
            <SquareWrapper ref={square1}>
            <Cross top={squareXY[1]} left={squareXY[0]} animate={animate}>
        <Svg name="cross" />
      </Cross>
   
            <Canvas ref={canvas} />
            </SquareWrapper>
    
      
            </div>

            <div className="hue-container" >
            <Hue
                hueX={hueX}
                offsetLeft={offsetLeft}
                animate={animate}
                setHueX={setHueX}
                setHue={setHue}
                setAnimate={setAnimate}
              />
            </div>

            <div onMouseDown={(e)=>{
              
              if((((e.clientX-20)*100)/245)<=100&&(((e.clientX-20)*100)/245)>=0){
                settransparency((((e.clientX-20)*100)/245).toFixed(0))
               settransparencyToHex(percentToHex((((e.clientX-20)*100)/245).toFixed(0)))
            }}} className="transparancy-container" >
              <div style={{position:'absolute',left:`${transparency-2}%`,backgroundColor:'orange',width:10,height:10,borderRadius:5}} >

              </div>

            </div>

            <div className="hex-code-and-tranparency-container" >
                <div  className="hex-code-container" >
                    {selectedColorType==="hexcode"?
                      <input className='rgb-hex-hcl-input' type="text" value={hexCode.toString()} onChange={(e)=>sethexCode(e.target.value)} />:<></>
                    }
                    {selectedColorType==="hsl"?
                      <input className='rgb-hex-hcl-input' type="text" value={hsl.toString()} onChange={(e)=>sethsl(e.target.value)} />:<></>
                    }
                    {selectedColorType==="rgb"?
                      <input className='rgb-hex-hcl-input' type="text" value={rgb.toString()} onChange={(e)=>setrgb(e.target.value)} />:<></>
                    }
                    <div onClick={()=>setselectedColorTypeModal(!selectedColorTypeModal)}><i class="material-icons dropdown-icon">expand_more</i></div>
                   

                </div>
                <div className="transparancy-header-container" >
                    <div className="transparancy-header" >
                      <input className='transparancy-input' type="text" value={transparency.toString()} onChange={(e)=>{
                        if(e.target.value>=0&&e.target.value<=100){
                        settransparency((e.target.value));settransparencyToHex(percentToHex(e.target.value))
                        }
                        }} />
                      <div style={{marginLeft:5}} >%</div>
                      </div>
                </div>
            </div>
            {selectedColorTypeModal?
                    <div className='rgb-hex-hcl-container' >
                      <div onClick={()=>{setselectedColorType("rgb")}} className={selectedColorType==="rgb"?'selected-type-header':""} >rgb</div>
                      <div onClick={()=>{setselectedColorType("hsl")}} className={selectedColorType==="hsl"?'selected-type-header':""} >hcl</div>
                      <div onClick={()=>{setselectedColorType("hexcode")}} className={selectedColorType==="hexcode"?'selected-type-header':""}  >hexcode</div>
                    </div>:<></>
                   }

           
            <div className="Tint-header" >
            Tints
            </div>

            <div className="tint-main-container" >
                {
                    data.map((data)=>{
                      if(selectedColorType==="hexcode"){
                        return(

                            <div style={{backgroundColor: hexCode+`${transparencyToHex===null?"":transparencyToHex}`}} className="tint-color-container" ></div>
                        )
                      }
                      if(selectedColorType==="hsl"){
                        return(

                            <div style={{backgroundColor: `hsl( ${hsl})`}} className="tint-color-container" ></div>
                        )
                      }
                      if(selectedColorType==="rgb"){
                        return(

                            <div style={{backgroundColor:`RGB( ${rgb})`}} className="tint-color-container" ></div>
                        )
                      }
                    })
                  
                }
            </div>   

            <div className="Shades-header" >
                Shades
            </div>         

            <div className="Shades-main-container" >
                {
                    data.map((data)=>{
                      if(selectedColorType==="hexcode"){
                        return(

                            <div style={{backgroundColor: hexCode+`${transparencyToHex===null?"":transparencyToHex}`}} className="Shades-color-container" ></div>
                        )
                      }
                      if(selectedColorType==="hsl"){
                        return(

                            <div style={{backgroundColor: `hsl( ${hsl})`}} className="Shades-color-container" ></div>
                        )
                      }
                      if(selectedColorType==="rgb"){
                        return(

                            <div style={{backgroundColor:`RGB( ${rgb})`}} className="Shades-color-container" ></div>
                        )
                      }
                      
                    })
                }
            </div>   



        </div>
        </div>
        
    )
}

export default ColorPickerDesign