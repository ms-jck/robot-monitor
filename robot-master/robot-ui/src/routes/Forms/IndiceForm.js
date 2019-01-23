import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Table, Card, Tag } from 'antd';

@connect(({ indice }) => ({
  indice,
}))
export default class IndiceForm extends PureComponent {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     dataSource: null,
  //   };
  // }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'indice/getIndices',
      payload: {},
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log('IndiceForm update');
  }

  handleDelete = (index) => {
    this.props.dispatch({ 'type': 'indice/deleteIndice', index });
  }

  showLogs = (index) => {
    console.log(`showlogs:${index}`);
    this.props.dispatch(routerRedux.push('/form/log', { 'index': index }));
  }

  render() {
    console.log(this.props);
    const { indice: { data } } = this.props;
    const columns = [{
      title: 'health',
      dataIndex: 'health',
      key: 'health',
      render(text) {
        if (text === 'green') return <Tag color="#87d068">{text}</Tag>;
        else if (text === 'yellow') return <Tag color="#faad14">{text}</Tag>;
        else return <Tag color="#f50">{text}</Tag>;
      },
    }, {
      title: 'status',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: 'index',
      dataIndex: 'index',
      key: 'index',
      render: text => <a onClick={(ev) => { this.showLogs(text); }}>{text}</a>,
    }, {
      title: '日志数量',
      dataIndex: 'docs.count',
      key: 'docs.count',
    }, {
      title: '大小',
      dataIndex: 'store.size',
      key: 'store.size',
    }, {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: record => <a onClick={(ev) => { this.handleDelete(record.index); }}>Delete</a>,
    }];
    return (
      <Card title="索引列表" bordered={false}>
        <Table
          rowKey="index"
          dataSource={data}
          columns={columns}
          /* onRow={(record) => {
            return {
              onClick: () => this.showLogs(record.index), // 点击行
            };
          }} */
        />
      </Card>
    );
  }
}
