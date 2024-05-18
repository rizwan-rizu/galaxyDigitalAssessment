import { FC, useReducer } from 'react';
import { Box, Stack } from '@mui/material';
import { Text } from '../../commonComponents/commonStyledComponents';
import { initialFormState, reducer } from './reducer';
import MuiSelect from '../../commonComponents/select';
import MuiTextfield from '../../commonComponents/textInput';
import MuiButton from '../../commonComponents/button';
import { formFields, iformFields } from './formJson';

const TradeForm: FC = () => {
  const [formValue, dispatch] = useReducer(reducer, initialFormState)

  const handleChange = (e: any) => {
    dispatch({ type: e.target.name, data: e.target.value })
  }

  const formJson = formFields(formValue)

  return (
    <Box height={"100%"} position={"relative"}>
      <Box py={4} sx={{ transform: "translate(-50%)" }} position={"absolute"} left={"50%"} minWidth={"400px"}>
        <Text sx={{ fontSize: 16, textAlign: "center" }} variant="h6">Over-The-Counter Trader Form</Text>
        <form onSubmit={() => console.log(formValue)}>
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
