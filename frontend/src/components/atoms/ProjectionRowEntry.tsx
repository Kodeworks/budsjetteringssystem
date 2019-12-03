import styled from 'styled-components';

type ITransaction = import('../../declarations/transaction').ITransaction;

interface IProjectionRowEntryProps {
  readonly type?: ITransaction['type'];
  readonly gapAbove: boolean;
}

export const ProjectionRowEntry = styled.div<IProjectionRowEntryProps>`
  font-size: 1.2em;
  font-weight: normal;
  display: grid;
  grid-template-columns: repeat(5, 1fr);

  padding-left: 0.5em;
  padding-right: 0.5em;

  margin-top: ${props => (props.gapAbove ? '0.3em' : '0em')};

  background: ${props =>
    props.type && props.type === 'IN'
      ? props.theme.palette.background_income.main
      : props.theme.palette.background_expense.main};

  p {
    align-self: center;
    margin-top: 0.2em;
    margin-bottom: 0.2em;
  }

  p:nth-last-child(-n + 3),
  strong:nth-last-child(-n + 3) {
    text-align: right;
  }
`;
