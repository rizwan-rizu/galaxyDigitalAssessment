import { Box, Typography } from "@mui/material"
import { styled } from "@mui/system"

export const FlexContainer = styled(Box)({
  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap"
})

export const Text = styled(Typography)({
  fontFamily: "monospace"
})