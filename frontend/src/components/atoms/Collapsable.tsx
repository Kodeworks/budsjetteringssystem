import React from 'react';

import styled from 'styled-components';

interface ICollapsableHeadingProps {
  open?: boolean;
  className?: string;
  heading: React.ReactNode;
}

const arrowDown: string = String.fromCharCode(9660);
const arrowUp: string = String.fromCharCode(9650);

const Arrow = styled.span`
  margin-right: 0.5em;
`;

const CollapsableHeading = styled.button`
  -webkit-appearance: none;
  display: inline-block;
  background: ${props => props.theme.palette.background.default};
  text-align: left;
  border: 0;
  cursor: pointer;
  width: 100%;

  &,
  * {
    display: inline-block;
    vertical-align: middle;
  }
`;

const Collapsable: React.FC<ICollapsableHeadingProps> = props => {
  const [collapsed, setCollapsed] = React.useState(!props.open);
  const toggle = () => setCollapsed(!collapsed);

  return (
    <div>
      <CollapsableHeading onClick={toggle}>
        <Arrow>{collapsed ? arrowUp : arrowDown}</Arrow>
        {props.heading}
      </CollapsableHeading>
      {!collapsed && props.children}
    </div>
  );
};

export default Collapsable;
