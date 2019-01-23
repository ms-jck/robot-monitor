import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Card, Tag, Input } from 'antd';
import styles from './Log.less';

@connect(({ log, loading }) => ({
  log,
  loading: loading.models.log,
}))
export default class Log extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      index: 'logstash-2018.08.24',
      query: { 'match_all': {} },
      pageSize: 10,
      current: 1,
    };
    if (props.history.location.state) {
      this.state.index = props.history.location.state.index;
      this.getResult();
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    console.log('Log update');
  }

  getResult = () => {
    this.props.dispatch({
      type: 'log/getLogs',
      url: `${this.state.index}/_search`,
      params: {
        size: this.state.pageSize,
        from: this.state.pageSize * (this.state.current - 1),
        query: this.state.query,
      },
    });
  }

  // handleDelete = (record) => {
  //   this.props.dispatch({
  //     'type': 'log/deleteLog',
  //     deleteUrl: `${record._index}/${record._type}/${record._id}`,
  //     getUrl: `${this.state.index}/_search`,
  //     params: {
  //       size: this.state.pageSize,
  //       from: this.state.pageSize * (this.state.current - 1),
  //       query: this.state.query,
  //     },
  //   });
  // }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(filters);
    console.log(sorter);
    this.state.pageSize = pagination.pageSize;
    this.state.current = pagination.current;
    this.getResult();
  };

  handleSearch = (value, event) => {
    this.state.current = 1;
    if (value) this.state.query = { 'query_string': { 'query': value } };
    else this.state.query = { 'match_all': {} };
    this.getResult();
  }

  render() {
    const { log: { dataSource, total }, loading } = this.props;
    const { pageSize, current } = this.state;
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      current,
      pageSize,
      total,
    };

    const columns = [{
      title: 'type',
      dataIndex: '_type',
      key: '_type',
    }, {
      title: 'host',
      dataIndex: '_source.host',
      key: 'host',
    }, {
      title: 'path',
      dataIndex: '_source.path',
      key: 'path',
    }, {
      title: 'time',
      dataIndex: '_source.@timestamp',
      key: 'time',
    }, {
      title: 'message',
      dataIndex: '_source.message',
      key: 'message',
      render(text) {
        if (text === undefined) return text;
        let newText = text;
        if (newText.length > 100) {
          newText = `${newText.substring(0, 100)}...`;
        }
        if (text.indexOf('ERROR') > -1) { return <span className={styles.error}>{newText}</span>; } else if (text.indexOf('DEBUG') > -1) { return <span className={styles.debug}>{newText}</span>; } else { return <span>{newText}</span>; }
      },
    }];

    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="请输入"
          enterButton="搜索"
          size="large"
          onSearch={this.handleSearch}
          style={{ width: 522 }}
        />
      </div>
    );
    return (
      <div>
        <Card title={mainSearch} bordered={false}>
          <Table
            rowKey="_id"
            dataSource={dataSource}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onChange={this.handleTableChange}
            expandedRowRender={record => <p style={{ margin: 0 }}>{record._source.message}</p>}
          />
        </Card>
      </div>
    );
  }
}
