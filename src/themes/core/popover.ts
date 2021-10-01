import { PopoverBodyProps } from '@chakra-ui/popover'

const Popover = {
  parts: ['popper'],
  baseStyle: (props: PopoverBodyProps) => ({
    popper: {
      zIndex: 10,
      maxW: props.width ? props.width : 'xs',
      w: '100%',
    },
  }),
}

export default Popover
