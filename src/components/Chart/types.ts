export interface Point {
  price: number;
  type: 'sell' | 'buy' | 'empty';
  order: number;
}
