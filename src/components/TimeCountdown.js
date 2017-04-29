import React from 'react';
import countdown from 'countdown';

export default class TimeCountdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date(), patchStart: new Date(2017,7,25,20,0,0)};
    
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div style={{position:"relative",top:150}}>
        <h1>{countdown(this.state.date, this.state.patchStart, countdown.DAYS|countdown.HOURS|countdown.MINUTES|countdown.SECONDS).toString()}.</h1>
      </div>
    );
  }
}