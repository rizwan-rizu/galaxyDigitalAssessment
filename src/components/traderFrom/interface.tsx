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

export interface iFormFields {
  type: string
  label: string
  variant: "outlined" | "filled" | "standard"
  name: string
  placeholder?: string
  size?: "medium" | "small"
  fullWidth?: boolean
  required?: boolean
  data?: any[]
  isVisible?: boolean
}