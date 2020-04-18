import React, { Fragment } from 'react';
import {
  Row,
  Col,
  Table,
  Card,
  Checkbox,
  Radio,
} from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
  Guide,
  Coord,
  Label,
} from "bizcharts";
import DataSet from "@antv/data-set";
import styles from '../../Charts/chart.less';

const RadioGroup = Radio.Group;

class Donut extends React.Component {
  state = {
  };

  // 获取用户总数
  getUserCount = (data) => {
    let sum = 0
    if (data) {
      const { genders } = data
      genders.forEach(item => {
        sum += item.value
      })
    }
    return sum
  }

  render() {
    const { DataView } = DataSet;
    const { Html } = Guide;

    const { dataSource } = this.props
    // console.info('dataSource', dataSource)

    // 终端及机型分布 chart
    const getUserSexHtml = (type) => {
      const data = []
      const sum = this.getUserCount(dataSource[type])
      let part_sum = 0 // 已知机型的汇总
      if (dataSource && dataSource[type]) {
        const { devices } = dataSource[type]
        devices.forEach(item => {
          data.push({
            item: item.name,
            count: item.value,
          })
          part_sum += item.value
        })
      }

      // 未知机型
      if (sum !== part_sum) {
        data.push({
          item: '未知的终端及机型',
          count: sum - part_sum,
        })
      }

      const dv = new DataView();
      dv.source(data).transform({
        type: "percent",
        field: "count",
        dimension: "item",
        as: "percent",
      });
      const cols = {
        percent: {
          formatter: val => {
            return `${(val * 100).toFixed(2)}%`;
          },
        },
      };

      return (
        <div>
          <Chart
            height={400}
            data={dv}
            scale={cols}
            padding={[80, 300, 0, 0]}
            // padding={0}
            forceFit
          >
            <Coord type='theta' radius={0.75} innerRadius={0.6} />
            <Axis name="percent" />
            <Legend
              position="right"
              //offsetY={-window.innerHeight / 2 + 120}
              offsetX={-20}
            />
            <Tooltip
              showTitle={false}
              itemTpl={`<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>`}
            />
            <Guide>
              {<Html
                position={["50%", "50%"]}
                html={`<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">总用户数<br><span style="color:#262626;font-size:2.5em">${sum}</span>个</div>`}
                alignX="middle"
                alignY="middle"
              />}
            </Guide>
            <Geom
              type="intervalStack"
              position="percent"
              color="item"
              tooltip={[
                "item*percent",
                (item, percent) => {
                  const percent2 = `${(percent * 100).toFixed(2)}%`;
                  return {
                    name: item,
                    value: percent2,
                  };
                },
              ]}
              style={{
                lineWidth: 1,
                stroke: "#fff",
              }}
            >
              <Label
                content="percent"
                formatter={(val, item) => {
                  return `${item.point.item}：${val}`;
                }}
              />
            </Geom>
          </Chart>
        </div>
      )
    };

    // 详细数据 table
    const getTableHtml = (type) => {
      const {
        showActiveUserByGender = true, showActiveUserByAge = true,
        showNewUserByGender = true, showNewUserByAge = true,
        rdgvalueByGender = 1, rdgvalueByAge = 1,
      } = this.state
      const showActiveUser = type === 'devices' ? showActiveUserByGender : showActiveUserByAge
      const showNewUser = type === 'devices' ? showNewUserByGender : showNewUserByAge
      const rdgvalue = type === 'devices' ? rdgvalueByGender : rdgvalueByAge

      const that = this
      const columns = [
        { title: '序号', dataIndex: 'id', key: 'id', width: 100, sorter: (a, b) => a.id - b.id },
        { title: 'name', dataIndex: 'name', key: 'name', width: 200 },
        { title: '人数', dataIndex: 'value', key: 'value', width: 200 },
      ];
      const data = []
      if (dataSource) {
        const splitStr = showActiveUser && showNewUser ? ' / ' : ''

        // showActiveUser
        const txt_showActiveUser_arr = [];
        if (showActiveUser) {
          let sum = 0
          if (rdgvalue === 2) {
            dataSource.visit_uv[type].forEach(item => {
              sum += item.value
            })
          }
          dataSource.visit_uv[type].forEach(item => {
            txt_showActiveUser_arr.push(rdgvalue === 1 ? item.value : `${(item.value / sum * 100).toFixed(2)}%`)
          })
        }

        // showNewUser
        const txt_showNewUser_arr = [];
        if (showNewUser) {
          let sum = 0
          if (rdgvalue === 2) {
            dataSource.visit_uv_new[type].forEach(item => {
              sum += item.value
            })
          }
          dataSource.visit_uv_new[type].forEach(item => {
            txt_showNewUser_arr.push(rdgvalue === 1 ? item.value : `${(item.value / sum * 100).toFixed(2)}%`)
          })
        }

        dataSource.visit_uv[type].forEach((item, idx) => {
          data.push({
            id: idx,
            name: item.name,
            value: <div><span>{txt_showActiveUser_arr[idx]}</span><span style={{ color: '#ddd' }}>{splitStr}</span><span style={{ color: 'sienna' }}>{txt_showNewUser_arr[idx]}</span></div>, //item.value,
          })
        })
      }

      function onckboxChange(e) {
        const { value, checked } = e.target
        if (value === 1) {
          // that.setState({
          //   showActiveUser: checked,
          // })
          if (type === 'devices') {
            that.setState({ showActiveUserByGender: checked })
          }
          else {
            that.setState({ showActiveUserByAge: checked })
          }
        }
        if (value === 2) {
          // that.setState({
          //   showNewUser: checked,
          // })
          if (type === 'devices') {
            that.setState({ showNewUserByGender: checked })
          }
          else {
            that.setState({ showNewUserByAge: checked })
          }
        }
      }

      function onrdgChange(e) {
        // that.setState({
        //   rdgvalue: e.target.value,
        // })
        if (type === 'devices') {
          that.setState({ rdgvalueByGender: e.target.value })
        }
        else {
          that.setState({ rdgvalueByAge: e.target.value })
        }
      }

      return (
        <Fragment>
          <Row>
            <Col span={24}>
              {/* <h3>最受欢迎小说排行</h3> */}
              <Table
                rowKey={record => record.id}
                size="small"
                columns={columns}
                dataSource={data}
                pagination={false}
              />
            </Col>
          </Row>
          <br />
          <Row type="flex" justify='center'>
            <Col span={4}>
              <Checkbox onChange={onckboxChange} value={1} defaultChecked={showActiveUser}>活跃用户</Checkbox>
              <Checkbox onChange={onckboxChange} value={2} style={{ color: 'sienna' }} defaultChecked={showNewUser}>新增用户</Checkbox>
            </Col>
            <Col span={4}>
              <RadioGroup onChange={onrdgChange} value={rdgvalue}>
                <Radio value={1}>数字</Radio>
                <Radio value={2}>百分比</Radio>
              </RadioGroup>
            </Col>
          </Row>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <div style={{ padding: '20px' }}>
          <br />
          <Card title="活跃用户" bordered={true} style={{ minHeight: '520px' }}>
            <Row gutter={16}>
              <Col span={18}>
                {getUserSexHtml('visit_uv')}
                <Row type="flex" justify='center'>
                  <span className={styles.legend_bottom_title}>终端及机型分布</span>
                </Row>
              </Col>
            </Row>
          </Card>
          <br /><br />
          <Card title="新增用户" bordered={true}>
            <Row gutter={16}>
              <Col span={18}>
                {getUserSexHtml('visit_uv_new')}
                <Row type="flex" justify='center'>
                  <span className={styles.legend_bottom_title}>终端及机型分布</span>
                </Row>
              </Col>
            </Row>
          </Card>
          <br /><br />
          <Card title="详细数据 -> 终端及机型分布" bordered={true}>
            {getTableHtml('devices')}
            <br /><br />
          </Card>
          <br /><br />
        </div>
      </Fragment>
    );
  }
}

export default Donut;
