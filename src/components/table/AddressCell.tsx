import { useClipboard } from '@chakra-ui/hooks'
import { FC } from 'react'
import { HiOutlineCheckCircle, HiOutlineClipboardCopy } from 'react-icons/hi'

import { formatAddress } from '../../utils/methods'

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
        <div className="text-xs flex cursor-pointer text-[#ed963a]">
          <HiOutlineCheckCircle className="w-4 h-4 mr-1 relative t-1" />
          Copied
        </div>
      ) : (
        <div
          onClick={onCopy}
          className="text-xs flex cursor-pointer text-[#ed963a]"
        >
          <HiOutlineClipboardCopy className="w-4 h-4 mr-1 relative t-1" />
          Copy
        </div>
      )}
    </div>
  )
}
