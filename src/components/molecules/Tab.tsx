import React from 'react';

interface IPropsTab {
  className?: string;
  label: string;
}

const Tab: React.FC<IPropsTab> = props => {
  return <div className={props.className}>{props.children}</div>;
};

export default Tab;
