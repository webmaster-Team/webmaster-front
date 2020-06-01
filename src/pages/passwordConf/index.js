/*
 * @Author: Daniel
 * @LastEditTime: 2020-06-01 17:50:17
 * @FilePath: /webmaster-front/src/pages/passwordConf/index.js
 */ 
import React from 'react'
import Circle from '../../components/common/circle'
import styled from 'styled-components'
import './style.styl'
import { Formik } from 'formik';
import * as Yup from 'yup';
const img = require('./conf/img.json')

/**
 * @description 忘记密码
 * 
 */

const PasswordFormSchema = Yup.object().Shape({
    account: Yup.string()
    .required('请输入学号')
    .matches(/^[0-9]+$/, '学号只包含数字')
    .length(13, '学号位数应该是13位的')
})

const PasswordConf = () => {

    /**
     * @description 右上蓝圈
     */
    let Bigcircle = (
        <div className="bigCircle" style={{
            transform: 'scale(2)',
            position: 'absolute',
            right: '-100px',
            top: '0',
        }}>
            <Circle color="#0082fe" innerColor="#ffffff" />
        </div>
    )

    /**
     * @description 左下绿圈
     */
    let SmallCircle = (
        <div className="smallCircle" style={{
            transform: 'scale(1.5)',
            position: 'absolute',
            left: '-120px',
            bottom: '-120px'
        }}>
            <Circle color="#8cc63e" innerColor="#ffffff" />
        </div>
    )
    
    /**
     * @description 轮播
     * @todo 轮播动画完善
     */
    let Roller = (
        <div className="swiper-container">
            <div className="swiper-wrapper">
                {img.imgdatas.map((item, index) => {
                    return (
                        <div className="swiper-slide" key={index}>
                            <div className="swiper-title">{item.title}</div>
                            {item.text.map((item, index) => {
                                return (
                                    <div key={index} className="swiper-text">
                                        {item}
                                    </div>
                                )
                            })}
                            <img
                            alt="显示"
                            className="swiper-picture"
                            src={item.picture}
                            />
                        </div>
                    )
                })}
            </div>
            <div className="swiper-pagination"></div>
        </div>
    )

    /**
     * @description 表单
     */
    let PasswordForm = (
        <Formik 
        initialValues={{
            account: ''
        }} 
        validationSchema={PasswordFormSchema}
        onSubmit={() => {}}
        >
            
        </Formik>
    )
    
    /**
     * @description 中心卡片div
     */
    let Center = (
        <div className="buttom-box">
            <div className="card">
                {Roller}
            </div>
            <div className="form">
                <div className="form-title">用户注册</div>
                {PasswordForm}
            </div>
        </div>
    )
    
    
    return (
        <div className="forgot-password-wrapper">
            {Bigcircle}
            {SmallCircle}
            {Center}
        </div>
    )
}

export default PasswordConf