import { FC, FormEvent, useReducer, useState } from 'react';
import { Box, Stack, Alert } from '@mui/material';
import { Text } from '../../commonComponents/commonStyledComponents';
import { initialFormState, reducer } from './reducer';
import { formFields } from './formJson';
import { iFormFields } from './interface';
import { optionsPrices, spotPrices } from './sampleData';
import { checkTradeConsistency } from './utility';
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const spotPriceData = spotPrices.find((price: any) => price.symbol === formValue.tokenName);
    const optionPriceData = optionsPrices.find((price: any) => price.symbol === formValue.tokenName);

    if ((formValue.instrument === 'Spot' && !spotPriceData) || (formValue.instrument === 'Option' && !optionPriceData)) {
      return setShowFeedback({ open: true, message: "Failed to find binance data against token name." });
    }

    // checkTradeConsistency method will return the messages
    return setShowFeedback({ open: true, message: checkTradeConsistency(formValue, optionPriceData as any, spotPriceData?.price as string) });
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
