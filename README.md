# Table of Contents

- [Getting Started with the Application](#getting-started-with-the-application)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Set up & Installation](#set-up--installation)
- [Component Structure:](#component-structure)
- [Check if the base price or strike price entered is within a reasonable range](#check-if-the-base-price-or-strike-price-entered-is-within-a-reasonable-range)
- [Check for consistency in the trade details](#check-for-consistency-in-the-trade-details)
- [Potential Improvements](#potential-improvements)
- [Note: Refer to the sampleData.tsx file and use that for validation.](#note-refer-to-the-sampledatatsx-file-and-use-that-for-validation)
  - [valid spot trade detail](#valid-spot-trade-detail)
  - [Invalid spot trade detail](#invalid-spot-trade-detail)
  - [Invalid option trade detail](#invalid-option-trade-detail)
  - [valid option trade detail](#valid-option-trade-detail)

# Getting Started with the Application
This document provides an overview of the solution implemented, potential improvements we can do, and guidelines on how to set it up locally and run it.

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed in your computer:

- Node.js &
- NPM (Node Package Manager)

Installing Node.js automatically includes NPM.

### Set up & Installation
- Clone the repository to setup project locally: `git clone https://github.com/rizwan-rizu/galaxyDigitalAssessment.git`
- Navigate to the project folder: `cd galaxyDigitalAssessment`
- Install dependencies: `npm install`
- Run the the appliation locally: `npm start`

# Component Structure

Two folders were created in the `Src` folder. One is `commonComponents`, which includes all of the common components that can be used throughout the application for reusable purposes. It contains wrappers for the following.

- Text input
- Select input
- Button
- Common styled component

The other folder is `components` and in that we have the `traderForm` component which includes different files like

- `interface.tsx`: In this file I have includes all the typescript interfaces for the component.
- `formJson.tsx`: This file exports the trader form's JSON and uses it to dynamically display a user input form. Implementing it this way provides great reusability, as seen in the `index.tsx` file, where I have mapped the JSON and dynamically displayed form based on the item. The form's JSON can also be retrieved from the backend and dynamically displayed on the frontend, which is an additional advantage of implementing it this way.
- `reducer.tsx`: This file contains and exports both the form's initial state and the reducer, which manages input changes and updates the state as needed. For reusability and more control over state management, I prefer to use the `useReducer()` hook instead of `useState()`. 
- `sampleData.tsx`: This file contains the binance sample data for the spot and option trade.
- `index.tsx`: This file contains the trader form component, which is called in 'app.tsx'.
- `utility.tsx`: The `checkTradeConsistency()` method, which contains conditions to check for trade consistency, is exported by this file. Having this separate file makes it easier to read; otherwise, I would have to add it to the index.tsx file, which would have increased its size and line count.

# Check if the base price or strike price entered is within a reasonable range
The criteria to check if the base price or strike price is within a reasonable range. I am ensuring the user-entered base price is within `±10%` of the current spot price and last option price from Binance. A reasonable range (±10%) is not a strict industry standard but rather a commonly used heuristic in financial applications to ensure that user-entered prices are within a realistic range based on current market data. This range helps prevent significant deviations from market prices, which can indicate errors in data entry or unrealistic trades.

# Check for consistency in the trade details
To check trade consistency I have applied following checks.

1. Last Price Consistency Check:
```
if (lastPrice < low || lastPrice > high) {
        message.push(`Last price (${lastPrice}) is not consistent with low (${low}) and high (${high}) prices.`);
      }
```
- Purpose: Ensures that the last traded price of the option falls within the recorded daily price range.
- Reason: The lastPrice should logically be within the range of recorded low and high prices for the day. If it falls outside this range, it indicates a potential data inconsistency or error.

2. Open Price Consistency Check:
```
if (open !== lastPrice) {
        message.push(`Open price (${open}) should be equal to the last price (${lastPrice}).`);
      }
```
- Purpose: Verifies that the open price is the same as the lastPrice.
- Reason: Typically, the open price of a trading period (e.g., a day) should match the lastPrice from the previous period. This ensures continuity and accuracy in pricing.

3. Bid and Ask Price Relationship Check:
```
 if (bidPrice >= askPrice) {
        message.push(`Bid price (${bidPrice}) should be less than ask price (${askPrice}).`);
      }
```
- Purpose: Confirms that the bidPrice is less than the askPrice.
- Reason: In financial markets, the bidPrice (the highest price a buyer is willing to pay) should always be lower than the askPrice (the lowest price a seller is willing to accept). If bidPrice is equal to or higher than askPrice, it indicates a market anomaly or data error.
4. Volume and Amount Consistency Check:
```
 if (volume === 0 && amount !== 0) {
        message.push('If volume is zero, amount should also be zero. ');
      }
```
- Purpose: Ensures that when no trades have occurred (volume is zero), the total traded amount should also be zero.
- Reason: If there are no trades (volume is zero), it logically follows that the total traded amount should also be zero. Any non-zero amount in this case would be incorrect.
5. Price Change Consistency Check:
```
if (priceChangePercent !== 0 && priceChange === 0) {
        message.push('If price change percent is non-zero, price change should not be zero.');
      }
```
- Purpose: Validates that if the percentage change in price is non-zero, the absolute priceChange should also be non-zero.
- Reason: A non-zero percentage change in price should correspond to a non-zero absolute change in price. If priceChange is zero while priceChangePercent is non-zero, it indicates a data inconsistency.
6. Trade Count and Volume Relationship Check:
```
if (volume > 0 && tradeCount === 0) {
        message.push('If volume is non-zero, trade count should also be non-zero.');
      }
```
- Purpose: Ensures that when there is a non-zero trading volume, the trade count should also be non-zero.
- Reason: A non-zero trading volume implies that trades have occurred. Therefore, the number of trades (tradeCount) should be non-zero. If tradeCount is zero, it suggests a discrepancy in the trade data.
7. Expiration Date Check:
```
if (new Date(formValue.expirationDate) <= currentDate) {
        message.push(`Expiration date (${formValue.expirationDate}) is not a valid future date.`);
      }
```
- Purpose: Validates that the expiration date of the option is a future date.
- Reason: Options are typically set to expire at a future date. An expiration date in the past or present is not valid for a new trade and indicates an error in the data.
8. Notional value check:
```
if (formValue.minNotional && formValue.maxNotional && formValue.quantity) {
      const notionalValue = formValue.price * formValue.quantity;
      if (notionalValue < formValue.minNotional || notionalValue > formValue.maxNotional) {
        message.push(`Notional value (price * quantity)(${notionalValue}) is not falling within minimum Notional (${formValue.minNotional}) and maximum Notional (${formValue.maxNotional}).`)
      }
    }
```
- purpose: Ensures that the size of the transaction (notional value) is within acceptable bounds.
- Reason: Prevents trades that are too small, which might not be economically viable or efficient for execution.Also Prevents trades that are too large, which could pose a significant risk or impact the market.
9. Type consistency check:
```
if (tokenName.charAt(tokenName.length - 1) !== formValue.type.charAt(0)) {
      message.push(`Given option type (${formValue.type}) is not consistent with the trade option type (${tokenName.charAt(tokenName.length - 1) === "C" ? "Call" : "Put"}).`);
    }
```
- purpose: Ensures that the option type matches with the trade type.

## Potential Improvements
1. `Date Format Validation`: Implement a check to validate the format of the expiration date to ensure it conforms to expected standards. Epoch can be used to work with datetime.
2. `Improved Error Message`: Enhance the error messages to provide more context or suggestions for correction.
3. `Dynamic Reasonable Range`: Instead of hardcoding the reasonable range (±10%), we can consider making it configurable based on market conditions or user input.
4. `Handling Edge Cases`: Add checks to handle zero or negative values gracefully. Ensure that calculations handle precision and rounding correctly, especially for financial data which might require high precision.
5. `Input Validation`: Ensure all inputs are validated and sanitized to prevent security vulnerabilities such as injection attacks.
6. `User Interface Enhancements`: Improve the UI to better display form & validation results. Add loading indicators and error handling for better user experience.
7. `Setting Notional Value Limits for Readability`: Set a limits on the notional value for instance, ensuring it remains within a specific number of digits. This prevents the value from becoming excessively large and difficult to read.
8. `Setting limit after decmimal point`: Set a limit on the number of digits that can follow a decimal point in values for better readability.

# Note: For the sample data for validation, see the [snapshots](/snapshots.md) file.