/**
 * @author "Fredrik August Madsen-Malmo"
 * @summary "A styled label component"
 */

import styled from 'styled-components';

interface ILabelProps {
  checkboxLabel?: boolean;
}

const Label = styled.label<ILabelProps>`
  ${props => (props.checkboxLabel ? 'margin-right: .7em' : 'display: block')};
  font-size: 0.8em;
  margin-bottom: 0.2em;
  font-weight: 700;
  letter-spacing: 0.4px;
`;

export default Label;
