import type StateForm from '../controllers/StateForm';
import type { AppDispatch } from '../state';
import { post_req_state } from '../state/net.actions';

const defaultButtonHandle = (dispatch: AppDispatch, form: StateForm) =>
  async (e: MouseEvent) =>
{
  e.preventDefault();

  // if there are errors, do not submit the form
  const errors = form.parent.parent.formsDataErrors;
  if (errors.getCount(form.name) > 0) {
    return;
  }

  // if there are no errors, submit the form
  const formsData = form.parent.parent.formsData;
  const body = formsData.get(form.name);
  if (formsData.state[form.name] === undefined) {
    return;
  }
  if (body) {
    dispatch(post_req_state(form.endpoint, body));
    dispatch({ type: 'formsData/formsDataClear', payload: form.name });
  }
}

export default defaultButtonHandle;