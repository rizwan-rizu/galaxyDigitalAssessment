import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'

interface iSelectComponentProps {
  variant: "standard" | "filled" | "outlined",
  label?: string,
  size?: 'medium' | 'small'
  fullWidth?: boolean,
  data?: any[]
  defaultValue?: string | number
  onChange: Function
  name: string
  disabled?: boolean
  required?: boolean
  helperText?: string
}

const MuiSelect = (props: iSelectComponentProps) => (
  <FormControl variant={props.variant} size={props.size ?? "small"} fullWidth={props.fullWidth} required={props?.required}>
    <InputLabel>{props.label}</InputLabel>
    <Select
      value={props.defaultValue}
      onChange={(e) => props.onChange(e)}
      label={props.label}
      name={props.name}
      disabled={props?.disabled}
    >
      {props?.data?.map((item: any) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
    </Select>
    {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
  </FormControl>
)

export default MuiSelect