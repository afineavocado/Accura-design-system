import figma from "@figma/code-connect"
import { Button } from "@/components/ui/button"

figma.connect(Button, "https://www.figma.com/design/YWfTOUTpFZ0BNxHobfUqme?node-id=12-2893", {
  props: {
    variant: figma.enum("Type", {
      Default: "default",
      Outline: "outline",
      Secondary: "secondary",
      Ghost: "ghost",
      Link: "link",
      Destructive: "destructive",
    }),
    size: figma.enum("Size", {
      Small: "sm",
      Default: "default",
      Large: "lg",
    }),
    children: figma.string("Label"),
  },
  example: ({ variant, size, children }) => (
    <Button variant={variant} size={size}>{children}</Button>
  ),
})
