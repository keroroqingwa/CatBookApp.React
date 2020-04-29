import React, { Component, Fragment } from 'react';
import { Table, Card, Form, Row, Col, Input, Button, Select, Modal, Divider, message, Spin, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import paginationConfig from '../../../../config/pagination.config';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../TableList.less';
// import { reset } from 'ansi-colors';

const { Option } = Select;
const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

// 查询列表数据url
const queryDataUrl = 'bookApiWhitelist/getPaged';
// 新增 url
const addDataUrl = 'bookApiWhitelist/add';
// 编辑 url
const updateDataUrl = 'bookApiWhitelist/update';
// 删除 url
const delDataUrl = 'bookApiWhitelist/del';

// 创建表单
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleCreateFormModalVisible, record, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      handleAdd({ ...fieldsValue, id: record ? record.id : '' });
    });
  };

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title={`${record ? '编辑' : '新建'}`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleCreateFormModalVisible()}
      confirmLoading={loading}
    >
      <FormItem {...formItemLayout} label="appid">
        {form.getFieldDecorator('appid', {
          rules: [{ required: true, message: '请输入至少10个字符！', min: 10 }],
          initialValue: record ? record.appid : '',
        })(<Input placeholder="" disabled={!!record} />)}
      </FormItem>

      <FormItem {...formItemLayout} label="有效期">
        {form.getFieldDecorator('expireTime', {
          rules: [{ required: true, message: '请输入有效期！' }],
          initialValue: record ? moment(record.expireTime, dateFormat) : null,
        })(<DatePicker placeholder="" showTime format={dateFormat} />)}
      </FormItem>

      <FormItem {...formItemLayout} label="备注">
        {form.getFieldDecorator('remark', {
          // rules: [{ required: true, message: '请输入至少2个字符！', min: 2 }],
          initialValue: record ? record.remark : '',
        })(<TextArea placeholder="" />)}
      </FormItem>

    </Modal>
  );
});

@Form.create()
@connect(({ bookApiWhitelist, auth, loading }) => ({
  bookApiWhitelist,
  auth,
  loading: loading.effects[queryDataUrl],
  loadingByAdd: loading.effects[addDataUrl],
  loadingByUpdate: loading.effects[updateDataUrl],
  loadingByDel: loading.effects[delDataUrl],
}))
class TableList extends Component {
  state = {
    columns: null,
    formValues: {},
    skipCount: 0,
    modalCreateFormVisible: false,
    curSelectedRow: null,
    selectedRowKeys: null,
  };

  componentDidMount() {
    this.setColumns();
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    const { loadingByAdd, loadingByUpdate, loadingByDel } = this.props
    const { bookApiWhitelist: { resByAdd, resByUpdate, resByDel } } = nextProps

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
        curSelectedRow.appid = resByUpdate.appid
        curSelectedRow.expireTime = resByUpdate.expireTime
        curSelectedRow.remark = resByUpdate.remark
        message.success('编辑操作成功');
        this.setState({ modalCreateFormVisible: false })
      }
    }
    // 删除操作结果
    if (resByDel) {
      if (loadingByDel && !nextProps.loadingByDel) {
        message.success('删除操作成功');
        this.loadData()
        this.setState({ selectedRowKeys: null })
      }
    }
  }

  /**
   * 加载数据
   */
  loadData = paramsObj => {
    // 初始查询时的查询参数
    const initSearchParams = { skipCount: 0, maxResultCount: paginationConfig.defaultPageSize };
    const { dispatch } = this.props;
    const params = { ...initSearchParams, ...paramsObj };
    const { skipCount } = params;
    this.setState({ skipCount });
    dispatch({
      type: queryDataUrl,
      payload: params,
    });
  };

  /**
   * 获取分页配置
   */
  getPaginationConfig = _total => {
    const { skipCount } = this.state;
    return {
      skipCount,
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
      skipCount: (pagination.current - 1) * pagination.pageSize,
      maxResultCount: pagination.pageSize,
      ...formValues,
    };
    if (sorter.field) {
      params.Sorting = `${sorter.field} ${sorter.order.replace('end', '')}`;
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
    if (fields.expireTime) {
      fields.expireTime = fields.expireTime.format(dateFormat);
    }
    const { dispatch } = this.props;
    if (!fields.id) {
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

  renderForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="appid">
              {getFieldDecorator('appid')(<Input placeholder="请输入appid" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
        {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
        </Row> */}
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
        title: 'appid',
        dataIndex: 'appid',
        key: 'appid',
      },
      {
        title: '有效期',
        dataIndex: 'expireTime',
        key: 'expireTime',
        render: val => moment(val).format('YYYY/MM/DD HH:mm:ss'),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '创建时间',
        dataIndex: 'creationTime',
        key: 'creationTime',
        width: 120,
        sorter: true,
        render: val => moment(val).format('YYYY/MM/DD HH:mm'),
      },
      {
        title: '更新时间',
        dataIndex: 'lastModificationTime',
        key: 'lastModificationTime',
        width: 120,
        sorter: true,
        render: val => !val ? '' : moment(val).format('YYYY/MM/DD HH:mm'),
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
    const { columns, modalCreateFormVisible, curSelectedRow, selectedRowKeys } = this.state;
    const {
      loading,
      loadingByAdd,
      loadingByUpdate,
      loadingByDel,
      bookApiWhitelist: { resByGetPaged },
    } = this.props;

    const createFormMethods = {
      handleAdd: this.handleAdd,
      handleCreateFormModalVisible: this.handleCreateFormModalVisible,
    }
    // console.info('resByGetPaged', resByGetPaged)

    // 通过 rowSelection 对象表明需要行选择
    const rowSelection = {
      selectedRowKeys,
      onChange: (this.onSelectChange),
    };

    return (
      <PageHeaderWrapper title="">
        <Spin spinning={!!loadingByDel} tip="正在执行删除操作...">
          <Card bordered={false}>
            <h3 style={{ color: '#ff0000', paddingBottom: '10px' }}>tips：一般情况下【喵喵看书】是禁止线上环境（体验版和正式版）访问接口的，但这里可以添加到例外</h3>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              bordered={true}
              rowKey={record => record.id}
              dataSource={resByGetPaged === undefined ? [] : resByGetPaged.items}
              columns={columns}
              pagination={this.getPaginationConfig(
                resByGetPaged === undefined ? 0 : resByGetPaged.totalCount
              )}
              loading={loading}
              onChange={this.handleStandardTableChange}
              rowSelection={rowSelection}
            />
          </Card>
          <CreateForm {...createFormMethods} modalVisible={modalCreateFormVisible} record={curSelectedRow} loading={loadingByAdd || loadingByUpdate} />
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;