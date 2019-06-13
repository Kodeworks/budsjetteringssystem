import React from 'react';

import styled from 'styled-components';

import { theme } from '../../../styling/theme';

interface IProps {
  className?: string;
}

const BenefitGrid: React.FC<IProps> = ({ className }) => (
<div className={className}>
  <div>
    <h3>
      Elit vel ab dolorum.
    </h3>
    <p>
      Sit excepturi delectus nulla ea necessitatibus Deserunt quae blanditiis omnis quasi vero rerum Officia debitis quis at nisi nisi? Fugiat aliquid labore magnam qui recusandae nobis. Mollitia voluptas quaerat cum.
    </p>
  </div>
  <div>
    <h3>
      Lorem modi sequi sit
    </h3>
    <p>
      Lorem velit esse ullam excepturi fugiat. Aspernatur eum qui illo provident voluptatum. Quas optio tempore quis laborum eos Eaque eligendi exercitationem corrupti dolores impedit Optio nihil velit inventore soluta inventore.
    </p>
  </div>
  <div>
    <h3>
      Ipsum esse omnis fugit
    </h3>
    <p>
      Amet explicabo recusandae sed tenetur minima Impedit ad perferendis expedita modi autem Nobis dolor quaerat inventore quia non? Quibusdam accusamus debitis culpa optio harum. Maxime quod ipsum cumque assumenda tenetur.
    </p>
  </div>
</div>
);

export default styled(BenefitGrid)`
  display: grid;
  grid-template-columns: repeat(10, 10%);
  grid-template-rows: repeat(3, 20vh);

  h3 {
    color: ${theme.accent};
    font-family: "Montserrat", sans-serif;
  }

  p {
    color: white;
    font-size: 1.2em;
  }

  &>div:nth-child(2n) {
    grid-column: 3 / 11;
    text-align: right;
  }

  &>div:nth-child(2n+1) {
    grid-column: 1 / 9;
  }
`;
