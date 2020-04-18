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

import VisitDistributionBySource from '@/pages/Analysis/Component/VisitDistributionBySource'
import VisitDistributionByArea from '@/pages/Analysis/Component/VisitDistributionByArea'
import VisitDistributionByDevice from '@/pages/Analysis/Component/VisitDistributionByDevice'

const { TabPane } = Tabs;
const getTips = () => {
  Modal.info({
    title: '【访问分布】',
    width: 800,
    content: (
      <div className={styles.modal_analysis_info}>
        <p><span className='t'>访问来源：</span>即用户访问小程序的具体场景，如小程序历史列表、二维码等。你可以查看各个场景的小程序打开次数，分析小程序的用户渠道。</p>
        <p><span className='t'>访问时长：</span>即用户从打开小程序，到主动关闭或超时退出小程序的过程中停留的时长，你可以查看各个时长区间的打开次数，分析用户对小程序的喜爱或依赖程度。</p>
        <p><span className='t'>访问深度：</span>即用户从打开小程序，到主动关闭或超时退出小程序的过程中访问的去重页面数，你可以查看各个访问深度区间的打开次数，了解小程序的普通用户、深度用户分布。</p>
      </div>
    ),
    onOk() { },
  });
};

// 查询列表数据url
const queryDataUrl = 'analysis/getAnalysisVisitDistribution';

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
      analysis: { resByVisitDistribution },
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
        <span className={styles.query_data}>当前查询：{resByVisitDistribution && resByVisitDistribution.query_data}</span>
      </Fragment>
    );

    return (
      <Fragment>
        <PageHeaderWrapper title="访问分布：访问来源、访问时长、访问深度">
          <h3 onClick={getTips}><a href='javascript:;'>名词解释 <Icon type="question-circle" theme="outlined" /></a></h3>
          <Card className={styles.chart_card}>
            <Spin spinning={loading}>
              <div className={styles.salesCard}>
                {
                  resByVisitDistribution &&
                  <Tabs size="large" tabBarStyle={{ marginBottom: 0 }} tabBarExtraContent={dateExtra}>
                    <TabPane tab="访问来源" key="access_source_session_cnt">
                      {dateQueryHtml}
                      <VisitDistributionBySource dataSource={resByVisitDistribution} />
                    </TabPane>
                    <TabPane tab="访问时长" key="access_staytime_info">
                      {dateQueryHtml}
                      <VisitDistributionByArea dataSource={resByVisitDistribution} />
                    </TabPane>
                    <TabPane tab="访问深度" key="access_depth_info">
                      {dateQueryHtml}
                      <VisitDistributionByDevice dataSource={resByVisitDistribution} />
                    </TabPane>
                  </Tabs>
                }
              </div>
            </Spin>
          </Card>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}

export default Groupedcolumn;
