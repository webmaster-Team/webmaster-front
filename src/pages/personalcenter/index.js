/*
 * @Author: Daniel
 * @LastEditTime: 2020-05-25 12:11:58
 * @FilePath: /webmaster-front/src/pages/personalcenter/Index.js
 */ 
import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Container from './Container'
import './style.styl'

class PersonalCenter extends Component{

    constructor(props){
        super(props)
    }

    componentDidMount(){
        
    }

    render(){
        return(
            <div className="center" style={{minHeight: '100%'}}>
                <Container />
            </div>
        )
    }
    
}

const mapState = (state) => {
    return {
        
    }
}
  
const mapDispatch = (dispatch) => ({

})

export default PersonalCenter;