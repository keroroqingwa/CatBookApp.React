import React, { Component, Fragment } from "react";
import {
  Icon,
  Card,
  Tabs,
  Modal,
  Spin,
} from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Charts/chart.less';

import DailySummary from '@/pages/Analysis/Component/DailySummary'
import { getTimeDistance } from '@/utils/utils';

const { TabPane } = Tabs;
const getTips = () => {
  Modal.info({
    title: '【名词解释】',
    width: 800,
    content: (
      <div className={styles.modal_analysis_info}>
        <p><span className='t'>访问小程序数据概况</span>查看昨日关键用户指标，反映小程序昨日用户活跃概况，以及对比一天前、一周前、一月前的增长率。</p>
      </div>
    ),
    onOk() { },
  });
};

// 查询列表数据url
const queryDataUrl = 'analysis/getAnalysisDailySummary';

@connect(({ analysis, loading }) => ({
  analysis,
  loading: loading.effects[queryDataUrl],
}))
class Groupedcolumn extends Component {
  state = {
    query_type: 2, // 1:昨天，2:最近7天，3:最近30天
    rangePickerValue: null,
    flag: 0,
  };

  componentWillMount() {
    const { query_type } = this.state;
    this.onResetDateRange(query_type)
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

  // 日期范围重新赋值
  onResetDateRange = type => {
    const timeDistance = getTimeDistance(0);
    let iStart = 0
    switch (type) {
      case 1: iStart = -1; break;
      case 2: iStart = -7; break;
      case 3: iStart = -30; break;
      default: break;
    }
    this.setState({
      rangePickerValue: [timeDistance[0].add(iStart, 'days'), timeDistance[1].add(-1, 'days')],
    })
  }

  // 日期切换：1:昨天，2:最近7天，3:最近30天
  onSelectDate = type => {
    const { query_type } = this.state
    if (query_type === type) return
    this.setState({ query_type: type, flag: 3 })
    this.onResetDateRange(type)
    this.loadData({
      query_type: type,
    });
  };

  // 重新选择日期范围时触发
  onRefreshSelectDate = (begin_time, end_time) => {
    this.setState({
      rangePickerValue: [begin_time, end_time],
    })
  };

  // 刷新数据时触发
  onReloadData = (type) => {
    const { rangePickerValue } = this.state
    this.loadData({
      type,
      query_type: 0,
      begin_time: rangePickerValue[0].format('YYYY-MM-DD'),
      end_time: rangePickerValue[1].format('YYYY-MM-DD'),
    });
    if (type === 0) this.setState({ query_type: 0 })
    this.setState({ flag: type })
  }

  render() {
    const { query_type, rangePickerValue, flag } = this.state;
    const {
      loading,
      analysis: { resByDailySummary, resByLastWeeklySummary, resByLastMonthlySummary },
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

    const props = {
      flag,
    }

    return (
      <Fragment>
        <PageHeaderWrapper title="小程序数据概况">
          <h3 onClick={getTips}><a href='javascript:;'>名词解释 <Icon type="question-circle" theme="outlined" /></a></h3>
          <Card className={styles.chart_card}>
            <Spin spinning={loading}>
              <div className={styles.salesCard}>
                <Tabs size="large" tabBarStyle={{ marginBottom: 0 }} tabBarExtraContent={dateExtra}>
                  <TabPane tab="访问小程序数据概况" key="day">
                    {
                      resByDailySummary && <DailySummary
                        dataSource={
                          {
                            resByDailySummary,
                            resByLastWeeklySummary,
                            resByLastMonthlySummary,
                          }
                        }
                        rangePickerValue={rangePickerValue}
                        onRefreshSelectDate={this.onRefreshSelectDate}
                        onReloadData={this.onReloadData}
                        {...props}
                      />
                    }
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
