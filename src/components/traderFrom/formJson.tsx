import { iFormFields } from "./interface";

export const formFields = (state: any): iFormFields[] => ([
  { variant: "outlined", type: "select", label: "Instrument", name: "instrument", data: ["Option", "Spot"], size: "medium", fullWidth: true, required: true, isVisible: true },
  { variant: "outlined", type: "date", label: "Expiration Date", name: "expirationDate", size: "medium", fullWidth: true, required: true, isVisible: state.instrument === "Option" },
  { variant: "outlined", type: "select", label: "Type", name: "type", data: ["Call", "Put"], size: "medium", fullWidth: true, required: true, isVisible: state.instrument === "Option" },
  { variant: "outlined", type: "number", label: "Strike Price", name: "strikePrice", placeholder: "E.g 10", size: "medium", fullWidth: true, required: true, isVisible: state.instrument === "Option" },
  { variant: "outlined", type: "number", label: "Price", name: "price", placeholder: "E.g 1000", size: "medium", fullWidth: true, required: true, isVisible: ["Option", "Spot"].includes(state.instrument) },
  { variant: "outlined", type: "number", label: "Quantity", name: "quantity", placeholder: "E.g 10", size: "medium", fullWidth: true, required: true, isVisible: ["Option", "Spot"].includes(state.instrument) },
  { variant: "outlined", type: "text", label: "Token Name", name: "tokenName", placeholder: "E.g 10", size: "medium", fullWidth: true, required: true, isVisible: ["Option", "Spot"].includes(state.instrument) },
  { variant: "outlined", type: "number", label: "Min Notional", name: "minNotional", placeholder: "E.g 100", size: "medium", fullWidth: true, required: true, isVisible: true },
  { variant: "outlined", type: "number", label: "Max Notional", name: "maxNotional", placeholder: "E.g 100", size: "medium", fullWidth: true, required: true, isVisible: true },
])