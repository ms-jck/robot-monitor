import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Card,
  List,
  Tag,
  Row,
  Col,
  Icon,
  Input,
  Modal,
} from 'antd';

import styles from './Monitor.less';

const { Search } = Input;

@connect(({ monitor, loading }) => ({
  monitor,
  loading: loading.models.monitor,
}))
export default class Monitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hosts: {},
      visible: false,
      eidtId: null,
      remarks: null,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'monitor/getHosts',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.monitor) {
      this.state.hosts = nextProps.monitor.hosts;
    }
  }

  addMonitor = (id) => {
    console.log('addMonitor');
    this.props.dispatch({
      type: 'monitor/addMonitor',
      params: {
        ip: id,
      },
    });
  }

  deleteMonitor = (id) => {
    console.log('deleteMonitor');
    this.props.dispatch({
      type: 'monitor/deleteMonitor',
      params: {
        ip: id,
      },
    });
  }

  deleteHost = (id) => {
    console.log('deleteHost');
    this.props.dispatch({
      type: 'monitor/deleteHost',
      id,
    });
  }

  editHost = (id, remarks) => {
    this.setState({
      visible: true,
      eidtId: id,
      remarks,
    });
  }

  details = (id) => {
    this.props.dispatch(routerRedux.push('/dashboard/container', { 'hostid': id }));
  }

  handleOk = () => {
    if (this.state.input) {
      this.props.dispatch({
        type: 'monitor/editHost',
        params: {
          id: this.state.eidtId,
          remarks: this.state.input,
        },
      });
    }
    this.setState({
      visible: false,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handelChange = (e) => {
    this.state.input = e.target.value;
  }

  render() {
    const { hosts, remarks } = this.state;
    const { loading } = this.props;
    return (
      <div className={styles.cardList}>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={hosts}
          renderItem={item => (
            <List.Item key={item._id}>
              <Card
                hoverable
                className={styles.card}
                actions={[item.isMonitor ?
                  <a onClick={(ev) => { this.deleteMonitor(item._id); }}>取消监视</a>
                  : <a onClick={(ev) => { this.addMonitor(item._id); }}>加入监视</a>,
                  <a onClick={(ev) => { this.editHost(item._id, item.remarks); }}>编辑备注</a>,
                  <a onClick={(ev) => { this.deleteHost(item._id); }}>删除主机</a>]}
              >
                <Card.Meta
                  onClick={(ev) => { this.details(item._id); }}
                  avatar={(
                    <div className={styles.divAvatar}>
                      <img alt="" className={styles.cardAvatar} src="/static/headPic/computer.png" />
                      <div>{item._id}</div>
                      <div><Tag color={item.status === 'running' ? '#87d068' : '#faad14'}>{item.status}</Tag></div>
                    </div>
                  )}
                  title={<div><span className={styles.hostname}>{item.hostname}</span>{item.isMonitor ? <Icon className={styles.icon} type="eye" /> : ''}</div>}
                  description={
                    <div>
                      <Row>
                        <Col span={12}>cpu数：{item.cpu.count}</Col>
                        <Col span={12}>使用率： {item.cpu.percent}%</Col>
                      </Row>
                      <Row>
                        <Col span={12}>内存：{item.memory.total}G</Col>
                        <Col span={12}>使用率：{item.memory.percent}%</Col>
                      </Row>
                      <Row>
                        <Col span={24}>容器数量：{item.containerNum}</Col>
                      </Row>
                    </div>
                  }
                />
                <div style={{ marginTop: 10 }}>
                  备注：{item.remarks}
                </div>
              </Card>
            </List.Item>
          )}
        />
        <Modal
          destroyOnClose
          visible={this.state.visible}
          title="编辑备注"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
        >
          <Input type="text" placeholder="备注信息" onChange={this.handelChange} defaultValue={remarks} />
        </Modal>
      </div>
    );
  }
}
