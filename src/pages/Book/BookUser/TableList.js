import React, { Component, Fragment } from 'react';
import { Table, Card, Form, Row, Col, Input, Button, Divider } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from "moment";
import paginationConfig from '../../../../config/pagination.config';
import styles from '../TableList.less';

const FormItem = Form.Item;
// 查询列表数据url
const queryDataUrl = 'bookUser/getPaged';

@Form.create()
@connect(({ bookUser, auth, loading }) => ({
  bookUser,
  auth,
  loading: loading.effects[queryDataUrl],
}))
class TableList extends Component {
  state = {
    columns: null,
    formValues: {},
    skipCount: 0,
  };

  componentDidMount() {
    this.setColumns();
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
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

  renderForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用户id">
              {getFieldDecorator('userId')(<Input placeholder="请输入用户id" maxLength={10} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="appid">
              {getFieldDecorator('appid')(<Input placeholder="请输入appid" maxLength={50} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="openid">
              {getFieldDecorator('openid')(<Input placeholder="请输入openid" maxLength={100} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="昵称">
              {getFieldDecorator('nickName')(<Input placeholder="请输入昵称" maxLength={50} />)}
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
      </Form>
    );
  };

  setColumns = () => {
    const tempColumns = [
      {
        title: '用户id',
        dataIndex: 'userId',
        key: 'userId',
        sorter: true,
      },
      {
        title: 'appid',
        dataIndex: 'appid',
        key: 'appid',
      },
      {
        title: 'openid',
        dataIndex: 'openid',
        key: 'openid',
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName',
        width: 150,
      },
      {
        title: '用户头像',
        dataIndex: 'avatarUrl',
        key: 'avatarUrl',
        width: 100,
        render: val => <img className={styles.avatar_img} src={val} alt="" />,
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
        width: 150,
        render: (text, record) => (
          <Fragment>
            <Link to={`/book/user-list-detail?openid=${record.openid}`}>详细</Link>
            <Button type="primary" size="small">
              <Link target='_blank' to={`/book/user-preference-list.html?openid=${record.openid}`}>用户阅读偏好</Link>
            </Button>
            <Button type="primary" size="small">
              <Link target='_blank' to={`/book/readrecord-list.html?openid=${record.openid}`}>用户阅读记录</Link>
            </Button>
          </Fragment>
        ),
        className: styles.lh30,
      },
    ];
    this.setState({ columns: tempColumns });
  };

  render() {
    const { columns } = this.state;
    const {
      loading,
      loadingByAddCurrency,
      bookUser: { resByGetPaged },
    } = this.props;

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <Table
            bordered={true}
            rowKey={record => record.id}
            dataSource={resByGetPaged === undefined ? [] : resByGetPaged.items}
            columns={columns}
            pagination={this.getPaginationConfig(
              resByGetPaged === undefined ? 0 : resByGetPaged.totalCount
            )}
            loading={loading || loadingByAddCurrency}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;