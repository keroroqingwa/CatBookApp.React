import React, { Fragment } from 'react';
import {
  Row,
  Col,
  DatePicker,
  Button,
  Spin,
  Tabs,
  Table,
  Tooltip as AntdTooltip,
  Checkbox,
  Radio,
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
import styles from '../../Charts/chart.less';

const { RangePicker } = DatePicker;

class Donut extends React.Component {
  state = {
    // 显示活跃用户(表格)
    showActiveUser: false,
    // 显示新增用户(表格)
    showNewUser: false,
  };

  componentWillReceiveProps = (nextProps) => {
    const { flag } = nextProps
    if (flag && flag !== 1 && flag !== 2) {
      this.setState({
        showActiveUser: false,
        showNewUser: false,
      })
    }
  }

  // 重新选择日期范围时触发
  handleRangePickerChange = (val, curSelectedDate) => {
    const { onRefreshSelectDate } = this.props
    onRefreshSelectDate(moment(curSelectedDate[0]), moment(curSelectedDate[1]))
  };

  // 刷新数据
  handleReload = (i) => {
    const { onReloadData } = this.props
    const type = i > 0 ? i : 0
    onReloadData(type)
    if (type === 0) {
      this.setState({ showActiveUser: false, showNewUser: false })
    }
  }

  render() {
    const { showActiveUser, showNewUser } = this.state;
    const that = this
    const { dataSource, rangePickerValue } = this.props
    const { resByDailySummary } = dataSource
    let { resByLastWeeklySummary, resByLastMonthlySummary } = dataSource

    if (!showActiveUser) resByLastWeeklySummary = null
    if (!showNewUser) resByLastMonthlySummary = null

    const res = {
      data_visit_total: [0],
      data_share_pv: [0],
      data_share_uv: [0],
      columns: [''],
    }
    if (resByDailySummary && resByDailySummary.columns) {
      res.data_visit_total = resByDailySummary.data_visit_total
      res.data_share_pv = resByDailySummary.data_share_pv
      res.data_share_uv = resByDailySummary.data_share_uv
      res.columns = resByDailySummary.columns
    }

    const data = []
    res.columns.forEach((key, idx) => {
      data.push({
        date: key,
        '累计用户数': res.data_visit_total[idx],
        '转发次数': res.data_share_pv[idx],
        '转发人数': res.data_share_uv[idx],
      })
    })

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields: ["累计用户数", "转发次数", "转发人数"],
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


    /* 详细数据 */
    const columns = [
      { title: '日期', dataIndex: 'key', key: 'key', width: 120 },
      { title: '累计用户数', dataIndex: 'visit_total', key: 'visit_total', width: 100 },
      { title: '转发次数', dataIndex: 'share_pv', key: 'share_pv', width: 100 },
      { title: '转发人数', dataIndex: 'share_uv', key: 'share_uv', width: 100 },
    ];
    const tableData = []
    res.columns.forEach((key, idx) => {
      tableData.push({
        key,
        visit_total: res.data_visit_total[idx],
        share_pv: res.data_share_pv[idx],
        share_uv: res.data_share_uv[idx],
      })
    })
    // console.info('resByLastWeeklySummary', resByLastWeeklySummary)
    if (resByLastWeeklySummary && resByLastWeeklySummary.columns) {
      tableData.forEach((item, idx) => {
        // 累计用户数
        let txt_visit_total
        if (showActiveUser) txt_visit_total = <span><span style={{ color: '#ddd' }}> / </span><span style={{ color: 'sienna' }}>{resByLastWeeklySummary.data_visit_total[idx]}</span></span>
        item.visit_total = <span style={{ color: '#333' }}>{item.visit_total}{txt_visit_total}</span>
        // 转发次数
        let txt_share_pv
        if (showActiveUser) txt_share_pv = <span><span style={{ color: '#ddd' }}> / </span><span style={{ color: 'sienna' }}>{resByLastWeeklySummary.data_share_pv[idx]}</span></span>
        item.share_pv = <span style={{ color: '#333' }}>{item.share_pv}{txt_share_pv}</span>
        // 转发人数
        let txt_share_uv
        if (showActiveUser) txt_share_uv = <span><span style={{ color: '#ddd' }}> / </span><span style={{ color: 'sienna' }}>{resByLastWeeklySummary.data_share_uv[idx]}</span></span>
        item.share_uv = <span style={{ color: '#333' }}>{item.share_uv}{txt_share_uv}</span>
      })
    }
    if (resByLastMonthlySummary && resByLastMonthlySummary.columns) {
      tableData.forEach((item, idx) => {
        // 累计用户数
        let txt_visit_total
        if (showNewUser) txt_visit_total = <span><span style={{ color: '#ddd' }}> / </span><span style={{ color: 'blue' }}>{resByLastMonthlySummary.data_visit_total[idx]}</span></span>
        item.visit_total = <span style={{ color: '#333' }}>{item.visit_total}{txt_visit_total}</span>
        // 转发次数
        let txt_share_pv
        if (showNewUser) txt_share_pv = <span><span style={{ color: '#ddd' }}> / </span><span style={{ color: 'sienna' }}>{resByLastMonthlySummary.data_share_pv[idx]}</span></span>
        item.share_pv = <span style={{ color: '#333' }}>{item.share_pv}{txt_share_pv}</span>
        // 转发人数
        let txt_share_uv
        if (showNewUser) txt_share_uv = <span><span style={{ color: '#ddd' }}> / </span><span style={{ color: 'sienna' }}>{resByLastMonthlySummary.data_share_uv[idx]}</span></span>
        item.share_uv = <span style={{ color: '#333' }}>{item.share_uv}{txt_share_uv}</span>
      })
    }

    function onckboxChange(e) {
      const { value, checked } = e.target
      if (value === 1) {
        that.setState({
          showActiveUser: checked,
        })
        if (checked) {
          that.handleReload(1)
        }
      }
      if (value === 2) {
        that.setState({
          showNewUser: checked,
        })
        if (checked) {
          that.handleReload(2)
        }
      }
    }

    function disabledDate(current) {
      // Can not select days after today and today
      return current && current > moment().add(-1, 'days').endOf('day');
    }

    return (
      <Fragment>
        <Row gutter={16}>
          <Col span={24}>
            <div className={styles.p20}>
              <RangePicker
                // defaultValue={rangePickerValue}
                value={rangePickerValue}
                disabledDate={disabledDate}
                onChange={this.handleRangePickerChange}
                style={{ width: 256 }}
              />
              <Button type="primary" icon="reload" onClick={this.handleReload} style={{ marginLeft: 10 }}>刷新数据</Button>
              <span className={styles.query_data}>当前查询：{resByDailySummary.query_data}</span>
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
        <br />
        <Row type="flex" justify='center'>
          <Col span={4}>
            <Checkbox onChange={onckboxChange} value={1} checked={showActiveUser} style={{ color: 'sienna' }}>上周同期</Checkbox>
            <Checkbox onChange={onckboxChange} value={2} checked={showNewUser} style={{ color: 'blue' }}>上月同期</Checkbox>
          </Col>
        </Row>
        <br /><br />
      </Fragment>
    );
  }
}

export default Donut;
