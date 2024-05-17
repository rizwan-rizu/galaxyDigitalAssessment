import { FC, useReducer } from 'react';
import { Box, Stack } from '@mui/material';
import { Text } from '../../commonComponents/commonStyledComponents';
import { initialFormState, reducer } from './reducer';
import MuiSelect from '../../commonComponents/select';
import MuiTextfield from '../../commonComponents/textInput';
import MuiButton from '../../commonComponents/button';

const TradeForm: FC = () => {
  const [formValue, dispatch] = useReducer(reducer, initialFormState)

  const handleChange = (e: any) => {
    dispatch({ type: e.target.name, data: e.target.value })
  }

  return (
    <Box height={"100%"} position={"relative"}>
      <Box py={4} sx={{ transform: "translate(-50%)" }} position={"absolute"} left={"50%"} minWidth={"400px"}>
        <Text sx={{ fontSize: 16, textAlign: "center" }} variant="h6">Over-The-Counter Trader Form</Text>
        <form onSubmit={() => console.log(formValue)}>
          <Stack mt={2} direction="column" spacing={1.5}>
            <MuiSelect variant="outlined" label="Instrument" size="medium" name="instrument" defaultValue={formValue.instrument} data={["Options", "Spot"]} onChange={handleChange} fullWidth required />
            {formValue.instrument === "Options" && (
              <>
                <MuiTextfield variant="outlined" type="date" size="medium" name="expirationDate" defaultValue={formValue.expirationDate} label="Expiration Date" onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth required />
                <MuiSelect variant="outlined" label="Type" size="medium" name="type" defaultValue={formValue.type} data={["Put", "Call"]} onChange={handleChange} fullWidth required />
                <MuiTextfield variant="outlined" type="number" size="medium" name="strikePrice" label="Strike Price" onChange={handleChange} fullWidth required />
              </>
            )}
            {["Spot", "Options"].includes(formValue.instrument) && (
              <>
                <MuiTextfield variant="outlined" type="number" size="medium" name="price" label="Price" onChange={handleChange} fullWidth required />
                <MuiTextfield variant="outlined" type="number" size="medium" name="quantity" label="Quantity" onChange={handleChange} fullWidth required />
                <MuiTextfield variant="outlined" type="string" size="medium" name="tokenName" label="Token Name" onChange={handleChange} fullWidth required />
              </>
            )}
            <MuiTextfield variant="outlined" type="number" size="medium" name="minNotional" label="Min Notional" onChange={handleChange} fullWidth required />
            <MuiTextfield variant="outlined" type="number" size="medium" name="maxNotional" label="Max Notional" onChange={handleChange} fullWidth required />
            <MuiButton variant='contained' label="Submit" type="submit" />
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default TradeForm;
