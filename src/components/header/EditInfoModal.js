import React from 'react';
import {Modal, Form, message, Input, Button} from 'antd';

class EditInfoModal extends React.Component {

  state = {
    visible: false
  };

  formRef = React.createRef();

  // onFill = () => {
  //   this.formRef.current.setFieldsValue({
  //     username:'123',
  //     phone: 'Hello world!',
  //     email: '123',
  //   });
  // };

  handleCancel = () => {
    this.formRef.current.resetFields();
    console.log('reset');
    this.toggleVisible(false);
  };
  handleOk = () => {
    this.formRef.current.scrollToField((err, values) => {
      if (!err) {
        this.onUpdate(values);
      }
    });
  };
  toggleVisible = (visible) => {
    this.setState({
      visible
    });
  };

  checkPhone = async (rule, value) => {
    if (value === '') {
      return new Promise(((resolve, reject) => {
        reject('请输入您的手机号');
      }));
    } else if (!new RegExp('^1(3|4|5|6|7|8|9)[0-9]\\d{8}$').test(value)) {
      return new Promise(((resolve, reject) => {
        reject('手机号格式有误');
      }));
    }
  };


  render() {
    const {visible} = this.state;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14}
    };
    return (
      <Modal
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        visible={visible}
        title="编辑个人信息">
        <Form ref={this.formRef}>
          <Form.Item name="username" label={'用户名'}  {...formItemLayout} rules={[{required: true, message: '请输入用户名'}]}
                     hasFeedback>
            <Input placeholder="请输入您的用户名" disabled/>
          </Form.Item>
          <Form.Item name="phone" label={'联系方式'}  {...formItemLayout} rules={[
            {validator: this.checkPhone}, {required: true, message: '请输入手机号码'}
          ]} hasFeedback>
            <Input placeholder="请输入您的手机号码"/>
          </Form.Item>
          <Form.Item name="email" label={'邮箱'}  {...formItemLayout}
                     rules={[{type: 'email'}, {required: true, message: '请输入您的邮箱'}]} hasFeedback>
            <Input placeholder="请输入您的邮箱"/>
          </Form.Item>
          {/*<Form.Item>*/}
          {/*  <Button type="link" htmlType="button" onClick={this.onFill}>*/}
          {/*    Fill form*/}
          {/*  </Button>*/}
          {/*</Form.Item>*/}
        </Form>

      </Modal>
    );
  }
}

export default EditInfoModal;
