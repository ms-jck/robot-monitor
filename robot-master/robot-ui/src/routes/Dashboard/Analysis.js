import React, { Component } from 'react';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import Store from 'store';
// import { Socket } from 'react-socket-io';
import { io, Socket } from 'socket.io-client';
import Picture1 from '../../components/picture1';
import Picture2 from '../../components/picture2';
import Picture3 from '../../components/picture3';
import Picture4 from '../../components/picture4';
import Picture5 from '../../components/picture5';
import Picture6 from '../../components/picture6';
import styles from './Analysis.less';

const socket = require('socket.io-client')('/socket/client', { transports: ['websocket'] });

@connect(({ monitor }) => ({
  monitor,
}))
export default class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      window1: { _id: null, picurl: 'static/pic/disconnect.jpg' },
      window2: { _id: null, picurl: 'static/pic/disconnect.jpg' },
      window3: { _id: null, picurl: 'static/pic/disconnect.jpg' },
      window4: { _id: null, picurl: 'static/pic/disconnect.jpg' },
      window5: { _id: null, picurl: 'static/pic/disconnect.jpg' },
      window6: { _id: null, picurl: 'static/pic/disconnect.jpg' },
      host1: { _id: null, picurl: 'static/pic/disconnect.jpg' },
      host2: { _id: null, picurl: 'static/pic/disconnect.jpg' },
      host3: { _id: null, picurl: 'static/pic/disconnect.jpg' },
      host4: { _id: null, picurl: 'static/pic/disconnect.jpg' },
      host5: { _id: null, picurl: 'static/pic/disconnect.jpg' },
      host6: { _id: null, picurl: 'static/pic/disconnect.jpg' },
      monitors: null,
    };
    socket.on('connect', () => {
      console.log('connect success');
      socket.emit('join', { room: Store.get('USER_NAME'), username: Store.get('USER_NAME') });
    });

    socket.on('message', (msg) => {
      console.log('recv msg:');
      console.log(msg);
    });

    socket.on('updatePic', (msg) => {
      console.log(`updatePic${msg.order}`);
      switch (msg.order) {
        case 1: {
          this.setState({
            'window1': msg,
          });
          break;
        }
        case 2: {
          this.setState({
            'window2': msg,
          });
          break;
        }
        case 3: {
          this.setState({
            'window3': msg,
          });
          break;
        }
        case 4: {
          this.setState({
            'window4': msg,
          });
          break;
        }
        case 5: {
          this.setState({
            'window5': msg,
          });
          break;
        }
        case 6: {
          this.setState({
            'window6': msg,
          });
          break;
        }
        default: break;
      }
    });
    // console.log('connectServer');
    // const ws = new WebSocket('ws://localhost:5000/socket/client');

    // ws.onopen = function (e) {
    //   console.log('连接上 ws 服务端了');
    //   ws.send(JSON.stringify({ a: 'a', data: 'dd' }));
    // };
    // ws.onmessage = function (msg) {
    //   console.log('接收服务端发过来的消息: %o', msg);
    // };
    // ws.onclose = function (e) {
    //   console.log('ws 连接关闭了');
    // };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'monitor/getMonitor',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.monitor) {
      this.state.monitors = nextProps.monitor.monitors;
      const { monitors } = nextProps.monitor;
      for (let i = 0; i < monitors.length; i += 1) {
        switch (monitors[i].order) {
          case 1: {
            this.state.host1 = monitors[i];
            this.state.window1 = monitors[i].status === 'running' ?
              { picurl: 'static/headPic/running.jpg' } :
              { picurl: 'static/headPic/notrunning.jpg' };
            break;
          }
          case 2: {
            this.state.host2 = monitors[i];
            this.state.window2 = monitors[i].status === 'running' ?
              { picurl: 'static/headPic/running.jpg' } :
              { picurl: 'static/headPic/notrunning.jpg' };
            break;
          }
          case 3: {
            this.state.host3 = monitors[i];
            this.state.window3 = monitors[i].status === 'running' ?
              { picurl: 'static/headPic/running.jpg' } :
              { picurl: 'static/headPic/notrunning.jpg' };
            break;
          }
          case 4: {
            this.state.host4 = monitors[i];
            this.state.window4 = monitors[i].status === 'running' ?
              { picurl: 'static/headPic/running.jpg' } :
              { picurl: 'static/headPic/notrunning.jpg' };
            break;
          }
          case 5: {
            this.state.host5 = monitors[i];
            this.state.window5 = monitors[i].status === 'running' ?
              { picurl: 'static/headPic/running.jpg' } :
              { picurl: 'static/headPic/notrunning.jpg' };
            break;
          }
          case 6: {
            this.state.host6 = monitors[i];
            this.state.window6 = monitors[i].status === 'running' ?
              { picurl: 'static/headPic/running.jpg' } :
              { picurl: 'static/headPic/notrunning.jpg' };
            break;
          }
          default: break;
        }
      }
    }
  }

  componentWillUnmount() {
  }

  // connectServer = () => {
  //   console.log('connectServer');
  //   const ws = new WebSocket('ws://localhost:5000/client');

  //   ws.onopen = function (e) {
  //     console.log('连接上 ws 服务端了');
  //     ws.send(JSON.stringify({ a: 'a', data: 'dd' }));
  //   };
  //   ws.onmessage = function (msg) {
  //     console.log('接收服务端发过来的消息: %o', msg);
  //   };
  //   ws.onclose = function (e) {
  //     console.log('ws 连接关闭了');
  //   };
  // }

  render() {
    console.log('Analysis render');
    const { window1, window2, window3, window4, window5, window6,
      host1, host2, host3, host4, host5, host6 } = this.state;
    const uri = 'http://localhost/test';
    const options = { transports: ['websocket'] };
    return (
      <div>
        <Row>
          <Col className={styles.gutter} span={8}>
            <Picture1 window={window1} host={host1} />
          </Col>
          <Col className={styles.gutter} span={8}>
            <Picture2 window={window2} host={host2} />
          </Col>
          <Col className={styles.gutter} span={8}>
            <Picture3 window={window3} host={host3} />
          </Col>
        </Row>
        <Row>
          <Col className={styles.gutter} span={8}>
            <Picture4 window={window4} host={host4} />
          </Col>
          <Col className={styles.gutter} span={8}>
            <Picture5 window={window5} host={host5} />
          </Col>
          <Col className={styles.gutter} span={8}>
            <Picture6 window={window6} host={host6} />
          </Col>
        </Row>
      </div>
    );
  }
}
