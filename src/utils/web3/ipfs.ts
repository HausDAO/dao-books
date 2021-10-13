export const getImageFromIPFSHash = (hash?: string) => {
  if (!hash) {
    return ''
  }
  return 'https://ipfs.io/ipfs/' + hash
}
