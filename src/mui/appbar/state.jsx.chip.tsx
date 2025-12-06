import Chip from '@mui/material/Chip'
import { useSelector } from 'react-redux'
import { type RootState, get_redux } from '../../state'
import StateFormItemCustomChip from '../../controllers/templates/StateFormItemCustomChip'
import { useMemo } from 'react'

interface IStateJsxChipProps {
  array: StateFormItemCustomChip<unknown>[]
}

const StateJsxChip = ({ array: chips }: IStateJsxChipProps) => {
  const route = useSelector(
    (rootState: RootState) => rootState.app.route ?? ''
  );
  const chipsState = useSelector((rootState: RootState) => rootState.chips)
  const routeChipsState = chipsState[route]

  const fixedChips = useMemo(() => chips.map(chip => {
    const cState = routeChipsState[chip.id]
    return new StateFormItemCustomChip({
      ...chip,
      ...cState,
    }, {})
  }), [chips, routeChipsState])

  const memoizedRedux = useMemo(() => get_redux(route), [route])

  return (
    <>
      {fixedChips.map((chip, i) => (
        <Chip
          {...chip.props}
          key={`appbar-midsearch-input-chip-${i}`}
          label={chip.label}
          variant={chip.variant}
          color={chip.color}
          onClick={chip.onClick(memoizedRedux)}
          onDelete={chip.onDelete(memoizedRedux)}
        />
      ))}
    </>
  )
}

export default StateJsxChip