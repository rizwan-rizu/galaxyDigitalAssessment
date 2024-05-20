import { FC, FormEvent, useReducer, useState } from 'react';
import { Box, Stack, Alert } from '@mui/material';
import { Text } from '../../commonComponents/commonStyledComponents';
import { initialFormState, reducer } from './reducer';
import { formFields } from './formJson';
import { iFormFields } from './interface';
import { optionsPrices, spotPrices } from './sampleData';
import MuiSelect from '../../commonComponents/select';
import MuiTextfield from '../../commonComponents/textInput';
import MuiButton from '../../commonComponents/button';

const TradeForm: FC = () => {
  const [formValue, dispatch] = useReducer(reducer, initialFormState)
  const [showFeedback, setShowFeedback] = useState<{ open: boolean, message: string }>({ open: false, message: '' })

  const handleChange = (e: any) => {
    dispatch({ type: e.target.name, data: e.target.value })
  }

  const formJson = formFields(formValue)

  const checkTradeConsistency = (option: { [key: string]: string }) => {
    const lastPrice = parseFloat(option?.lastPrice);
    const open = parseFloat(option?.open);
    const high = parseFloat(option?.high);
    const low = parseFloat(option?.low);
    const bidPrice = parseFloat(option?.bidPrice);
    const askPrice = parseFloat(option?.askPrice);
    const priceChange = parseFloat(option?.priceChange);
    const priceChangePercent = parseFloat(option?.priceChangePercent);
    const volume = parseFloat(option?.volume);
    const amount = parseFloat(option?.amount);
    const tradeCount = parseInt(option?.tradeCount, 10);
    const currentDate = new Date();

    let message = [];

    // Check notional value (price * quantity) falls within minNotional and maxNotional
    if (formValue.minNotional && formValue.maxNotional && formValue.quantity) {
      const notionalValue = formValue.price * formValue.quantity;
      if (notionalValue < formValue.minNotional || notionalValue > formValue.maxNotional) {
        message.push(`Notional value (price * quantity)(${notionalValue}) is not falling within minimum Notional (${formValue.minNotional}) and maximum Notional (${formValue.maxNotional}).`)
      }
    }

    if (formValue.instrument === "Option") {

      // The lastPrice should lie between the low and high prices to ensure it is within the recorded daily price range.
      if (lastPrice < low || lastPrice > high) {
        message.push(`Last price (${lastPrice}) is not consistent with low (${low}) and high (${high}) prices.`);
      }

      // Typically, the open price of a trading period (e.g., a day) should match the lastPrice from the previous period. This ensures continuity and accuracy in pricing.
      if (open !== lastPrice) {
        message.push(`Open price (${open}) should be equal to the last price (${lastPrice}).`);
      }

      //  In financial markets, the bidPrice (the highest price a buyer is willing to pay) should always be lower than the 
      // askPrice (the lowest price a seller is willing to accept). If bidPrice is equal to or higher than askPrice, it indicates a market anomaly or data error.
      if (bidPrice >= askPrice) {
        message.push(`Bid price (${bidPrice}) should be less than ask price (${askPrice}).`);
      }

      // If there are no trades (volume is zero), it logically follows that the total traded amount should also be zero. Any non-zero amount in this case would be incorrect.
      if (volume === 0 && amount !== 0) {
        message.push('If volume is zero, amount should also be zero. ');
      }

      // A non-zero percentage change in price should correspond to a non-zero absolute change in price. 
      // If priceChange is zero while priceChangePercent is non-zero, it indicates a data inconsistency.
      if (priceChangePercent !== 0 && priceChange === 0) {
        message.push('If price change percent is non-zero, price change should not be zero.');
      }

      // A non-zero trading volume implies that trades have occurred. Therefore, the number of trades (tradeCount) should be non-zero.
      // If tradeCount is zero, it suggests a discrepancy in the trade data.
      if (volume > 0 && tradeCount === 0) {
        message.push('If volume is non-zero, trade count should also be non-zero.');
      }

      // Options are typically set to expire at a future date. An expiration date in the past or present is not valid for a new trade and indicates an error in the data.
      if (new Date(formValue.expirationDate) <= currentDate) {
        message.push(`Expiration date (${formValue.expirationDate}) is not a valid future date.`);
      }
    }

    if (message.length === 0) {
      message.push('Option trade details are valid.');
    }

    return message.toString();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const spotPriceData = spotPrices.find((price: any) => price.symbol === formValue.tokenName);
    const optionPriceData = optionsPrices.find((price: any) => price.symbol === formValue.tokenName);

    if ((formValue.instrument === 'Spot' && !spotPriceData) || (formValue.instrument === 'Option' && !optionPriceData)) {
      return setShowFeedback({ open: true, message: "Failed to find binance data against token name." });
    }

    const spotPriceValue = spotPriceData?.price ? parseFloat(spotPriceData.price) : undefined;
    const optionLastPrice = optionPriceData?.lastPrice ? parseFloat(optionPriceData.lastPrice) : undefined;

    // Check if the price is within a reasonable range (±10%) of the current spot price
    if (formValue.instrument === 'Spot' && spotPriceValue) {
      const isPriceWithinReasonableRange = formValue.price <= spotPriceValue * 1.1 && formValue.price >= spotPriceValue * 0.9;
      if (!isPriceWithinReasonableRange) return setShowFeedback({ open: true, message: "Price is not within a reasonable range (±10%) of the current spot price." });
    }

    // Check if the option price is within a reasonable range (±10%) of the option's last price
    if (formValue.instrument === 'Option' && optionLastPrice) {
      const isOptionPriceWithinReasonableRange = formValue.price <= optionLastPrice * 1.1 && formValue.price >= optionLastPrice * 0.9;
      if (!isOptionPriceWithinReasonableRange) return setShowFeedback({ open: true, message: "Price is not within a reasonable range (±10%) of the option's last price." });
    }

    // All validations passed
    return setShowFeedback({ open: true, message: checkTradeConsistency(optionPriceData as any) });
  }

  return (
    <Box height={"100%"} position={"relative"}>
      <Box py={4} sx={{ transform: "translate(-50%)" }} position={"absolute"} left={"50%"} minWidth={"400px"}>
        <Text sx={{ textAlign: "center" }} variant="h6">Over-The-Counter Trader Form</Text>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Stack mt={2} direction="column" spacing={1.5}>
            {formJson.map((item: iFormFields) => (
              <>
                {["text", "number", "date"].includes(item.type) && item.isVisible &&
                  <MuiTextfield
                    variant={item.variant}
                    type={item.type}
                    value={formValue[item.name] ?? ""}
                    label={item.label}
                    name={item.name}
                    placeholder={item.placeholder}
                    size={item.size}
                    onChange={handleChange}
                    fullWidth={item.fullWidth}
                    required={item.required}
                    InputLabelProps={(item.type === "date") ? { shrink: true } : undefined}
                  />
                }
                {item.type === "select" && item.isVisible &&
                  <MuiSelect
                    variant={item.variant}
                    data={item.data}
                    defaultValue={formValue[item.name] ?? ""}
                    label={item.label}
                    name={item.name}
                    required={item.required}
                    size={item.size}
                    fullWidth={item.fullWidth}
                    onChange={handleChange}
                  />
                }
              </>
            ))}
            <MuiButton variant="contained" label="Submit" color="primary" type="submit" />
          </Stack>
        </form>
        <Box pt={1}>{showFeedback.open && (showFeedback.message.split(',').map(i => <Alert sx={{ mt: 1 }} severity="info">{i}</Alert>))}</Box>
      </Box>
    </Box >
  );
};

export default TradeForm;
