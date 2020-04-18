import React, { Component, Fragment } from "react";
import {
  Icon,
  Card,
  Spin,
  Tabs,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Charts/chart.less';
import { connect } from 'dva';

import UserPortraitBySex from '@/pages/Analysis/Component/UserPortraitBySex'
import UserPortraitByArea from '@/pages/Analysis/Component/UserPortraitByArea'
import UserPortraitByDevice from '@/pages/Analysis/Component/UserPortraitByDevice'

const { TabPane } = Tabs;
const getTips = () => {
  Modal.info({
    title: '【名词解释】',
    width: 800,
    content: (
      <div className={styles.modal_analysis_info}>
        <p><span className='t'>用户画像：</span>查看选定时间范围内，新增或活跃用户的画像分布。支持查看昨天、最近7天、最近30天的数据。其中，新增用户数为选定时间范围内首次访问小程序的去重用户数，活跃用户数为选定时间范围内访问过小程序的去重用户数。</p>
        <h3>【指标解释】</h3>
        <p><span className='t'>地区分布：</span>查看新增或活跃用户的主要省份分布，图表仅展示用户数最多的<span style={{ color: 'red' }}>top10</span></p>
        <p><span className='t'>终端及机型分布：</span>查看新增或活跃用户的终端及机型分布，其中终端包括iPhone、Android和其他，机型暂只提供用户数最多的<span style={{ color: 'red' }}>top20</span></p>
      </div>
    ),
    onOk() { },
  });
};

// 查询列表数据url
const queryDataUrl = 'analysis/getAnalysisUserPortrait';

@connect(({ analysis, loading }) => ({
  analysis,
  loading: loading.effects[queryDataUrl],
}))
class Groupedcolumn extends Component {
  state = {
    query_type: 2, // 1:昨天，2:最近7天，3:最近30天
  };

  componentDidMount() {
    const { query_type } = this.state;
    this.loadData({
      query_type,
    });
  }

  /**
   * 加载数据
   */
  loadData = paramsObj => {
    // 初始查询时的查询参数
    const { dispatch } = this.props;
    dispatch({
      type: queryDataUrl,
      payload: paramsObj,
    });
  };

  // 日期切换：1:昨天，2:最近7天，3:最近30天
  onSelectDate = type => {
    const { query_type } = this.state
    if (query_type === type) return
    this.setState({ query_type: type })
    this.loadData({
      query_type: type,
    });
  };

  render() {
    const { query_type } = this.state;
    const {
      loading,
      analysis: { resByUserPortrait },
    } = this.props;

    const dateExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={query_type === 1 ? styles.active : ''} onClick={() => this.onSelectDate(1)}>
            昨天
          </a>
          <a className={query_type === 2 ? styles.active : ''} onClick={() => this.onSelectDate(2)}>
            最近7天
          </a>
          <a className={query_type === 3 ? styles.active : ''} onClick={() => this.onSelectDate(3)}>
            最近30天
          </a>
        </div>
      </div>
    );

    const dateQueryHtml = (
      <Fragment>
        <br />
        <span className={styles.query_data}>当前查询：{resByUserPortrait && resByUserPortrait.query_data}</span>
      </Fragment>
    );

    return (
      <Fragment>
        <PageHeaderWrapper title="用户画像分析：性别及年龄分布、地区分布、终端及机型分布">
          <h3 onClick={getTips}><a href='javascript:;'>名词解释 <Icon type="question-circle" theme="outlined" /></a></h3>
          <Card className={styles.chart_card}>
            <Spin spinning={loading}>
              <div className={styles.salesCard}>
                <Tabs size="large" tabBarStyle={{ marginBottom: 0 }} tabBarExtraContent={dateExtra}>
                  <TabPane tab="性别及年龄分布" key="sex">
                    {dateQueryHtml}
                    <UserPortraitBySex dataSource={resByUserPortrait} />
                  </TabPane>
                  <TabPane tab="地区分布(top10)" key="area">
                    {dateQueryHtml}
                    <UserPortraitByArea dataSource={resByUserPortrait} />
                  </TabPane>
                  <TabPane tab="终端及机型分布(top20)" key="device">
                    {dateQueryHtml}
                    <UserPortraitByDevice dataSource={resByUserPortrait} />
                  </TabPane>
                </Tabs>
              </div>
            </Spin>
          </Card>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}

export default Groupedcolumn;
