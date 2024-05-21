export const checkTradeConsistency = (formValue: { [key: string]: any }, option: { [key: string]: string }, spotPrice: string) => {
  const plusTenPercent: number = 1.1;
  const minusTenPercent: number = 0.9;
  const lastPrice: number = parseFloat(option?.lastPrice);
  const open: number = parseFloat(option?.open);
  const high: number = parseFloat(option?.high);
  const low: number = parseFloat(option?.low);
  const bidPrice: number = parseFloat(option?.bidPrice);
  const askPrice: number = parseFloat(option?.askPrice);
  const priceChange: number = parseFloat(option?.priceChange);
  const priceChangePercent: number = parseFloat(option?.priceChangePercent);
  const volume: number = parseFloat(option?.volume);
  const amount: number = parseFloat(option?.amount);
  const tradeCount: number = parseInt(option?.tradeCount, 10);
  const spotPriceValue: number = parseFloat(spotPrice);
  const tokenName: string = option?.symbol;
  const currentDate: Date = new Date();

  let message = [];

  // Check if the price is within a reasonable range (±10%) of the current spot price
  if (formValue.instrument === 'Spot' && spotPriceValue) {
    const isPriceWithinReasonableRange = formValue.price <= spotPriceValue * plusTenPercent && formValue.price >= spotPriceValue * minusTenPercent;
    if (!isPriceWithinReasonableRange) message.push(`Price (${formValue.price}) is not within a reasonable range (${spotPriceValue * minusTenPercent} — ${parseFloat((spotPriceValue * plusTenPercent).toString())}) of the current spot price.`);
  }

  if (formValue.instrument === "Option") {

    // Check if the option price is within a reasonable range (±10%) of the option's last price
    if (lastPrice) {
      const isOptionPriceWithinReasonableRange = formValue.price <= lastPrice * plusTenPercent && formValue.price >= lastPrice * minusTenPercent;
      if (!isOptionPriceWithinReasonableRange) message.push(`Price (${formValue.price}) is not within a reasonable range (${lastPrice * minusTenPercent} — ${lastPrice * plusTenPercent}) of the option's last price.`);
    }

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
    if (bidPrice > askPrice) {
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

    // Validate option type (Call or Put)
    if (tokenName.charAt(tokenName.length - 1) !== formValue.type.charAt(0)) {
      message.push(`Given option type (${formValue.type}) is not consistent with the trade option type (${tokenName.charAt(tokenName.length - 1) === "C" ? "Call" : "Put"}).`);
    }
  }

  // Check notional value (price * quantity) falls within minNotional and maxNotional
  if (formValue.minNotional && formValue.maxNotional && formValue.quantity) {
    const notionalValue = formValue.price * formValue.quantity;
    if (notionalValue < formValue.minNotional || notionalValue > formValue.maxNotional) {
      message.push(`Notional value (${notionalValue}) is not falling within minimum Notional (${formValue.minNotional}) and maximum Notional (${formValue.maxNotional}).`)
    }
  }

  if (message.length === 0) {
    message.push('Option trade details are valid.');
  }

  return message.toString();
};