export interface iSpotTrade {
  instrument: 'Option' | 'Spot' | "",
  price: number | "";
  quantity: number | "";
  tokenName: string;
  minNotional: number | "";
  maxNotional: number | "";
};

export interface iOptionTrade extends iSpotTrade {
  expirationDate: Date | "";
  type: 'put' | 'call' | "";
  strikePrice: number | "";
}