import React from 'react'
import './style.styl'
const Circle = (props) => {
  let { color, innerColor } = props
  return (
    <div className="outerCircle" style={{ backgroundColor: color }}>
      <div
        className="innerCircle"
        style={{ backgroundColor: innerColor }}
      ></div>
    </div>
  )
}

export default Circle
