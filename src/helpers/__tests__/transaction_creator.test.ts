import { createDummyTransaction } from '../transaction_creator';

import { ITransaction } from '../../declarations/transaction';

test('creates valid transactions', () => {
  const txs = (new Array(200)).fill(0).map(createDummyTransaction);

  txs.forEach(e => {
    expect(e.id).not.toBeNull();
    expect(e.name).not.toBeNull();
    expect(e.companyId).not.toBeNull();
    expect(e.money).not.toBeNull();
    expect(e.type).not.toBeNull();
    expect(e.date).not.toBeNull();
  });
});
