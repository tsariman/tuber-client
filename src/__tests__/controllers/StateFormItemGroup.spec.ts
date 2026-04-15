import { describe, it, expect, vi } from 'vitest'
import StateForm from '../../controllers/StateForm'
import StateFormItemGroup from '../../controllers/StateFormItemGroup'

describe('StateFormItemGroup', () => {
  const createGroup = () => new StateFormItemGroup({}, {} as StateForm)

  it('returns no keydown prop when no handlers are assigned', () => {
    const group = createGroup()

    expect(group.props.onKeyDown).toBeUndefined()
    expect(group.props.onClick).toBeUndefined()
  })

  it('calls both keydown and click handlers on Enter', () => {
    const group = createGroup()
    const onKeyDown = vi.fn()
    const onClick = vi.fn()

    group.onKeyDown = onKeyDown
    group.onClick = onClick

    const event = { key: 'Enter' } as KeyboardEvent
    ;(group.props.onKeyDown as (e: KeyboardEvent) => void)(event)

    expect(onKeyDown).toHaveBeenCalledWith(event)
    expect(onClick).toHaveBeenCalledWith(event)
  })

  it('does not call click handler for non-Enter keys', () => {
    const group = createGroup()
    const onClick = vi.fn()

    group.onClick = onClick

    const event = { key: 'Escape' } as KeyboardEvent
    ;(group.props.onKeyDown as (e: KeyboardEvent) => void)(event)

    expect(onClick).not.toHaveBeenCalled()
  })
})