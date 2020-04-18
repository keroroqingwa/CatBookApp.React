import React from "react";
import {
  Row,
  Col,
  DatePicker,
  Button,
  Spin,
  Tabs,
  Table,
} from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
import moment from 'moment';
import DataSet from "@antv/data-set";
import { connect } from 'dva';
import styles from '../../Charts/chart.less';

import { getTimeDistance } from '@/utils/utils';

const { RangePicker, MonthPicker } = DatePicker;
const { TabPane } = Tabs;

// 查询列表数据url
const queryDataUrl = 'analysis/getAnalysisMonthlyVisitTrend';

@connect(({ analysis, loading }) => ({
  analysis,
  loading: loading.effects[queryDataUrl],
}))
class Donut extends React.Component {
  state = {
    rangePickerValue: getTimeDistance('month'),
    curSelectedDate: null,
  };

  componentWillMount() {
    const { rangePickerValue } = this.state;
    const startDate = rangePickerValue[0].add(-6, 'months').startOf('month')
    const endDate = rangePickerValue[1].add(-1, 'months').endOf('month')
    this.setState({ curSelectedDate: [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')] })
  };

  componentDidMount() {
    const { curSelectedDate } = this.state;
    this.loadData({
      begin_time: curSelectedDate[0],
      end_time: curSelectedDate[1],
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

  handleRangePickerChange = (val, curSelectedDate) => {
    this.setState({
      curSelectedDate,
    });
  };
  
  handleRangePickerChange1 = (val, txt) => {
    const { curSelectedDate } = this.state;
    curSelectedDate[0] = val.format('YYYY-MM-DD')
    this.setState({
      curSelectedDate,
    });
  };

  handleRangePickerChange2 = (val, txt) => {
    const { curSelectedDate } = this.state;
    curSelectedDate[1] = moment(`${txt}-01`).add(1, 'months').add(-1, 'days').format('YYYY-MM-DD')
    this.setState({
      curSelectedDate,
    });
  };

  // 刷新数据
  handleReload = () => {
    const { curSelectedDate } = this.state;
    const data = {
      begin_time: curSelectedDate[0],
      end_time: curSelectedDate[1],
    }
    this.loadData(data)
  }

  render() {
    const { rangePickerValue } = this.state;
    const {
      loading,
      analysis: { resByMonthlyVisitTrend },
    } = this.props;

    const res = {
      data_session_cnt: [0],
      data_visit_pv: [0],
      data_visit_uv: [0],
      data_visit_uv_new: [0],
      data_stay_time_uv: [0],
      data_stay_time_session: [0],
      data_visit_depth: [0],
      columns: [''],
    }
    if (resByMonthlyVisitTrend && resByMonthlyVisitTrend.columns) {
      res.data_session_cnt = resByMonthlyVisitTrend.data_session_cnt
      res.data_visit_pv = resByMonthlyVisitTrend.data_visit_pv
      res.data_visit_uv = resByMonthlyVisitTrend.data_visit_uv
      res.data_visit_uv_new = resByMonthlyVisitTrend.data_visit_uv_new
      res.data_stay_time_uv = resByMonthlyVisitTrend.data_stay_time_uv
      res.data_stay_time_session = resByMonthlyVisitTrend.data_stay_time_session
      res.data_visit_depth = resByMonthlyVisitTrend.data_visit_depth
      res.columns = resByMonthlyVisitTrend.columns
    }

    const data = []
    res.columns.forEach((key, idx) => {
      data.push({
        date: key,
        '打开次数': res.data_session_cnt[idx],
        '访问次数': res.data_visit_pv[idx],
        '访问人数': res.data_visit_uv[idx],
        '新用户数': res.data_visit_uv_new[idx],
        '人均停留时长(秒)': res.data_stay_time_uv[idx],
        '次均停留时长(秒)': res.data_stay_time_session[idx],
        '平均访问深度': res.data_visit_depth[idx],
      })
    })

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      // fields: ["访问次数", "打开次数", "访问人数", "新用户数", "人均停留时长(秒)", "次均停留时长(秒)", "平均访问深度"],
      fields: ["访问次数", "打开次数", "访问人数", "新用户数"],
      // 展开字段集
      key: "name",
      // key字段
      value: "total", // value字段
    });
    const cols = {
      date: {
        range: [0, 1],
      },
    };

    const ds2 = new DataSet();
    const dv2 = ds2.createView().source(data);
    dv2.transform({
      type: "fold",
      fields: ["人均停留时长(秒)", "次均停留时长(秒)", "平均访问深度"],
      // 展开字段集
      key: "name",
      // key字段
      value: "total", // value字段
    });


    /* 详细数据 */
    const columns = [
      { title: '日期', dataIndex: 'key', key: 'key', width: 120 },
      { title: '打开次数', dataIndex: 'session_cnt', key: 'session_cnt', width: 100 },
      { title: '访问次数', dataIndex: 'visit_pv', key: 'visit_pv', width: 100 },
      { title: '访问人数', dataIndex: 'visit_uv', key: 'visit_uv', width: 100 },
      { title: '新用户数', dataIndex: 'visit_uv_new', key: 'visit_uv_new', width: 100 },
      { title: '人均停留时长(秒)', dataIndex: 'stay_time_uv', key: 'stay_time_uv', width: 100 },
      { title: '次均停留时长(秒)', dataIndex: 'stay_time_session', key: 'stay_time_session', width: 100 },
      { title: '平均访问深度', dataIndex: 'visit_depth', key: 'visit_depth', width: 100 },
    ];
    const tableData = []
    res.columns.forEach((key, idx) => {
      tableData.push({
        key,
        session_cnt: res.data_session_cnt[idx],
        visit_pv: res.data_visit_pv[idx],
        visit_uv: res.data_visit_uv[idx],
        visit_uv_new: res.data_visit_uv_new[idx],
        stay_time_uv: res.data_stay_time_uv[idx],
        stay_time_session: res.data_stay_time_session[idx],
        visit_depth: res.data_visit_depth[idx],
      })
    })

    function disabledDate(current) {
      // Can not select days after today and today
      return current && current > moment().add(-1, 'days').endOf('day');
    }

    return (
      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col span={24}>
            <div className={styles.p20}>
              {/* <RangePicker
                defaultValue={rangePickerValue}
                onChange={this.handleRangePickerChange}
                style={{ width: 256 }}
              /> */}
              <MonthPicker defaultValue={rangePickerValue[0]} onChange={this.handleRangePickerChange1} disabledDate={disabledDate} placeholder="开始时间" />
              <span> ~ </span>
              <MonthPicker defaultValue={rangePickerValue[1]} onChange={this.handleRangePickerChange2} disabledDate={disabledDate} placeholder="结束时间" />
              <Button type="primary" icon="reload" onClick={this.handleReload} style={{ marginLeft: 10 }}>刷新数据</Button>
              <span className={styles.query_data}>当前查询：{resByMonthlyVisitTrend && resByMonthlyVisitTrend.query_data}</span>
            </div>
            <Chart height={400} data={dv} scale={cols} forceFit>
              <Legend />
              <Axis name="date" />
              <Axis
                name="total"
                label={{
                  formatter: val => `${val}`,
                }}
              />
              <Tooltip
                crosshairs={{
                  type: "y",
                }}
              />
              <Geom
                type="line"
                position="date*total"
                size={2}
                color="name"
              />
              <Geom
                type="point"
                position="date*total"
                size={4}
                shape="circle"
                color="name"
                style={{
                  stroke: "#fff",
                  lineWidth: 1,
                }}
              />
            </Chart>
            <Chart height={400} data={dv2} scale={cols} forceFit>
              <Legend />
              <Axis name="date" />
              <Axis
                name="total"
                label={{
                  formatter: val => `${val}`,
                }}
              />
              <Tooltip
                crosshairs={{
                  type: "y",
                }}
              />
              <Geom
                type="line"
                position="date*total"
                size={2}
                color="name"
              />
              <Geom
                type="point"
                position="date*total"
                size={4}
                shape="circle"
                color="name"
                style={{
                  stroke: "#fff",
                  lineWidth: 1,
                }}
              />
            </Chart>
          </Col>
        </Row>
        <br />
        <Row gutter={16}>
          <Col span={24}>
            <h3>详细数据</h3>
            <Table
              rowKey={record => record.key}
              size="small"
              columns={columns}
              dataSource={tableData}
              pagination={false}
              style={{ border: 'none' }}
              className={styles.table_noborder}
            />
            <br />
            <br />
            <br />
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default Donut;
