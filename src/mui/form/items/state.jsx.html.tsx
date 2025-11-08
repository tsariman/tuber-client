import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import {
  type StateForm,
  type StateFormItem
} from '../../../controllers';
import { get_redux, type RootState } from '../../../state';
import parse from 'html-react-parser';
import { Fragment } from 'react';
import Link from '@mui/material/Link';
import type { TObj } from '@tuber/shared';
import { parseHandlebars } from './_items.common.logic';

interface IHtmlProps {
  def: StateFormItem<StateForm, string>;
}

/** Styled anchor element */
export const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  '&:hover': {
    textDecoration: 'underline'
  }
}));

/**
 * Renders HTML as JSX.
 *
 * ```json
 * {
 *   "type": "html",
 *      "props": { "sx": { } },
 *      "has": {
 *        "content": "<div>Hello world!</div>",
 * 
 *         // [optional] page route or key is used if the content is a
 *         // handlebars template. The values will be retrieve from the
 *         // pagesData state. e.g. pagesData.home
 *        "route": "home",
 *         // or
 *        "key": "home"
 *      }
 *   },
 * }
 * ```
 */
export function StateJsxHtml({ def: html }: { def: StateFormItem<StateForm, string> }) {
  let htmlText =  html.has.text || html.has.content;
  const pagesDataState = useSelector((state: RootState) => state.pagesData);

  if (html.has.key || html.has.route) {
    const pageData = pagesDataState[html.has.key || html.has.route] as TObj;
    htmlText = parseHandlebars(html.has.content || html.has.text, pageData);
  }

  return <Box {...html.props} dangerouslySetInnerHTML={{ __html: htmlText }} />;
}

/** State html tag */
export const StateJsxHtmlTag: React.FC<IHtmlProps> = ({ def: htmlTag }) => {
  if (htmlTag.has.state.content) {
    const tag = parse(htmlTag.has.content) || null;
    if (tag) {
      return <Fragment>{ tag }</Fragment>;
    }
  }
  return ( null );
}

/** State version of the HTML anchor tag */
export const StateJsxHtmlA: React.FC<IHtmlProps> = ({ def: link }) => {
  return (
    <Fragment>
      <Link
        {...link.props}
        onClick={link.clickReduxHandler(get_redux(link.has.route))}
      >
        { link.text }
      </Link>
    </Fragment>
  );
}