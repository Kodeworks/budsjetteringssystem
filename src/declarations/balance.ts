export interface IBalance {
  company_id: number;
  date: string;
  money: number;
}

export interface IBankBalance {
  id: number;
  company_id: number;
  date: string; // ISO-8601
  money: number;
}
