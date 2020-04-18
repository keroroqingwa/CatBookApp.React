import React from "react";
import {
  Row,
  Col,
  DatePicker,
  Button,
  Spin,
  Table,
  Tooltip as AntdTooltip,
  Checkbox,
  Radio,
} from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Legend,
  Tooltip,
} from "bizcharts";
import moment from 'moment';
import { connect } from 'dva';
import styles from '../../Charts/chart.less';

import { getTimeDistance } from '@/utils/utils';

const { RangePicker, MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;

// 查询列表数据url
const queryDataUrl = 'analysis/getAnalysisMonthlyRetain';

@connect(({ analysis, loading }) => ({
  analysis,
  loading: loading.effects[queryDataUrl],
}))
class Donut extends React.Component {
  state = {
    rangePickerValue: getTimeDistance('month'),
    curSelectedDate: null,
    // 显示活跃用户(表格)
    showActiveUser: true,
    // 显示新增用户(表格)
    showNewUser: true,
    rdgvalue: 1,
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

  // handleRangePickerChange = (val, curSelectedDate) => {
  //   console.info('handleRangePickerChange', val, curSelectedDate)
  //   this.setState({
  //     curSelectedDate,
  //   });
  // };

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
    const { rangePickerValue, showActiveUser, showNewUser, rdgvalue } = this.state;
    const {
      loading,
      analysis: { resByMonthlyRetain },
    } = this.props;
    const that = this

    const data = []
    const data2 = []
    const cols = {
      year: {
        type: 'cat',
        // tickInterval: 50,
      },
    }
    if (resByMonthlyRetain && resByMonthlyRetain.columns) {
      for (let i = 0; i < resByMonthlyRetain.columns.length; i += 1) {
        const curCol = resByMonthlyRetain.columns[i]
        for (let j = 0; j < resByMonthlyRetain.data.length; j += 1) {
          const curRow = resByMonthlyRetain.data[j]
          data.push({ country: curCol === 0 ? '当月' : `${curCol}月后`, year: curRow.ref_date, value: curRow.visit_uv[i] || 0 })
          data2.push({ country: curCol === 0 ? '当月' : `${curCol}月后`, year: curRow.ref_date, value: curRow.visit_uv_new[i] || 0 })
        }
      }
      // console.info('data', data)
    }

    const tableData = []
    const columns = []
    // console.info('resByMonthlyRetain', resByMonthlyRetain)
    if (resByMonthlyRetain && resByMonthlyRetain.columns) {
      const splitStr = showActiveUser && showNewUser ? ' / ' : ''
      columns.push({ title: '日期', dataIndex: 'ref_date', key: 'ref_date', width: 120, sorter: (a, b) => a.ref_date - b.ref_date })
      resByMonthlyRetain.columns.forEach((item, idx) => {
        if (item === 0)
          columns.push({ title: `${showActiveUser ? '活跃用户数' : ''}${splitStr}${showNewUser ? '新增用户数' : ''}`, dataIndex: `key_visit_uv_${idx}`, key: `key_visit_uv_${idx}`, width: 220 })
        else
          columns.push({ title: `${item}月后`, dataIndex: `key_visit_uv_${idx}`, key: `key_visit_uv_${idx}`, width: 80 })
      })

      resByMonthlyRetain.data.forEach((item, idx) => {
        const singleObj = {}
        singleObj.ref_date = item.ref_date
        for (let i = 0; i < resByMonthlyRetain.columns.length; i += 1) {
          let txt
          let visitUV = item.visit_uv[i]
          let visitUVNew = item.visit_uv_new[i]

          if (visitUV >= 0) {
            if (rdgvalue === 2) {
              // 显示百分比
              if (i > 0) {
                visitUV = `${(visitUV / item.visit_uv[0] * 100).toFixed(2)}%`
                visitUVNew = `${(visitUVNew / item.visit_uv_new[0] * 100).toFixed(2)}%`
              }
            }
            txt = <div style={{ color: '#ddd' }}>{<span style={{ color: '#999' }}>{showActiveUser && visitUV}</span>}{splitStr}{<span style={{ color: 'sienna', fontWeight: 'bold' }}>{showNewUser && visitUVNew}</span>}</div>
          }
          else {
            visitUV = visitUV || '--'
            visitUVNew = visitUVNew || '--'
            txt = <div style={{ color: '#ddd' }}>{visitUVNew}{splitStr}{visitUVNew}</div>
          }
          singleObj[`key_visit_uv_${i}`] = <AntdTooltip placement="bottomLeft" title={`活跃留存：${visitUV}，新增留存：${visitUVNew}`}>{txt}</AntdTooltip>
        }
        tableData.push(singleObj)
      })

      // console.info('columns', columns)
      // console.info('tableData', tableData)
    }

    function onckboxChange(e) {
      const { value, checked } = e.target
      if (value === 1) {
        that.setState({
          showActiveUser: checked,
        })
      }
      if (value === 2) {
        that.setState({
          showNewUser: checked,
        })
      }
    }

    function onrdgChange(e) {
      that.setState({
        rdgvalue: e.target.value,
      })
    }

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
                disabledDate={disabledDate}
                format='YYYY-MM'
                onChange={this.handleRangePickerChange}
                style={{ width: 256 }}
              /> */}
              <MonthPicker defaultValue={rangePickerValue[0]} onChange={this.handleRangePickerChange1} disabledDate={disabledDate} placeholder="开始时间" />
              <span> ~ </span>
              <MonthPicker defaultValue={rangePickerValue[1]} onChange={this.handleRangePickerChange2} disabledDate={disabledDate} placeholder="结束时间" />
              <Button type="primary" icon="reload" onClick={this.handleReload} style={{ marginLeft: 10 }}>刷新数据</Button>
              <span className={styles.query_data}>当前查询：{resByMonthlyRetain && resByMonthlyRetain.query_data}</span>
            </div>
            <h3>活跃留存</h3>
            <Chart height={400} data={data} scale={cols} forceFit>
              <Axis name="year" />
              <Axis name="value" />
              <Legend />
              <Tooltip crosshairs={{ type: 'line' }} />
              <Geom type="area" position="year*value" color='country' />
              <Geom type="line" position="year*value" size={2} color='country' />
            </Chart>
            <br />
            <h3>新增留存</h3>
            <Chart height={400} data={data2} scale={cols} forceFit>
              <Axis name="year" />
              <Axis name="value" />
              <Legend />
              <Tooltip crosshairs={{ type: 'line' }} />
              <Geom type="area" position="year*value" color='country' />
              <Geom type="line" position="year*value" size={2} color='country' />
            </Chart>
          </Col>
        </Row>
        <br />
        <Row gutter={16}>
          <Col span={24}>
            <h3>详细数据</h3>
            <Table
              rowKey={record => record.ref_date}
              size="small"
              columns={columns}
              dataSource={tableData.reverse()}
              pagination={false}
              style={{ border: 'none' }}
              className={styles.table_noborder}
            />
          </Col>
        </Row>
        <br />
        <Row type="flex" justify='center'>
          <Col span={4}>
            <Checkbox onChange={onckboxChange} value={1} defaultChecked={showActiveUser}>活跃留存</Checkbox>
            <Checkbox onChange={onckboxChange} value={2} defaultChecked={showNewUser}>新增留存</Checkbox>
          </Col>
          <Col span={4}>
            <RadioGroup onChange={onrdgChange} value={rdgvalue}>
              <Radio value={1}>数字</Radio>
              <Radio value={2}>百分比</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <br /><br />
      </Spin>
    );
  }
}

export default Donut;
