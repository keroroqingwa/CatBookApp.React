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

import VisitPage from '@/pages/Analysis/Component/VisitPage'
import { getTimeDistance } from '@/utils/utils';

const { TabPane } = Tabs;
const getTips = () => {
  Modal.info({
    title: '【名词解释】',
    width: 800,
    content: (
      <div className={styles.modal_analysis_info}>
        <p><span className='t'>访问页面：</span>查看选定时间范围内，每个小程序页面的访问次数、访问人数、次均使用时长、入口页次数、退出页次数、退出率、分享次数、分享人数。</p>
        <h3>【指标解释】</h3>
        <p><span className='t'>访问次数：</span>访问小程序页面的总次数。多个页面之间跳转、同一页面的重复访问计为多次访问。</p>
        <p><span className='t'>访问人数：</span>访问小程序页面的总用户数，同一用户多次访问不重复计。</p>
        <p><span className='t'>次均停留时长：</span>平均每次打开小程序停留在小程序页面的总时长，即总停留时长/打开次数。</p>
        <p><span className='t'>入口页次数：</span>小程序页面作为入口页的访问次数，例如用户从页面A进入小程序，跳转到页面B，A为入口页，B不是。</p>
        <p><span className='t'>退出率：</span>小程序页面作为退出页的访问次数占比，即退出页次数/访问次数。</p>
        <p><span className='t'>分享次数：</span>分享小程序页面的总次数。</p>
        <p><span className='t'>分享人数：</span>分享小程序页面的总人数，同一用户多次分享不重复计。</p>
      </div>
    ),
    onOk() { },
  });
};

// 查询列表数据url
const queryDataUrl = 'analysis/getAnalysisVisitPage';

@connect(({ analysis, loading }) => ({
  analysis,
  loading: loading.effects[queryDataUrl],
}))
class Groupedcolumn extends Component {
  state = {
    query_type: 2, // 1:昨天，2:最近7天，3:最近30天
    rangePickerValue: null,
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
    this.setState({ query_type: type })
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
  onReloadData = () => {
    const { rangePickerValue } = this.state
    this.loadData({
      query_type: 0,
      begin_time: rangePickerValue[0].format('YYYY-MM-DD'),
      end_time: rangePickerValue[1].format('YYYY-MM-DD'),
    });
    this.setState({ query_type: 0 })
  }

  render() {
    const { query_type, rangePickerValue } = this.state;
    const {
      loading,
      analysis: { resByVisitPage },
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

    return (
      <Fragment>
        <PageHeaderWrapper title="访问页面">
          <h3 onClick={getTips}><a href='javascript:;'>名词解释 <Icon type="question-circle" theme="outlined" /></a></h3>
          <Card className={styles.chart_card}>
            <Spin spinning={loading}>
              <div className={styles.salesCard}>
                <Tabs size="large" tabBarStyle={{ marginBottom: 0 }} tabBarExtraContent={dateExtra}>
                  <TabPane tab="访问页面" key="VisitPage">
                    {
                      resByVisitPage && <VisitPage
                        dataSource={resByVisitPage}
                        rangePickerValue={rangePickerValue}
                        onRefreshSelectDate={this.onRefreshSelectDate}
                        onReloadData={this.onReloadData}
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
