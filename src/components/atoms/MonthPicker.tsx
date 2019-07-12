import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

interface IProps {
  className?: string;
  month: moment.Moment;
  setState: React.Dispatch<React.SetStateAction<any>>;
}

const MonthPicker: React.FC<IProps> = props => {
  const decreaseMonth = () => {
    props.setState(props.month.clone().subtract(1, 'month'));
  };

  const increaseMonth = () => {
    props.setState(props.month.clone().add(1, 'month'));
  };

  return (
    <div className={props.className}>
      <h2>Month</h2>
      <h5>
        <span className={'decrease'} onClick={decreaseMonth}>{'<  '}</span>
        <span>{props.month.format('MMM YY')}</span>
        <span className={'increase'} onClick={increaseMonth}>{'  >'}</span>
      </h5>
    </div>
  );
};

export default styled(MonthPicker)`
  margin-bottom: 2em;
  display: grid;
  grid-template-columns: 95%;
  text-align: center;

  h5 {
    font-size: 1em;
    margin-top: 0.2em
    background-color: ${props => props.theme.palette.background.paper};
  }
  .increase, .decrease {
    cursor: pointer;
    font-weight: bold;
  }
`;
