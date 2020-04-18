import React, { Component, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Tabs,
} from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './chart.less';

const { TabPane } = Tabs;

// 查询列表数据url
const queryDataUrl = 'statistics/getByMostPopularBook';
const queryDataUrl2 = 'statistics/getByReadRanking';

@connect(({ statistics, loading }) => ({
  statistics,
  loading: loading.effects[queryDataUrl],
  loading2: loading.effects[queryDataUrl2],
}))
class Groupedcolumn extends Component {

  componentDidMount() {
    this.loadData();
  }

  /**
   * 加载数据
   */
  loadData = paramsObj => {
    const { dispatch } = this.props;
    // 最受欢迎小说排行
    dispatch({
      type: queryDataUrl,
      payload: paramsObj,
    });
    // 阅读排行榜
    dispatch({
      type: queryDataUrl2,
      payload: paramsObj,
    });
  };

  render() {
    const {
      loading,
      loading2,
      statistics: { resByMostPopularBook, resByReadRanking },
    } = this.props;

    /* 最受欢迎小说排行 */
    const columns = [
      { title: '排名', dataIndex: 'index', key: 'index', width: 100 },
      { title: '小说名称', dataIndex: 'flag', key: 'flag', width: 200 },
      { title: '看过的用户', dataIndex: 'total', key: 'total', width: 80, sorter: (a, b) => a.total - b.total, className: styles.alignRight },
    ];
    const searchData = [];
    if (resByMostPopularBook) {
      resByMostPopularBook.forEach((item, idx) => {
        searchData.push({
          index: idx + 1,
          flag: item.flag,
          total: item.total,
        });
      })
    }
    const openidRender = (val) => <Link to={`/book/user-list-detail?openid=${val}`}>{val}</Link>
    /* 阅读排行榜 */
    const columns2 = [
      { title: '排名', dataIndex: 'index', key: 'index', width: 100 },
      { title: 'openid', dataIndex: 'openid', key: 'openid', width: 200, render: openidRender},
      { title: '昵称', dataIndex: 'nickName', key: 'nickName', width: 200 },
      { title: '看过的小说章节数', dataIndex: 'total', key: 'total', width: 80, sorter: (a, b) => a.total - b.total, className: styles.alignRight },
    ];
    const searchData2 = [];
    if (resByReadRanking) {
      resByReadRanking.forEach((item, idx) => {
        searchData2.push({
          index: idx + 1,
          openid: item.openid,
          nickName: item.nickName,
          total: item.total,
        });
      })
    }

    return (
      <Fragment>
        <PageHeaderWrapper title="">
          <Card className={styles.chart_card} loading={loading}>
            <div className={styles.salesCard}>
              <Tabs size="large" tabBarStyle={{ marginBottom: 0 }}>
                <TabPane tab="最受欢迎小说排行" key="sales">
                  <Row>
                    <Col span={24}>
                      {/* <h3>最受欢迎小说排行</h3> */}
                      <Table
                        rowKey={record => record.index}
                        size="small"
                        columns={columns}
                        dataSource={searchData}
                        pagination={{
                          pageSize: 10,
                        }}
                      />
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
          </Card>
          <br />
          <Card className={styles.chart_card} loading={loading2}>
            <div className={styles.salesCard}>
              <Tabs size="large" tabBarStyle={{ marginBottom: 0 }}>
                <TabPane tab="阅读排行榜" key="sales">
                  <Row>
                    <Col span={24}>
                      {/* <h3>用户阅读小说排行</h3> */}
                      <Table
                        rowKey={record => record.index}
                        size="small"
                        columns={columns2}
                        dataSource={searchData2}
                        pagination={{
                          pageSize: 10,
                        }}
                      />
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
          </Card>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}

export default Groupedcolumn;
