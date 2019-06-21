/**
 * @author "Fredrik August Madsen-Malmo"
 * @summary "A styled label component"
 */

import styled from 'styled-components';

interface ILabelProps {
  checkboxLabel?: boolean;
}

const Label = styled.label<ILabelProps>`
  ${props => props.checkboxLabel ? 'margin-right: .7em' : 'display: block'};
  font-size: .8em;
  margin-bottom: .2em;
  font-weight: 700;
  letter-spacing: .4px;
`;

export default Label;
