import React, { Component, Fragment } from 'react';
import { Table, Card, Form, Row, Col, Input, Button, Select, Modal, Divider, message, Spin } from 'antd';
import { connect } from 'dva';
// import catConfig from '../../../config/cat.config';
import paginationConfig from '../../../config/pagination.config';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ImgUpload from '@/components/Book/ImgUpload';
import styles from '../Book/TableList.less';
// import { reset } from 'ansi-colors';

const { Option } = Select;
const FormItem = Form.Item;
const { confirm } = Modal;

// 查询列表数据url
const queryDataUrl = 'sys/getListByPage';
// 获取所有权限分组 url
const getAllAuthorityUrl = 'auth/getAllAuthority';
// 检查新增账户时的用户id是否已存在
const checkUserIdRepeatUrl = 'sys/checkUserIdRepeat';
// 新增 url
const addDataUrl = 'sys/add';
// 编辑 url
const updateDataUrl = 'sys/update';
// 删除 url
const delDataUrl = 'sys/del';
// 重置密码 url
const resetPwdUrl = 'sys/resetPwd';

// 创建表单-新增账户
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleCreateFormModalVisible, record, authority, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      handleAdd({ ...fieldsValue, Id: record ? record.Id : '' });
    });
  };
  const { getFieldProps, getFieldError, isFieldValidating } = form;

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };

  // const userExists = (rule, value, callback) => {
  //   if (!value) {
  //     callback();
  //   } else {
  //     setTimeout(() => {
  //       if (value === 'JasonWood') {
  //         // callback([new Error('抱歉，该用户名已被占用。')]);
  //         const { dispatch } = this.props;
  //         dispatch({
  //           type: checkUserIdRepeatUrl,
  //           payload: {},
  //         });
  //       } else {
  //         callback();
  //       }
  //     }, 1000 * 2);
  //   }
  // }

  const userIdProps = getFieldProps('userId', {
    rules: [
      { required: true, min: 4, message: '用户名至少为 4 个字符' },
      // { validator: userExists },
    ],
    initialValue: record ? record.userId : '',
  });

  const children = [];
  if (authority) {
    authority.forEach(item => {
      children.push(<Option key={item}>{item}</Option>);
    })
  }

  const onUploadChange = (info) => {
    const { file: { response } } = info
    // console.info('onUploadChange->response', response)
    if (response) {
      const { status, url, errmsg } = response
      if (status !== 'success') {
        message.error(`${info.file.name} 上传失败：${errmsg}`);
      }
      else {
        message.success(`${info.file.name} 上传成功.`);
        form.setFieldsValue({ 'avatar': url })
      }
    }
  }

  const onUploadRemove = (file) => {
    console.info('onUploadRemove', file)
    form.setFieldsValue({ 'avatar': '' })
  }

  return (
    <Modal
      destroyOnClose
      title={`${record ? '编辑' : '新建'}`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleCreateFormModalVisible()}
      confirmLoading={loading}
    >

      <FormItem {...formItemLayout} label="权限分组">
        {form.getFieldDecorator('Authority', {
          rules: [{ required: true, message: '请选择权限分组！' }],
          initialValue: record ? record.Authority.split(',') : [],
        })(
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder=""
          >
            {children}
          </Select>
        )}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label="用户id"
        hasFeedback
        help={isFieldValidating('userId') ? '校验中...' : (getFieldError('userId') || []).join(', ')}
      >
        <Input {...userIdProps} placeholder="" disabled={!!record} />
      </FormItem>

      <FormItem {...formItemLayout} label="昵称">
        {form.getFieldDecorator('nickName', {
          rules: [{ required: true, message: '请输入至少2个字符！', min: 2 }],
          initialValue: record ? record.nickName : '',
        })(<Input placeholder="" />)}
      </FormItem>

      <FormItem {...formItemLayout} label="密码">
        {form.getFieldDecorator('Password', {
          rules: [{ required: true, message: '请输入至少6个字符！', min: 6 }],
          initialValue: record ? '******' : '',
        })(<Input placeholder="" disabled={!!record} />)}
      </FormItem>

      <FormItem {...formItemLayout} label="头像">
        {form.getFieldDecorator('avatar', {
          // rules: [{ required: true, message: '请输入至少2个字符！', min: 2 }],
          initialValue: record ? record.avatar : '',
        })
          (
          <Input placeholder="" style={{ width: '70%', marginRight: '2px' }} />
          // <ImgUpload onChange={onUploadChange} />
          )
        }
        <ImgUpload onChange={onUploadChange} onRemove={onUploadRemove} />
      </FormItem>

      <FormItem {...formItemLayout} label="禁用">
        {form.getFieldDecorator('Disable', {
          rules: [{ required: false }],
          initialValue: `${record ? record.Disable : false}`,
        })(
          <Select>
            <Option value="true">是</Option>
            <Option value="false">否</Option>
          </Select>
        )}
      </FormItem>

    </Modal>
  );
});
// 创建表单-重置密码
const ResetPwdForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleCreateFormModalVisible, record, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      handleAdd({ ...fieldsValue, Id: record ? record.Id : '' });
    });
  };
  // const { getFieldProps, getFieldError, isFieldValidating } = form;

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };

  function validateToNextPassword(rule, value, callback) {
    // if (value) {
    //   form.validateFields(['confirm'], { force: true });
    // }
    callback();
  }

  function compareToFirstPassword(rule, value, callback) {
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }

  return (
    <Modal
      destroyOnClose
      title='重置密码'
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleCreateFormModalVisible()}
      confirmLoading={loading}
    >

      <FormItem {...formItemLayout} label="用户id">
        <span>{record ? record.userId : ''}</span>
      </FormItem>

      <FormItem
        {...formItemLayout}
        label="新密码"
      >
        {form.getFieldDecorator('password', {
          rules: [{
            required: true, message: '请输入至少6个字符！', min: 6,
          }, {
            validator: validateToNextPassword,
          }],
        })(
          <Input type="password" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="再次输入"
      >
        {form.getFieldDecorator('confirm', {
          rules: [{
            required: true, message: '请输入至少6个字符！', min: 6,
          }, {
            validator: compareToFirstPassword,
          }],
        })(
          <Input type="password" />
        )}
      </FormItem>
    </Modal>
  );
});

@Form.create()
@connect(({ sys, auth, loading }) => ({
  sys,
  auth,
  loading: loading.effects[queryDataUrl],
  loadingByAdd: loading.effects[addDataUrl],
  loadingByUpdate: loading.effects[updateDataUrl],
  loadingByDel: loading.effects[delDataUrl],
  loadingByResetPwd: loading.effects[resetPwdUrl],
}))
class TableList extends Component {
  state = {
    columns: null,
    formValues: {},
    curPn: 1,
    modalCreateFormVisible: false,
    modalResetVisible: false,
    curSelectedRow: null,
    selectedRowKeys: null,
  };

  componentDidMount() {
    this.setColumns();
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    const { loadingByAdd, loadingByUpdate, loadingByDel, loadingByResetPwd } = this.props
    const { sys: { resByAdd, resByUpdate, resByDel, resByResetPwd } } = nextProps

    // 新增操作结果
    if (resByAdd) {
      if (loadingByAdd && !nextProps.loadingByAdd) {
        message.success('新增操作成功');
        this.setState({ modalCreateFormVisible: false })
        this.loadData()
      }
    }
    // 编辑操作结果
    if (resByUpdate) {
      if (loadingByUpdate && !nextProps.loadingByUpdate) {
        const { curSelectedRow } = this.state
        curSelectedRow.Authority = resByUpdate.Authority
        curSelectedRow.nickName = resByUpdate.nickName
        curSelectedRow.Disable = resByUpdate.Disable
        curSelectedRow.avatar = resByUpdate.avatar
        message.success('编辑操作成功');
        this.setState({ modalCreateFormVisible: false })
      }
    }
    // 删除操作结果
    if (resByDel) {
      if (loadingByDel && !nextProps.loadingByDel) {
        message.success('操作成功');
        this.loadData()
        this.setState({ selectedRowKeys: null })
      }
    }
    // 重置密码操作结果
    if (resByResetPwd) {
      if (loadingByResetPwd && !nextProps.loadingByResetPwd) {
        const { curSelectedRow } = this.state
        curSelectedRow.Password = resByResetPwd.Password
        message.success('重置密码操作成功');
        this.setState({ modalResetVisible: false })
      }
    }
  }

  /**
   * 加载数据
   */
  loadData = paramsObj => {
    // 初始查询时的查询参数
    const initSearchParams = { pn: 1, ps: paginationConfig.defaultPageSize };
    const { dispatch } = this.props;
    const params = { ...initSearchParams, ...paramsObj };
    if (!params.sorter) {
      // 添加默认排序
      params.sorter = 'Create_Time_ascend'
    }
    const { pn } = params;
    this.setState({ curPn: pn });
    dispatch({
      type: queryDataUrl,
      payload: params,
    });
    dispatch({
      type: getAllAuthorityUrl,
    });
  };

  /**
   * 获取分页配置
   */
  getPaginationConfig = _total => {
    const { curPn } = this.state;
    return {
      current: curPn,
      ...paginationConfig,
      total: _total,
    };
  };

  /**
   * 表格分页、排序、筛选变化时触发
   */
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;
    const params = {
      pn: pagination.current,
      ps: pagination.pageSize,
      ...formValues,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.loadData(params);
  };

  /**
   * 查询
   */
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      this.loadData(values);
    });
  };

  /**
   * 重置
   */
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.loadData();
  };

  /**
   * 删除
   */
  handleDelete = () => {
    const { selectedRowKeys } = this.state
    const { dispatch } = this.props
    if (!selectedRowKeys) {
      message.warning('请勾选要删除的数据');
    }
    else {
      confirm({
        title: '您是否确认要删除选中的数据',
        content: <span style={{ color: '#ff0000' }}>你即将删除 {selectedRowKeys.length} 条数据<br />此操作不可逆，请再次确认！</span>,
        onOk() {
          dispatch({
            type: delDataUrl,
            payload: { ids: selectedRowKeys },
          });
        },
        onCancel() { },
      });
    }
  }

  /**
   * 新建 / 编辑
   */
  handleCreateFormModalVisible = (flag, record) => {
    this.setState({
      modalCreateFormVisible: !!flag,
      curSelectedRow: record,
    });
  };

  /**
   * 新建 / 编辑 - 确定提交
   */
  handleAdd = fields => {
    const { dispatch } = this.props;
    if (!fields.Id) {
      dispatch({
        type: addDataUrl,
        payload: fields,
      });
    }
    else {
      dispatch({
        type: updateDataUrl,
        payload: fields,
      });
    }
  };

  /**
   * 重置密码
   */
  handleResetPwdModalVisible = (flag, record) => {
    this.setState({
      modalResetVisible: !!flag,
      curSelectedRow: record,
    });
  };

  /**
   * 重置密码 - 确定提交
   */
  handleResetPwd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: resetPwdUrl,
      payload: fields,
    });
  };

  renderForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="userId">
              {getFieldDecorator('userId')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="nickName">
              {getFieldDecorator('nickName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="账户是否被禁用">
              {getFieldDecorator('Disable', {
                initialValue: '',
              })(
                <Select>
                  <Option value="">-- 不限 --</Option>
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button icon="plus" type="primary" onClick={() => this.handleCreateFormModalVisible(true)}>
                新建
              </Button>
              <Button icon="delete" style={{ marginLeft: 8 }} onClick={this.handleDelete}>
                删除
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  setColumns = () => {
    const tempColumns = [
      {
        title: '权限分组',
        dataIndex: 'Authority',
        key: 'Authority',
      },
      {
        title: '头像',
        dataIndex: 'avatar',
        key: 'avatar',
        render: val => val ? <img className={styles.avatar_img} src={`/${val}`} alt="" /> : '',
      },
      {
        title: '用户id',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName',
      },
      {
        title: '密码',
        dataIndex: 'Password',
        key: 'Password',
      },
      // {
      //   title: 'Password_Salt',
      //   dataIndex: 'Password_Salt',
      //   key: 'Password_Salt',
      // },
      {
        title: '账户是否被禁用',
        dataIndex: 'Disable',
        key: 'Disable',
        width: 150,
        render: val => val ? <span style={{ color: '#ff0000' }}>是</span> : '否',
      },
      {
        title: '创建时间',
        dataIndex: 'Create_Time',
        key: 'Create_Time',
        width: 120,
        sorter: true,
      },
      {
        title: '更新时间',
        dataIndex: 'Update_Time',
        key: 'Update_Time',
        width: 120,
        sorter: true,
      },
      {
        title: '操作',
        width: 180,
        render: (text, record) => (
          <Fragment>
            <Button type="primary" size="small" onClick={() => this.handleCreateFormModalVisible(true, record)}>
              编辑
            </Button>
            <Divider type="vertical" />
            <Button type="primary" size="small" onClick={() => this.handleResetPwdModalVisible(true, record)}>
              重置密码
            </Button>
          </Fragment>
        ),
      },
    ];
    this.setState({ columns: tempColumns });
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  render() {
    const { columns, modalCreateFormVisible, modalResetVisible, curSelectedRow, selectedRowKeys } = this.state;
    const {
      loading,
      loadingByAdd,
      loadingByUpdate,
      loadingByDel,
      loadingByResetPwd,
      sys: { resByGetListByPage },
      auth: { resByAllAuthority },
    } = this.props;

    const createFormMethods = {
      handleAdd: this.handleAdd,
      handleCreateFormModalVisible: this.handleCreateFormModalVisible,
    }
    const resetPwdMethods = {
      handleAdd: this.handleResetPwd,
      handleCreateFormModalVisible: this.handleResetPwdModalVisible,
    }
    // console.info('resByGetListByPage', resByGetListByPage)

    // 通过 rowSelection 对象表明需要行选择
    const rowSelection = {
      selectedRowKeys,
      onChange: (this.onSelectChange),
    };

    return (
      <PageHeaderWrapper title="">
        <Spin spinning={!!loadingByDel} tip="正在执行删除操作...">
          <Card bordered={false}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              bordered={true}
              rowKey={record => record.Id}
              dataSource={resByGetListByPage === undefined ? [] : resByGetListByPage.List}
              columns={columns}
              pagination={this.getPaginationConfig(
                resByGetListByPage === undefined ? 0 : resByGetListByPage.Count
              )}
              loading={loading}
              onChange={this.handleStandardTableChange}
              rowSelection={rowSelection}
            />
          </Card>
          <CreateForm {...createFormMethods} modalVisible={modalCreateFormVisible} record={curSelectedRow} authority={resByAllAuthority} loading={loadingByAdd || loadingByUpdate} />
          <ResetPwdForm {...resetPwdMethods} modalVisible={modalResetVisible} record={curSelectedRow} loading={loadingByResetPwd} />
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;