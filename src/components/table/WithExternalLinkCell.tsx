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
    <div className="flex flex-col space-y-1">
      <div>{label}</div>
      {link && (
        <a
          href={link}
          className="text-xs hover:underline flex items-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkLabel}
          <HiOutlineExternalLink className="inline ml-1" />
        </a>
      )}
    </div>
  )
}
