import React from 'react';
import {Modal, Input, Form} from 'antd';

class EditPasswordModal extends React.Component {
  formRef = React.createRef();
  state = {
    visible: false
  };
  handleCancel = () => {
    this.formRef.current.resetFields();
    this.toggleVisible(false);
  };
  handleOk = () => {
    this.formRef.current.validateFields((err, values) => {
      if (!err) {
        this.handleCancel();
      }
    });
  };
  toggleVisible = (visible) => {
    this.setState({
      visible
    });
  };

  render() {
    const {visible} = this.state;
    // const { getFieldDecorator, getFieldValue } =  this.formRef.current;

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14}
    };
    return (
      <Modal
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        visible={visible}
        title="修改密码">
        <Form ref={this.formRef}>
          <Form.Item label={'用户名'} {...formItemLayout}>
            <Input disabled/>
          </Form.Item>
          <Form.Item name="oldPassword" label={'旧密码'} {...formItemLayout} hasFeedback>
            <Input
              placeholder="请输入旧密码"
              type={'password'}/>
          </Form.Item>
          <Form.Item name="newPassword" label={'新密码'} {...formItemLayout} hasFeedback>
            <Input
              placeholder="请输入新密码"
              type={'password'}/>
          </Form.Item>
          <Form.Item name="confirm"
                     label={'确认密码'}
                     {...formItemLayout}
                     hasFeedback
                     rules={[
                       {
                         required: true,
                         message: '请确认您的密码'
                       },
                       ({getFieldValue}) => ({
                         validator(rule, value) {
                           if (!value || getFieldValue('newPassword') === value) {
                             return Promise.resolve();
                           }
                           return Promise.reject('两次输入密码不一致');
                         }
                       })
                     ]}
          >

            <Input
              placeholder="请确认密码"
              type={'password'}/>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditPasswordModal;
