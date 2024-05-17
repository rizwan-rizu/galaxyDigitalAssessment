import { iOptionTrade } from "./interface";

export const initialFormState: iOptionTrade = {
  instrument: "",
  expirationDate: "",
  type: "",
  strikePrice: 0,
  price: 0,
  quantity: 0,
  tokenName: '',
  minNotional: 0,
  maxNotional: 0
}


export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "instrument":
      return { ...state, instrument: action.data }
    case "expirationDate":
      return { ...state, expirationDate: action.data }
    case "type":
      return { ...state, type: action.data }
    case "price":
      return { ...state, price: action.data }
    case "quantity":
      return { ...state, quantity: action.data }
    case "strikePrice":
      return { ...state, strikePrice: action.data }
    case "tokenName":
      return { ...state, tokenName: action.data }
    case "minNotional":
      return { ...state, minNotional: action.data }
    case "maxNotional":
      return { ...state, maxNotional: action.data }
    default:
      return state;
  }
};