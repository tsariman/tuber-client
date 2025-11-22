import { memo, useState, type ChangeEvent, type JSX } from 'react'
import {
  CardContent,
  GridLegacy as Grid, // TODO: Port to new equivalent
  IconButton,
  InputAdornment,
  Paper,
  type SxProps,
  type Theme,
  Toolbar, 
  Typography,
  useTheme
} from '@mui/material'
import { styled } from '@mui/material/styles'
import StatePage from '../../controllers/StatePage'
import type { IJsonapiError } from '@tuber/shared'
import {
  JsonapiError,
  color_json_code,
  format_json_code,
  get_errors_list
} from '../../business.logic'
import InputBase from '@mui/material/InputBase'
import { StateJsxIcon } from '../icon'

type TSetLastSelected = <T>($class: T) => void
type TClasses = 'errorCardHover' | 'errorCardClicked'
type TStyles = {[key in TClasses]: SxProps }
type TGetErrorCardStyles = (theme: Theme) => TStyles

interface IPageErrorsProps { def: StatePage }

interface IHive {
  selected_i?: number
  filter?: string
  setSelected?: TSetLastSelected
  setState?: (state: string) => void
}

interface IErrorListItemProp {
  i: number
  errorState: IJsonapiError
  /** data shared between detail & error components */
  hive: IHive
}

const getErrorCardStyles: TGetErrorCardStyles = (theme: Theme) => ({
  errorCardHover: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      cursor: 'pointer'
    },
  },
  errorCardClicked: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      cursor: 'pointer'
    },
    backgroundColor: `${theme.palette.action.selected} !important`
  }
})

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  border: `2px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
  flexGrow: 1,
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}))

const ErrorList = styled('div')(() => ({
  flexGrow: 1,
  overflowY: 'scroll',
  height: 'calc(100vh - 107px)',
}))

const ErrorJsonGrid = styled(Grid)(() => ({
  overflowY: 'auto',
  flex: 1,

}))

const ErrorJsonWrapper = styled('div')(() => ({
  position: 'relative',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  overflowWrap: 'anywhere',
}))

const ClearOutlinedIcon = memo(() => (
  <StateJsxIcon
    name='close'
    config={{ color: 'error', fontSize: 'small' }}
  />
))

/** Original color: '#9e9e9e' */
const SearchIcon = memo(() => (
  <StateJsxIcon
    name='search'
    config={{ sx: {'color': 'text.secondary'} }}
  />
))

/** Highlight all occurence of a substring into a value */
const highlight = (str: string, regex: string, theme: Theme) => {
  const style = [
    `background-color:${theme.palette.warning.light}`,
    `color:${theme.palette.warning.contrastText}`
  ].join(';')
  const regularExp = new RegExp(regex, 'g')
  return str.replace(
    regularExp,
    match => `<span style="${style}">${match}</span>`
  )
}

/** Same as the highlight function but returns a JSX.Element. */
const Highlight = ({
  value,
  regex,
  theme
}: { value: string, regex: string, theme: Theme }): JSX.Element => {
  const style = [
    `background-color:${theme.palette.warning.light}`,
    `color:${theme.palette.warning.contrastText}`
  ].join(';')
  const regularExp = new RegExp(regex, 'g')
  return <span dangerouslySetInnerHTML={{
    __html: value.replace(
      regularExp,
      match => `<span style="${style}">${match}</span>`
    )
  }} />
}

/** Highlight all matches found as substring into json. */
const jsonWithMatches = (state: string, filters: string[], theme: Theme): string => {
  let highlightedState = state
  filters.forEach(filter => {
    highlightedState = highlight(highlightedState, filter, theme)
  })
  return highlightedState
}

/** Highlight all matches found as substring in code. */
const CodeWithMatches = ({
  code,
  matches,
  theme
}: { code: string, matches: string[], theme: Theme }): JSX.Element => {
  return <Highlight value={code} regex={matches.join('|')} theme={theme} />
}

const IdWithMatches = ({
  id,
  matches,
  theme
}: { id: string, matches: string[], theme: Theme }) => {
  return <Highlight value={id} regex={matches.join('|')} theme={theme} />
}

const TitleWithMatches = ({
  title,
  matches,
  theme
}: { title: string, matches: string[], theme: Theme }) => {
  return (
    <Typography variant='subtitle2' component='div'>
      <Highlight value={title} regex={matches.join('|')} theme={theme} />
    </Typography>
  )
}

/** List of errors in the left column. */
function ErrorListItem({ i, errorState: errorJson, hive }: IErrorListItemProp): JSX.Element | null {
  const theme = useTheme()
  const styles = getErrorCardStyles(theme)
  const error = new JsonapiError(errorJson)
  const [ $class, setClass ] = useState<TClasses>('errorCardHover')

  const onPaperClick = () => {
    if (i !== hive.selected_i) {
      if (hive.setSelected) { hive.setSelected<TClasses>('errorCardHover') }
      setClass('errorCardClicked')
      if (hive.filter) {
        const jsonStr = format_json_code(error.json)
        const json = jsonWithMatches(jsonStr, hive.filter.split(/\s+/), theme)
        if (hive.setState) { hive.setState(json) }
      } else {
        const json = color_json_code(error.json, theme)
        if (hive.setState) { hive.setState(json) }
      }
      hive.selected_i = i
      hive.setSelected = setClass as TSetLastSelected
    }
  }

  if (hive.filter) {
    const filterWords = hive.filter?.split(' ') || []
    const json = JSON.stringify(error.json)
    const jsonMatches = filterWords.filter(w => json.includes(w))
    if (jsonMatches.length === 0) { return ( null ) }
    const idMatches = filterWords.filter(w => error.id.includes(w))
    const codeMatches = filterWords.filter(w => error.code.includes(w))
    const titleMatches = filterWords.filter(w => error.title.includes(w))

    return (
      <Paper square sx={styles[$class]} onClick={onPaperClick}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
            <IdWithMatches id={error.id} matches={idMatches} theme={theme} />
            :
            <CodeWithMatches code={error.code} matches={codeMatches} theme={theme} />
          </Typography>
          <TitleWithMatches title={error.title} matches={titleMatches} theme={theme} />
        </CardContent>
      </Paper>
    )
  }

  return (
    <Paper square sx={styles[$class]} onClick={onPaperClick}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          {error.id}:{error.code}
        </Typography>
        <Typography variant='subtitle2' component='div'>{error.title}</Typography>
      </CardContent>
    </Paper>
  )
}

function ErrorBody({ hive }: { hive: IHive }): JSX.Element | null {
  const [ json, setJson ] = useState<string>('')
  hive.setState = setJson
  return json ? (
    <ErrorJsonGrid sx={{ height: '84vh', pl: 2 }} item>
      <ErrorJsonWrapper
        dangerouslySetInnerHTML={{
          __html: json
        }}
      />
    </ErrorJsonGrid>
  ) : ( null )
}

/** Error page */
export default function PageErrors({ def: page }: IPageErrorsProps) {
  void page
  const errors = get_errors_list()
  const [ filter, setFilter ] = useState<string>('')

  const handleSearchChange = (e: unknown) => {
    setFilter((e as ChangeEvent<HTMLInputElement>).target.value)
    if (hive.setSelected) { hive.setSelected<TClasses>('errorCardHover') }
    if (hive.setState) { hive.setState('') }
  }

  const handleClearFilter = () => {
    setFilter('')
    if (hive.setSelected) { hive.setSelected<TClasses>('errorCardHover') }
    if (hive.setState) { hive.setState('') }
  }

  const hive: IHive = { filter }

  return (
    <Grid container spacing={0}>
      <Grid md={3} sx={{ pl: 1 }} item>
        <Toolbar />
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Filter..."
            inputProps={{ 'aria-label': 'filter' }}
            fullWidth
            value={filter}
            onChange={handleSearchChange}
            endAdornment={
              <InputAdornment position="end">
                {filter ?
                  <IconButton
                    aria-label="clear"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={handleClearFilter}
                  >
                    <ClearOutlinedIcon />
                  </IconButton> : ( null )
                }
              </InputAdornment>
            }
          />
        </Search>
        <ErrorList>
          {errors.slice(0).reverse().map((e, i) => (
            <ErrorListItem i={i} key={`e-${i}`} errorState={e} hive={hive} />
          ))}
        </ErrorList>
      </Grid>
      <Grid md={9} item>
        <Toolbar />
        <ErrorBody hive={hive} />
      </Grid>
    </Grid>
  )
}
