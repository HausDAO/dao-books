import { Box, Flex, Link } from '@chakra-ui/layout'
import { FC } from 'react'
import { HiOutlineExternalLink } from 'react-icons/hi'

export const WithExternalLinkCell: FC<{
  link: string
  linkLabel: string
  label: string
}> = ({ link, linkLabel, label }) => {
  if (!label) {
    return <></>
  }
  return (
    <Flex direction="column">
      <Box mb="1">{label}</Box>
      {link && (
        <Link href={link} fontSize="sm" isExternal>
          {linkLabel}
          <HiOutlineExternalLink className="inline ml-1" />
        </Link>
      )}
    </Flex>
  )
}
