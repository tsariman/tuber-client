import type StateForm from '../../controllers/StateForm'
import { save_content_jsx } from '../../business.logic/cache'
import FormContent from '../form.cpn'

interface IHandleFormContent {
  instance: StateForm | null
  formName: string
}

const FormContentCacheable = (props: IHandleFormContent) => {
  const { instance: form, formName } = props
  const contentJsx = (
    <FormContent
      instance={form}
      formName={formName}
      type='page'
    />
  )
  save_content_jsx(contentJsx)
  return contentJsx
}

export default FormContentCacheable