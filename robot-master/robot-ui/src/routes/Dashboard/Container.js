import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Row, Card, Tag } from 'antd';

@connect(({ container }) => ({
  container,
}))
export default class Container extends PureComponent {
  constructor(props) {
    super(props);
    const columns2 = [{
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'image',
      dataIndex: 'image',
      key: 'image',
    }, {
      title: 'labels',
      dataIndex: 'labels',
      key: 'labels',
    }, {
      title: 'status',
      dataIndex: 'status',
      key: 'status',
      render(text) {
        if (text === 'running') return <Tag color="#87d068">{text}</Tag>;
        else return <Tag color="#faad14">{text}</Tag>;
      },
    }];
    const columns1 = [{
      title: 'status',
      dataIndex: 'status',
      key: 'status',
      render(text) {
        if (text === 'running') return <Tag color="#87d068">{text}</Tag>;
        else return <Tag color="#faad14">{text}</Tag>;
      },
    }, {
      title: 'ip',
      dataIndex: '_id',
      key: '_id',
    }, {
      title: 'hostname',
      dataIndex: 'hostname',
      key: 'hostname',
    }, {
      title: 'time',
      dataIndex: 'time',
      key: 'time',
    }, {
      title: 'cpu',
      align: 'center',
      children: [{
        title: '个数',
        dataIndex: 'cpu.count',
        key: 'cpu.count',
        align: 'center',
      }, {
        title: '使用率',
        dataIndex: 'cpu.percent',
        key: 'cpu.percent',
        align: 'center',
      }],
    }, {
      title: '内存',
      align: 'center',
      children: [{
        title: '大小',
        dataIndex: 'memory.total',
        key: 'memory.total',
        align: 'center',
      }, {
        title: '使用率',
        dataIndex: 'memory.percent',
        key: 'memory.percent',
        align: 'center',
      }],
    }];
    this.state = {
      hostid: props.location.state.hostid,
      host: null,
      columns1,
      columns2,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'container/getHost',
      id: this.state.hostid,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.container) {
      this.state.host = nextProps.container.host;
    }
  }

  render() {
    const { host } = this.state;
    const containers = host ? host.containers : null;
    const hostdata = host ? [{ ...host }] : null;
    return (
      <Row>
        <Card title="主机信息" bordered={false}>
          <Table
            rowKey="hostname"
            pagination={false}
            dataSource={hostdata}
            columns={this.state.columns1}
          />
        </Card>
        <Card title="容器列表" bordered={false} style={{ top: 20 }}>
          <Table
            rowKey="id"
            dataSource={containers}
            columns={this.state.columns2}
            pagination={false}
          />
        </Card>
      </Row>
    );
  }
}
