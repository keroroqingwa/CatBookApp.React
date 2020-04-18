import React from 'react';
import { Form, Modal, Input } from 'antd';

const FormItem = Form.Item;

// 喵币充值的弹窗
const FormByAddCurrency = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      title="赠送喵币"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="喵币数量">
        {form.getFieldDecorator('Currency', {
          rules: [{ required: true, message: '不能为空' }],
        })(<Input placeholder="请输入要赠送的数量" />)}
      </FormItem>
    </Modal>
  );
});

export default FormByAddCurrency;
