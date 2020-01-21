import styled from 'styled-components';

type ITransaction = import('../../declarations/transaction').ITransaction;

interface IProjectionRowEntryProps {
  readonly type: ITransaction['type'];
  readonly gapAbove: boolean;
}

const ProjectionRow = styled.div`
  font-size: 1.2em;
  font-weight: normal;
  display: grid;
  grid-template-columns: repeat(5, 1fr);

  padding-left: 0.5em;
  padding-right: 0.5em;

  p {
    align-self: center;
    margin-top: 0.2em;
    margin-bottom: 0.2em;
    word-break: break-word;
  }

  p:nth-last-child(-n + 3),
  strong:nth-last-child(-n + 3) {
    text-align: right;
  }
`;

export const ProjectionRowEntry = styled(ProjectionRow)<
  IProjectionRowEntryProps
>`
  margin-top: ${props => (props.gapAbove ? '0.3em' : '0em')};

  background: ${props =>
    props.type && props.type === 'IN'
      ? props.theme.palette.background_income.main
      : props.theme.palette.background_expense.main};
`;

export const ProjectionRowHeader = styled(ProjectionRow)`
  position: sticky;
  top: calc(4em - 3px);
  padding: 1.5em 1em 1em;
  margin: -1.5em -1em 0; /* Negate the effect of padding when not stuck */
  background: ${props => props.theme.palette.background.default};
  border-bottom: 2px solid ${props => props.theme.palette.primary.default};

  strong {
    font-weight: 600;
  }
`;
