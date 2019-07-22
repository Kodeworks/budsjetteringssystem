import React from 'react';
import styled from 'styled-components';

interface IPropsTab {
  className?: string;
  label: string;
}

const Tab: React.FC<IPropsTab> = props => {
  return  (
    <div className={props.className}>
      {props.children}
    </div>
  )
};

export default Tab;
