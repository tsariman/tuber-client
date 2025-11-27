import type { DialogContentProps } from '@mui/material'
import { get_parsed_content } from '../../business.logic/parsing'
import StateDialog from '../StateDialog'
import type { IStatePageContent } from '@tuber/shared'

/**
 * This is the class for a dialog that displays a form. It is similar to the
 * way a page displays a form. `IStateDialog['content']` has the same format as
 * `IStatePage['content']`. e.g.
 *
 * ```ts
 * const content = '$form : login : users'
 * ```
 *
 * And the dialog should display the form if it is defined in the
 * `appForm` object.
 */
export default class StateDialogForm extends StateDialog {
  get titleProps() {
    return {
      sx: { m: 0, p: 2 },
      ...this.dialogState.titleProps
    }
  }
  private _contentObj?: IStatePageContent

  /**
   * Same as a page content. i.e.
   *
   * ```ts
   * const content = '$form : login : users'
   * ```
   */
  get content(): unknown { return this.dialogState.content }
  get contentProps(): DialogContentProps {
    return {
      'sx': { 'paddingTop': '5px !important' },
      ...this.dialogState.contentProps
    }
  }
  private getContentObj(): IStatePageContent {
    return this._contentObj || (
      this._contentObj = get_parsed_content(this.content)
    )
  }
  get contentName(): string {
    return (this._contentObj || this.getContentObj()).name
  }
  get contentEndpoint(): string {
    return (this._contentObj || this.getContentObj()).endpoint ?? ''
  }
  get contentArgs(): string {
    return (this._contentObj || this.getContentObj()).args ?? ''
  }
}
