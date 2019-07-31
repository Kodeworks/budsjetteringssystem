import React from 'react';

interface ITabProps {
  className?: string;
  label: string;
}

const Tab: React.FC<ITabProps> = props => {
  return <div className={props.className}>{props.children}</div>;
};

export default Tab;
