import { styled } from '@mui/material'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import parse from 'html-react-parser'
import StatePage from '../../controllers/StatePage'
import { get_fetch } from '../../state/net.actions'
import { get_origin_ending_fixed } from '../../business.logic/parsing'
import type { RootState } from '../../state'

const EP_CONTENTS = 'contents'

const Wrapper = styled('div')(() => ({
  width: '100%'
}))

interface IHtmlContent {
  instance: StatePage
}

interface IContentResponse {
  data?: {
    attributes?: {
      html?: string
    }
  }
}

/**
 * Fetches and displays HTML content from `GET /contents/:name`.
 * The page state content field format: `'$html : <content-name>'`
 * e.g.
 * ```ts
 * const page = {
 *   'content': '$html : privacy-policy',
 *   'typography': {
 *     'fontFamily': '<insert-your-font-family>',
 *     'color': '<insert-font-color>'
 *   }
 * };
 * ```
 */
const HtmlContent = ({ instance: page }: IHtmlContent) => {
  const origin = useSelector((state: RootState) => get_origin_ending_fixed(state.app.origin))
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    const url = `${origin}${EP_CONTENTS}/${page.contentName}`
    get_fetch<IContentResponse>(url)
      .then(res => setHtml(res.data?.attributes?.html ?? null))
      .catch(() => setHtml(null))
  }, [origin, page.contentName])

  if (!html) return null

  return (
    <Wrapper
      sx={{
        fontFamily: page.typography.fontFamily,
        color: page.typography.color
      }}
    >
      {parse(html)}
    </Wrapper>
  )
}

export default HtmlContent
