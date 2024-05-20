import { iOptionTrade } from "./interface";

export const initialFormState: iOptionTrade = {
  instrument: "",
  expirationDate: "",
  type: "",
  strikePrice: '',
  price: '',
  quantity: '',
  tokenName: '',
  minNotional: '',
  maxNotional: ''
}

export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "instrument":
      return {
        ...state,
        instrument: action.data,
        expirationDate: "",
        type: "",
        strikePrice: '',
        price: '',
        quantity: '',
        tokenName: '',
      }
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