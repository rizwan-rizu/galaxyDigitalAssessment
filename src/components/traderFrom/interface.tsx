export interface iSpotTrade {
  instrument: 'Option' | 'Spot',
  price: number;
  quantity: number;
  tokenName: string;
};

export interface iOptionTrade extends iSpotTrade {
  expirationDate: Date;
  type: 'put' | 'call';
  strikePrice: number;
}