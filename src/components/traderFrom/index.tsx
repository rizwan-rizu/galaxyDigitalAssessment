import { FC, useReducer } from 'react';
import { Box, Stack } from '@mui/material';
import { Text } from '../../commonComponents/commonStyledComponents';
import { initialFormState, reducer } from './reducer';
import { formFields, iformFields } from './formJson';
import MuiSelect from '../../commonComponents/select';
import MuiTextfield from '../../commonComponents/textInput';
import MuiButton from '../../commonComponents/button';
import { optionsPrices, spotPrices } from './sampleData';

const TradeForm: FC = () => {
  const [formValue, dispatch] = useReducer(reducer, initialFormState)

  const handleChange = (e: any) => {
    dispatch({ type: e.target.name, data: e.target.value })
  }

  const formJson = formFields(formValue)

  const handleSubmit = () => {
    const spotPriceData = spotPrices.find((price: any) => price.symbol === formValue.tokenName);
    const optionPriceData = optionsPrices.find((price: any) => price.symbol === formValue.tokenName);

    if ((formValue.instrument === 'Spot' && !spotPriceData) || (formValue.instrument === 'Option' && !optionPriceData)) {
      return false;
    }

    const spotPriceValue = spotPriceData?.price ? parseFloat(spotPriceData.price) : undefined;
    const optionLastPrice = optionPriceData?.lastPrice ? parseFloat(optionPriceData.lastPrice) : undefined;

    // Check if the price is within a reasonable range (±10%) of the current spot price
    if (formValue.instrument === 'Spot' && spotPriceValue) {
      const isPriceWithinReasonableRange = formValue.price <= spotPriceValue * 1.1 && formValue.price >= spotPriceValue * 0.9;
      if (!isPriceWithinReasonableRange) return false;
    }

    // Check if the option price is within a reasonable range (±10%) of the option's last price
    if (formValue.instrument === 'Option' && optionLastPrice) {
      const isOptionPriceValid = formValue.price <= optionLastPrice * 1.1 && formValue.price >= optionLastPrice * 0.9;
      if (!isOptionPriceValid) return false;
    }

    // Check notional value (price * quantity) falls within minNotional and maxNotional
    if (formValue.minNotional && formValue.maxNotional && formValue.quantity) {
      const notionalValue = formValue.price * formValue.quantity;
      if (notionalValue < formValue.minNotional || notionalValue > formValue.maxNotional) {
        return false;
      }
    }
  }

  return (
    <Box height={"100%"} position={"relative"}>
      <Box py={4} sx={{ transform: "translate(-50%)" }} position={"absolute"} left={"50%"} minWidth={"400px"}>
        <Text sx={{ textAlign: "center" }} variant="h6">Over-The-Counter Trader Form</Text>
        <form onSubmit={handleSubmit}>
          <Stack mt={2} direction="column" spacing={1.5}>
            {formJson.map((item: iformFields) => (
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
      </Box>
    </Box>
  );
};

export default TradeForm;
