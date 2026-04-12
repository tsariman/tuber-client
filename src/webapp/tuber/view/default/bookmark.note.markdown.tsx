import { styled } from '@mui/material/styles'
import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface IBookmarkNoteMarkdownProps {
  note?: string
}

const MarkdownWrapper = styled('div')(({ theme }) => ({
  '& p': {
    margin: 0,
  },
  '& p + p': {
    marginTop: theme.spacing(1),
  },
  '& ul, & ol': {
    margin: `${theme.spacing(1)} 0 0 ${theme.spacing(3)}`,
    padding: 0,
  },
  '& code': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: 4,
    padding: '0.1rem 0.25rem',
    fontSize: '0.9em',
  },
  '& pre': {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.action.hover,
    borderRadius: 6,
    overflowX: 'auto',
  },
  '& pre code': {
    backgroundColor: 'transparent',
    padding: 0,
  },
  '& a': {
    color: theme.palette.primary.main,
  },
}))

export default function BookmarkNoteMarkdown({ note }: IBookmarkNoteMarkdownProps) {
  const normalizedNote = useMemo(() => note?.trim() || '(No note)', [note])

  return (
    <MarkdownWrapper>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          a: ({ ...props }) => <a {...props} target='_blank' rel='noopener noreferrer' />,
        }}
      >
        {normalizedNote}
      </ReactMarkdown>
    </MarkdownWrapper>
  )
}
