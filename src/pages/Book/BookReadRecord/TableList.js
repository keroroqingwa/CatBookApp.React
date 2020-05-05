import React, { Component } from 'react';
import { Table, Card, Form, Row, Col, Input, Button, Select } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import moment from "moment";
import paginationConfig from '../../../../config/pagination.config';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../TableList.less';
import { getPageQuery } from '@/utils/utils';

const FormItem = Form.Item;
// 查询列表数据url
const queryDataUrl = 'bookReadRecord/getPaged';

@Form.create()
@connect(({ bookReadRecord, loading }) => ({
  bookReadRecord,
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
    const { openid } = getPageQuery();
    this.loadData({ openid });
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
    form.setFieldsValue({ 'openid': '' })
    this.setState({
      formValues: {},
    });
    this.loadData();
  };

  renderForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { openid } = getPageQuery();

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="openid">
              {/* {getFieldDecorator('openid')(<Input placeholder="请输入" />)} */}
              {getFieldDecorator('openid', {
                initialValue: openid,
                rules: [{
                  required: false, message: '请输入openid',
                }],
              })(
                <Input placeholder="请输入openid" maxLength={100} />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="作者">
              {getFieldDecorator('author')(<Input placeholder="请输入作者" maxLength={50} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="书名">
              {getFieldDecorator('bookName')(<Input placeholder="请输入书名" maxLength={50} />)}
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
    const openidRender = (val) => <Link to={`/book/user-list-detail?openid=${val}`}>{val}</Link>
    const bookNameRender = (val, record) => <a target='_blank' rel='noopener noreferrer' href={record.bookLink}>{val}</a>
    const chapterNameRender = (val, record) => <a target='_blank' rel='noopener noreferrer' href={record.chapterLink}>{val}</a>
    const tempColumns = [
      {
        title: 'openid',
        dataIndex: 'openid',
        key: 'openid',
        render: openidRender,
      },
      {
        title: '搜索来源',
        dataIndex: 'rule',
        key: 'rule',
        width: 90,
        render: val => {
          if (val === 1)
            return '笔趣阁';
          else if (val === 2)
            return '外国文学';
          else if (val === 3)
            return '新笔趣阁';
        },
      },
      {
        title: '作者',
        dataIndex: 'author',
        key: 'author',
      },
      {
        title: '小说分类',
        dataIndex: 'bookClassify',
        key: 'bookClassify',
        width: 100,
      },
      {
        title: '小说封面图片',
        dataIndex: 'coverImage',
        key: 'coverImage',
        render: val => <img src={val} alt='' className={styles.cover_img} />,
      },
      {
        title: '小说名称',
        dataIndex: 'bookName',
        key: 'bookName',
        render: bookNameRender,
      },
      {
        title: '章节名称',
        dataIndex: 'chapterName',
        key: 'chapterName',
        render: chapterNameRender,
      },
      {
        title: '当前章节的字数',
        dataIndex: 'numberOfWords',
        key: 'numberOfWords',
      },
      {
        title: '阅读时长（秒）',
        dataIndex: 'readSeconds',
        key: 'readSeconds',
      },
      {
        title: '创建时间',
        dataIndex: 'creationTime',
        key: 'creationTime',
        width: 120,
        sorter: true,
        render: val => moment(val).format('YYYY/MM/DD HH:mm:ss'),
      },
      {
        title: '更新时间',
        dataIndex: 'lastModificationTime',
        key: 'lastModificationTime',
        width: 120,
        sorter: true,
        render: val => !val ? '' : moment(val).format('YYYY/MM/DD HH:mm:ss'),
      },
    ];
    this.setState({ columns: tempColumns });
  };

  render() {
    const { columns } = this.state;
    const {
      loading,
      bookReadRecord: { resByGetPaged },
    } = this.props;
    // console.info('resByGetPaged', resByGetPaged)

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
            loading={loading}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;