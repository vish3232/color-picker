import React from "react"
import ReactDOM from "react-dom"
import styled from "styled-components"
import Picker from "./Picker"
import { GlobalStyle } from "./GlobalStyle"
import ColorPickerDesign from "./ColorPickerDesign"

const AppWrapper = styled.div`
  height: 100vh;
  display: grid;
  align-items: center;
  justify-items: center;
`

function App() {
  return (
    <>
    <ColorPickerDesign/>
    </>
  )
}

const rootElement = document.getElementById("root")
ReactDOM.render(<App />, rootElement)
