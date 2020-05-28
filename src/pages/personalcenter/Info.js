/*
 * @Author: Daniel
 * @LastEditTime: 2020-05-28 14:33:57
 * @FilePath: /webmaster-front/src/pages/personalcenter/Info.js
 */ 
import React, { useState }                                          from 'react'
import { Form, Input, Button, Checkbox, Select, Descriptions }      from 'antd';
import styled                                                       from 'styled-components';
import head                                                         from '../../assets/img/head.svg';
import { HeaderLogoBig, HeadGroupStyle, HeadLabel }                 from './headerBig';
const confInfo = require('./conf/info.json');
const { Option } = Select;
const testProps = "XXX"

/**
 * @description 个人中心左侧表单
 * @todo redux逻辑添加
 */
export default function Info(){

    /**
     * 表单组的所有组件
     */
    let inputGroup = confInfo.list.map(element => (
        <Form.Item
            label={element.label}
        >
            {renderInfoList(element)}
        </Form.Item>
    ))

    
    /**
     * 
     * @param {*} event 
     */
    function onSexChange(event){
        
    }
    /**
     * @description 依据表单中所有选项的值渲染对应的元素(比如输入框、下拉框等等)
     * @param {列表中的单个选项json信息} element
     * @return {对应的元素} jsx-component
     */
    function renderInfoList(element){
        console.log(element)
        switch(element.type) {
            case "input": return (<Input placeholder={element.placeholder} />)
            case "radio": return (
                <Select
                    value={"test"}
                    style={{ width: 80, margin: '0 8px' }}
                    onChange={onSexChange}
                >
                    {element.checklist.map(opt => {
                        return <Option value={opt.key}>{opt.label}</Option>
                    })}
                </Select>
            )
            default: return (<Descriptions.Item label={element.label}>{testProps}</Descriptions.Item>)
        }
    }

    return(
        <div className="center-layout-div">
            <div className="info-card" style={{padding: '10px'}}>
                <Form style={{padding: '0px 25px'}}>
                    <HeadGroupStyle style={{marginTop: '10px', marginBottom: '25px'}}>
                        <HeaderLogoBig>
                            <img src={head} />
                        </HeaderLogoBig>
                        <HeadLabel>
                            {testProps}
                        </HeadLabel>
                    </HeadGroupStyle>
                    {inputGroup}
                    <Form.Item>
                        <Button style={{display: 'block', margin: '0 auto'}} type="primary" htmlType="submit">
                            提交修改
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )

}