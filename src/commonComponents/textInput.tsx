import { TextField } from '@mui/material'

export interface iTextComponentProps {
  variant: "standard" | "filled" | "outlined"
  label: string,
  placeholder?: string,
  name?: string
  onChange: Function
  type: string,
  size?: "small" | "medium",
  fullWidth?: boolean
  multiline?: boolean
  required?: boolean
  helperText?: string
  rows?: number
  inputProps?: object
  InputLabelProps?: object
  error?: boolean
  defaultValue?: string
  value?: string | number
  disabled?: boolean
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning"
}

const MuiTextfield = (props: iTextComponentProps) => (
  <TextField
    color={props.color}
    variant={props?.variant}
    label={props?.label}
    name={props?.name}
    type={props?.type}
    onChange={(e) => props.onChange(e)}
    size={props.size ?? "small"}
    error={props?.error}
    placeholder={props?.placeholder}
    fullWidth={props?.fullWidth}
    required={props?.required}
    multiline={props?.multiline}
    rows={props?.rows}
    InputLabelProps={props?.InputLabelProps}
    inputProps={props?.inputProps}
    defaultValue={props?.defaultValue}
    value={props?.value}
    disabled={props?.disabled}
    helperText={props?.helperText}
  />
)

export default MuiTextfield