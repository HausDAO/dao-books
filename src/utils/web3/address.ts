export const formatAddress = (
  address: string | null | undefined,
  ensName: string | null | undefined,
  chars = 6
): string => {
  if (ensName) return ensName
  else if (address)
    return `${address.substring(0, chars)}...${address.substring(
      address.length - chars
    )}`
  else return ''
}
