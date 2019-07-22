import React from 'react';
import styled from 'styled-components';

export interface IPropsTab {
  className?: string;
  activeTab: string;
  label: string;
  children: any;
  onClickTab: (label: string) => void;
}

const UnstyledTab: React.FC<IPropsTab> = props => {
  const { activeTab, label, onClickTab } = props;

  const onClick = () => {
    onClickTab(label);
  };

  let classname = 'tab-list-item';
  if (activeTab === label) {
    classname += ' tab-list-active';
  }
  return (
    <li className={classname} onClick={onClick}>
      {label}
    </li>
  );
};

const Tab = styled(UnstyledTab)`
  margin 0;
`;

export default Tab;
