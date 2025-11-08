import { styled } from '@mui/material';
import StatePage from '../../controllers/StatePage';

const Wrapper = styled('div')(() => ({
  width: '100%'
}));

interface IHtmlContent {
  def: StatePage;
}

/**
 * Displays the HTML content of an element. ID must be used to identify
 * the element.  
 * The idea: the "index.html" file could contain extra content in
 * elements with CSS set to `display: none`, outside of the root div tag. As in,
 * the content is invisible. This component can then be used to make the
 * content visible when needed. e.g.
 * ```ts
 * const page = {
 *   'content': '$html : <id-of-element>',
 *   'typography': {
 *     'fontFamily': '<insert-your-font-family>',
 *     'color': '<insert-font-color>'
 *   }
 * };
 * ```
 */
export default function HtmlContent ({ def: page }: IHtmlContent) {
  const domElement = document.getElementById(page.contentName);

  if (domElement) {
    return (
      <Wrapper
        dangerouslySetInnerHTML={{__html: domElement.innerHTML}}
        style={{
          fontFamily: page.typography.fontFamily,
          color: page.typography.color
        }}
      />
    );
  }

  return ( null );
}
