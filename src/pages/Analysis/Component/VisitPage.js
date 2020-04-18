import React, { Fragment } from 'react';
import {
  Row,
  Col,
  DatePicker,
  Button,
  Table,
} from 'antd';
import moment from 'moment';
import styles from '../../Charts/chart.less';

const { RangePicker } = DatePicker;


class Donut extends React.Component {
  state = {
  };

  // 重新选择日期范围时触发
  handleRangePickerChange = (val, curSelectedDate) => {
    const { onRefreshSelectDate } = this.props
    onRefreshSelectDate(moment(curSelectedDate[0]), moment(curSelectedDate[1]))
  };

  // 刷新数据
  handleReload = () => {
    const { onReloadData } = this.props
    onReloadData()
  }

  render() {
    const { dataSource: { query_data, list }, rangePickerValue } = this.props

    /* 详细数据 */
    const columns = [
      { title: '页面路径', dataIndex: 'page_path', key: 'page_path', width: 120 },
      { title: '访问次数', dataIndex: 'page_visit_pv', key: 'page_visit_pv', width: 100 },
      { title: '访问人数', dataIndex: 'page_visit_uv', key: 'page_visit_uv', width: 100 },
      {
        title: '次均停留时长(s)', dataIndex: 'page_staytime_pv', key: 'page_staytime_pv', width: 100,
        render: (value, row, index) => <span>{(row.page_staytime_pv_sum === 0 || row.page_visit_pv === 0) ? 0 : (row.page_staytime_pv_sum / row.page_visit_pv).toFixed(2)}</span>,
      },
      { title: '进入页次数', dataIndex: 'entrypage_pv', key: 'entrypage_pv', width: 100 },
      { title: '退出页次数', dataIndex: 'exitpage_pv', key: 'exitpage_pv', width: 100 },
      {
        title: '退出率', dataIndex: 'entrypage_pv_rate', key: 'entrypage_pv_rate', width: 100,
        render: (value, row, index) => <span>{(row.page_visit_pv === 0 || row.exitpage_pv === 0) ? 0 : (row.exitpage_pv / row.page_visit_pv * 100).toFixed(2)}%</span>,
      },
      { title: '转发次数', dataIndex: 'page_share_pv', key: 'page_share_pv', width: 100 },
      { title: '转发人数', dataIndex: 'page_share_uv', key: 'page_share_uv', width: 100 },
    ];

    const data = []
    if (list) {
      // console.info('dataSource', dataSource)
      const listName = []
      list.forEach(single => {
        single.list.forEach(item => {
          if (listName.indexOf(item.page_path) === -1) {
            listName.push(item.page_path)
            data.push({
              page_path: item.page_path,
              page_visit_pv: item.page_visit_pv,
              page_visit_uv: item.page_visit_uv,
              page_staytime_pv: item.page_staytime_pv,//.toFixed(2),
              page_staytime_pv_sum: item.page_staytime_pv * item.page_visit_pv, // 总的停留时长
              entrypage_pv: item.entrypage_pv,
              exitpage_pv: item.exitpage_pv,
              entrypage_pv_rate: item.entrypage_pv_rate,//`${entrypage_pv_rate}%`,
              page_share_pv: item.page_share_pv,
              page_share_uv: item.page_share_uv,
            })
          }
          else {
            data.forEach(d => {
              if (d.page_path === item.page_path) {
                d.page_visit_pv += item.page_visit_pv
                d.page_visit_uv += item.page_visit_uv
                d.page_staytime_pv += item.page_staytime_pv
                d.page_staytime_pv_sum += item.page_staytime_pv * item.page_visit_pv
                d.entrypage_pv += item.entrypage_pv
                d.exitpage_pv += item.exitpage_pv
                //d.entrypage_pv_rate += item.entrypage_pv_rate
                d.page_share_uv += item.page_share_uv
                d.count += item.page_share_uv
              }
            })
          }
        })
      })
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
              <span className={styles.query_data}>当前查询：{query_data}</span>
            </div>
          </Col>
        </Row>
        {/* <br /> */}
        <Row gutter={16}>
          <Col span={24}>
            {/* <h3>详细数据</h3> */}
            <Table
              rowKey={record => record.page_path}
              size="small"
              columns={columns}
              dataSource={data}
              pagination={false}
              style={{ border: 'none' }}
              className={styles.table_noborder}
            />
            <br />
            <br />
            <br />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default Donut;
