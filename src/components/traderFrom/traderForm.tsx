import { FC, } from 'react';
import { Box, Stack } from '@mui/material';
import { Text } from '../../commonComponents/commonStyledComponents';
import MuiSelect from '../../commonComponents/select';
import MuiTextfield from '../../commonComponents/textInput';

const TradeForm: FC = () => {

  return (
    <Box height={"100%"} position={"relative"}>
      <Box py={4} sx={{ transform: "translate(-50%)" }} position={"absolute"} left={"50%"} minWidth={"400px"}>
        <Text sx={{ fontSize: 16, textAlign: "center" }} variant="h6">Over-The-Counter Trader Form</Text>
        <Stack mt={2} direction="column" spacing={1.5}>
          <MuiSelect variant="outlined" label="Instrument" size="medium" name="instrument" defaultValue={"Options"} data={["Options", "Spot"]} onChange={(e: any) => console.log(e.target.value)} fullWidth />
          <MuiTextfield variant="outlined" type="date" size="medium" name="expirationDate" label="Expiry Date" onChange={(e: any) => console.log(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
          <MuiSelect variant="outlined" label="Instrument" size="medium" name="type" data={["Put", "Call"]} onChange={(e: any) => console.log(e.target.value)} fullWidth />
          <MuiTextfield variant="outlined" type="number" size="medium" name="price" label="Price" onChange={(e: any) => console.log(e.target.value)} fullWidth />
          <MuiTextfield variant="outlined" type="number" size="medium" name="quantity" label="Quantity" onChange={(e: any) => console.log(e.target.value)} fullWidth />
          <MuiTextfield variant="outlined" type="number" size="medium" name="stringPrice" label="Strike Price" onChange={(e: any) => console.log(e.target.value)} fullWidth />
          <MuiTextfield variant="outlined" type="string" size="medium" name="tokenName" label="Token Name" onChange={(e: any) => console.log(e.target.value)} fullWidth />
          <MuiTextfield variant="outlined" type="number" size="medium" name="minNotional" label="Min Notional" onChange={(e: any) => console.log(e.target.value)} fullWidth />
          <MuiTextfield variant="outlined" type="number" size="medium" name="maxNotional" label="Max Notional" onChange={(e: any) => console.log(e.target.value)} fullWidth />
        </Stack>
      </Box>
    </Box>
  );
};

export default TradeForm;
