import React from 'react';
import ApexChart from 'react-apexcharts';

import styled from 'styled-components';

import moment from 'moment';
import * as API from '../../mitochondria';
import { useCompanyState } from '../../store/contexts/company';

const Chart: React.FC<{ className?: string }> = ({ className }) => {
  const [balances, setBalances] = React.useState<{
    [companyId: string]: Array<import('../../declarations/balance').IBalance>;
  }>({});

  const companies = useCompanyState();

  React.useEffect(() => {
    (async () => {
      // Change to for..of for async
      companies.forEach(async c => {
        const result = await API.getBalanceByDateRange(
          c.id,
          moment()
            .subtract(3, 'months')
            .format('YYYY-MM-DD'),
          moment()
            .add(9, 'months')
            .format('YYYY-MM-DD')
        );
        setBalances(e => ({
          ...e,
          [c.name]: e[c.name] !== undefined ? e[c.name].concat(result) : result,
        }));
      });
    })();
  }, [companies]);

  return (
    <div className={className}>
      <h2>Balance next 9 months</h2>
      <ApexChart
        series={Object.entries(balances).map(([name, bs]) => ({
          data: bs
            .sort((a, b) =>
              moment(a.date, moment.ISO_8601).isBefore(
                moment(b.date, moment.ISO_8601)
              )
                ? -1
                : 1
            )
            .map(e => ({
              x: moment(e.date, moment.ISO_8601).unix(),
              y: e.money / 100,
            })),
          name,
        }))}
        options={{
          chart: {
            id: 'balance-graph',
          },
          markers: {
            radius: 2,
            shape: 'circle',
            size: 4,
          },
          tooltip: {
            x: {
              formatter: (timestamp: number) =>
                moment.unix(timestamp).format('Mo MMMM YYYY'),
            },
          },
          xaxis: {
            labels: {
              formatter: (timestamp: number) =>
                moment.unix(timestamp).format("DD/MM-'YY"),
            },
            type: 'datetime',
          },
        }}
        type="line"
      />
    </div>
  );
};

export default styled(Chart)`
  h2 {
    font-weight: 200;
    margin-bottom: 0.7em;
    font-size: 2.2em;
    margin-top: 1em;
  }
`;
