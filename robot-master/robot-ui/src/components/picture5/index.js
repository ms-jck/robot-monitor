import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Icon } from 'antd';
import styles from './index.less';

@connect(({ picture5 }) => ({
  picture5,
}))
export default class Picture5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.window,
      host: this.props.host,
      visible: false,
      running: true,
      // x: -1,
      // y: -1,
      // width: 0,
      // height: 0,
      // rx: 0,
      // ry: 0,
      // d: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.state.data = nextProps.window;
    this.state.host = nextProps.host;
  }

  // getX = (obj) => {
  //   let parObj = obj;
  //   let left = obj.offsetLeft;
  //   while (parObj = parObj.offsetParent) {
  //     left += parObj.offsetLeft;
  //   }
  //   return left;
  // }

  // getY = (obj) => {
  //   let parObj = obj;
  //   let top = obj.offsetTop;
  //   while (parObj = parObj.offsetParent) {
  //     top += parObj.offsetTop;
  //   }
  //   return top;
  // }

  // handleMouseClick = (event) => {
  //   const obj = document.getElementById('details');
  //   const top = this.getY(obj);
  //   const left = this.getX(obj);
  //   const newX = event.pageX - left;
  //   const newY = event.pageY - top;
  //   console.log(`newX:${newX} newY:${newY}`);
  //   console.log(`width:${obj.width} height:${obj.height}`);

  //   this.setState({
  //     x: newX,
  //     y: newY,
  //     width: obj.width,
  //     height: obj.height,
  //     rx: (newX + obj.offsetLeft) - 4,
  //     ry: (newY + obj.offsetTop) - 4,
  //     d: 8,
  //   });
  // };

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    // console.log('send');
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'picture5/submitErrorPic',
    //   payload: {
    //     x: this.x,
    //     y: this.y,
    //     pic: '001.jpg',
    //   },
    // });
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  stopRobot = () => {
    if (this.state.host._id) {
      this.props.dispatch({
        type: 'picture5/stopRobot',
        payload: {
          ip: this.state.host._id,
        },
      });
      this.setState({
        running: false,
      });
    }
  }

  startRobot = () => {
    if (this.state.host._id) {
      this.props.dispatch({
        type: 'picture5/startRobot',
        payload: {
          ip: this.state.host._id,
        },
      });
      this.setState({
        running: true,
      });
    }
  }

  restartRobot = () => {
    if (this.state.host._id) {
      this.props.dispatch({
        type: 'picture5/restartRobot',
        payload: {
          ip: this.state.host._id,
        },
      });
      this.setState({
        running: true,
      });
    }
  }

  render() {
    const { host, data, running, x, y, width, height, rx, ry, d } = this.state;
    let bt = null;
    if (host._id && host.status === 'running') {
      if (running) {
        bt = (
          <div className={styles.button}>
            <Icon
              className={styles.icon}
              type="pause-circle-o"
              onClick={this.stopRobot}
            />
            <Icon
              className={styles.icon}
              type="reload"
              onClick={this.restartRobot}
            />
          </div>
        );
      } else {
        bt = (
          <div className={styles.button}>
            <Icon
              className={styles.icon}
              type="play-circle-o"
              onClick={this.startRobot}
            />
          </div>
        );
      }
    } else {
      bt = null;
    }
    return (
      <div>
        <div className={styles.pichead}>
          <span className={styles.text}>
            { host._id ? `${host._id} (${host.status})` : '' }
            {'  '}
            {data.time}
          </span>
          {bt}
        </div>
        <img
          onClick={this.showModal}
          className={styles.pic}
          alt="监视中"
          src={`/${data.picurl}`}
        />
        <Modal
          destroyOnClose
          visible={this.state.visible}
       /* title={`请点击正确位置: (${x}/${width}, ${y}/${height})`} */
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={800}
          okText="确认"
        >
          <div className={styles.picDiv}>
            <img
              id="details"
              className={styles.picDetail}
              src={`/${data.picurl}`}
              alt=""
           /* onClick={this.handleMouseClick} */
            />
            <div className={styles.redBall} style={{ top: ry, left: rx, width: d, height: d }} />
          </div>
        </Modal>
      </div>
    );
  }
}
