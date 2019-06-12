import React from 'react';
import styled from 'styled-components';

interface IProps {
  className?: string;
}

const BrandImage = styled.img`
  display: block;
  margin: 0 auto .3em;
`;

const NavigationBrand: React.FC<IProps> = ({ className }) => (
  <div className={className}>
    <BrandImage src="https://www.fillmurray.com/100/100" alt="Mill Burray" />
    <h1>Liquidator</h1>
  </div>
);

export default styled(NavigationBrand)`
  /* Positioning */
  flex-grow: 0;
  margin: 0 auto;
  padding: 2em;

  /* Colors */
  color: white;
`;
