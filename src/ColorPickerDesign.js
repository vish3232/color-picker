import React from 'react'
import './ColorPickerDesign.css'
const ColorPickerDesign=()=>{
    const data=[{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9}]

    return(
        <div className="color-picker-main-container" >
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

            <div className="color-picker-container" >

            </div>

            <div className="hue-container" >

            </div>

            <div className="transparancy-container" >

            </div>

            <div className="hex-code-and-tranparency-container" >
                <div className="hex-code-container" >
                    <div className="hex-code-header" >#FF8A25</div>
                    <div><i class="material-icons dropdown-icon">expand_more</i></div>
               
                </div>
                <div className="transparancy-header-container" >
                    <div className="transparancy-header" >100%</div>
                </div>
            </div>

            <div className="Tint-header" >
            Tints
            </div>

            <div className="tint-main-container" >
                {
                    data.map((data)=>{
                        return(
                            <div className="tint-color-container" ></div>
                        )
                    })
                }
            </div>   

            <div className="Shades-header" >
                Shades
            </div>         

            <div className="Shades-main-container" >
                {
                    data.map((data)=>{
                        return(
                            <div className="Shades-color-container" ></div>
                        )
                    })
                }
            </div>   



        </div>
    )
}

export default ColorPickerDesign