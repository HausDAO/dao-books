import { useClipboard } from '@chakra-ui/hooks'
import { Flex } from '@chakra-ui/layout'
import { FC } from 'react'
import { HiOutlineCheckCircle, HiOutlineClipboardCopy } from 'react-icons/hi'

import { formatAddress } from '../../utils/web3/address'

export const AddressCell: FC<{ address: string }> = ({ address }) => {
  const { hasCopied, onCopy } = useClipboard(address)
  const counterparty = formatAddress(address, null)
  if (!address) {
    return <></>
  }
  return (
    <div className="flex flex-col space-y-1">
      <div title={address}>{counterparty}</div>
      {hasCopied ? (
        <Flex fontSize="sm" color="interface.orange.base">
          <HiOutlineCheckCircle className="w-4 h-4 mr-1 relative t-1" />
          Copied
        </Flex>
      ) : (
        <Flex
          onClick={onCopy}
          cursor="pointer"
          fontSize="sm"
          color="interface.orange.base"
        >
          <HiOutlineClipboardCopy className="w-4 h-4 mr-1 relative t-1" />
          Copy
        </Flex>
      )}
    </div>
  )
}
