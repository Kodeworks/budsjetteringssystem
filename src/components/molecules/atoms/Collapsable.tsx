import React from 'react';

import styled from 'styled-components';

interface IProps {
  collapsed?: boolean;
  className?: string;
  heading: React.ReactNode;
}

const arrowDown: string = String.fromCharCode(9660);
const arrowUp: string = String.fromCharCode(9650);

const Arrow = styled.span`
  margin-right: .1em;
  margin-left: calc(-22px - .1em);
`;

const Collapsable: React.FC<IProps> = props => {
  const [collapsed, setCollapsed] = React.useState(props.collapsed || true);
  const toggle = () => setCollapsed(!collapsed);

  return (
    <div className={props.className}>
      <span onClick={toggle}>
        <Arrow>
          {collapsed ? arrowUp : arrowDown}
        </Arrow>
        {props.heading}
      </span>
      {!collapsed && props.children}
    </div>
  );
};

export default styled(Collapsable)`
  span {
    margin-right: .5em;
    cursor: pointer;

    &, * {
      display: inline-block;
      vertical-align: middle;
    }
  }
`;
