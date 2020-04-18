import React, { Fragment } from 'react';
import {
  Row,
  Col,
  Table,
  Card,
  Checkbox,
  Radio,
} from 'antd';
import styles from '../../Charts/chart.less';

const RadioGroup = Radio.Group;

class Donut extends React.Component {
  state = {
  };

  render() {
    const { dataSource } = this.props
    // console.info('dataSource', dataSource)

    // 详细数据 table
    const getTableHtml = (type) => {
      const {
        showActiveUserByProvince = true, showActiveUserByAge = true,
        showNewUserByProvince = true, showNewUserByAge = true,
        rdgvalueByProvince = 1, rdgvalueByAge = 1,
      } = this.state
      const showActiveUser = type === 'province' ? showActiveUserByProvince : showActiveUserByAge
      const showNewUser = type === 'province' ? showNewUserByProvince : showNewUserByAge
      const rdgvalue = type === 'province' ? rdgvalueByProvince : rdgvalueByAge

      const that = this
      const columns = [
        { title: '序号', dataIndex: 'id', key: 'id', width: 100, sorter: (a, b) => a.id - b.id },
        { title: '地区', dataIndex: 'name', key: 'name', width: 200 },
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
          if (type === 'province') {
            that.setState({ showActiveUserByProvince: checked })
          }
          else {
            that.setState({ showActiveUserByAge: checked })
          }
        }
        if (value === 2) {
          // that.setState({
          //   showNewUser: checked,
          // })
          if (type === 'province') {
            that.setState({ showNewUserByProvince: checked })
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
        if (type === 'province') {
          that.setState({ rdgvalueByProvince: e.target.value })
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
          <Card title="详细数据 -> 地区分布（省份）" bordered={true}>
            {getTableHtml('province')}
            <br /><br />
          </Card>
          <br /><br />
          <Card title="详细数据 -> 地区分布（城市）" bordered={true}>
            {getTableHtml('city')}
            <br /><br />
          </Card>
        </div>
      </Fragment>
    );
  }
}

export default Donut;
