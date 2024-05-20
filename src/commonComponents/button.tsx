import { Button } from '@mui/material'
import { MouseEventHandler } from 'react'

interface iButtonComponentProps {
  variant?: 'contained' | 'outlined' | 'text'
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
  size?: "small" | "medium" | "large" | undefined
  type?: "submit" | undefined
  fullWidth?: boolean | undefined
  startIcon?: any
  endIcon?: any
  label: string
  disabled?: boolean
  onClick?: MouseEventHandler
  href?: string
  testId?: string
}

const MuiButton = (props: iButtonComponentProps) => {
  return (
    <Button
      data-testid={props.testId}
      color={props.color}
      variant={props?.variant}
      fullWidth={props?.fullWidth}
      size={props?.size}
      startIcon={props?.startIcon}
      endIcon={props?.endIcon}
      type={props?.type}
      onClick={props?.onClick}
      disabled={props?.disabled}
      href={props?.href}
    >
      {props.label}
    </Button>
  )
}

export default MuiButton