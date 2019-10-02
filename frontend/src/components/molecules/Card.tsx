import styled from 'styled-components';

export default styled.div`
  margin: auto;
  width: 30vw;
  margin-left: 10vw;
  background-color: ${props => props.theme.palette.background.paper};
  border-radius: 5px;
  border: 2px solid ${props => props.theme.palette.primary.contrast};
  padding: 20px;

  &,
  form * {
    background: ${props => props.theme.main};
  }

  h1 {
    margin-bottom: 0.7em;
  }

  form > * {
    margin-bottom: 0.6em;
  }

  form {
    margin-bottom: 0.6em;
  }

  form ~ a {
    display: block;
  }
`;
