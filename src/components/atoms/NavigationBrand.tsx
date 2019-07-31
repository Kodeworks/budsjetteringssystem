import React from 'react';
import styled from 'styled-components';

// const BrandImage = styled.img`
//   display: block;
//   margin: 0 auto .3em;
// `;

const NavigationBrand: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className}>
    {/* <BrandImage src="https://www.fillmurray.com/100/100" alt="Mill Burray" /> */}
    <h2>LIQUIDATOR</h2>
  </div>
);

export default styled(NavigationBrand)`
  /* Positioning */
  flex-grow: 0;
  margin: 0 auto;
  padding: 2em 2em 1em 2em;

  /* Colors */
  color: white;

  /* Font */
  h2 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    color: white;
  }
`;
