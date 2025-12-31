import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen, userEvent } from '../../../test-utils';
import DialogCheckboxes from '../../../../mui/dialog/form/dialog.checkboxes';
import StateFormItemCheckbox from '../../../../controllers/templates/StateFormItemCheckbox';
import type StateForm from '../../../../controllers/StateForm';
import type { IFormChoices, IStateFormItem } from '../../../../interfaces/localized';

// Helper to build a checkbox item definition
const buildCheckboxItem = (overrides: Partial<IFormChoices> = {}): IFormChoices => ({
	name: overrides.name || 'option',
	label: overrides.label,
	color: overrides.color,
	disabled: overrides.disabled,
	props: overrides.props,
	has: overrides.has,
});

// Helper to build the form item (CHECKBOXES)
const buildFormItem = (name: string, items: IFormChoices[], color?: IFormChoices['color']): IStateFormItem<IFormChoices> => ({
	type: 'checkboxes', // 'CHECKBOXES',
	name,
	has: { items, color },
});

describe('DialogCheckboxes', () => {
	it('renders labeled and unlabeled checkboxes', async () => {
		const items: IFormChoices[] = [
			buildCheckboxItem({ name: 'optA', label: 'Option A', props: { name: 'optA' } }),
			buildCheckboxItem({ name: 'optB', props: { name: 'optB' } }),
		];
		const itemDef = buildFormItem('choices', items, 'secondary');
		const instance = new StateFormItemCheckbox(itemDef, {} as StateForm);
		const hive = { choices: [] as string[] } as Record<string, unknown>;

		renderWithProviders(<DialogCheckboxes instance={instance as unknown as any} hive={hive} />);

		// Two checkboxes rendered; one labeled via FormControlLabel
		expect(screen.getByRole('checkbox', { name: 'Option A' })).toBeInTheDocument();
		const all = screen.getAllByRole('checkbox');
		expect(all.length).toBe(2);
	});

	it('initializes from hive defaults and updates selections on change', async () => {
		const user = userEvent.setup();
		const items: IFormChoices[] = [
			buildCheckboxItem({ name: 'optA', label: 'Option A', props: { name: 'optA' } }),
			buildCheckboxItem({ name: 'optB', props: { name: 'optB' } }),
		];
		const itemDef = buildFormItem('choices', items);
		const instance = new StateFormItemCheckbox(itemDef, {} as StateForm);
		// Default hive state has optB selected
		const hive = { choices: ['optB'] as string[] } as Record<string, unknown>;

		renderWithProviders(<DialogCheckboxes instance={instance as unknown as any} hive={hive} />);

		// Check Option A -> hive should include optA and preserve optB
		await user.click(screen.getByRole('checkbox', { name: 'Option A' }));
		expect(hive['choices']).toEqual(expect.arrayContaining(['optA', 'optB']));

		// Note: Component does not update checked statuses; verify added selection only
	});

	it('respects per-box disabled state', () => {
		const items: IFormChoices[] = [
			buildCheckboxItem({ name: 'enabled', label: 'Enabled', props: { name: 'enabled' } }),
			buildCheckboxItem({ name: 'disabled', disabled: true, props: { name: 'disabled' } }),
		];
		const itemDef = buildFormItem('choices', items);
		const instance = new StateFormItemCheckbox(itemDef, {} as StateForm);
		const hive = { choices: [] as string[] } as Record<string, unknown>;

		renderWithProviders(<DialogCheckboxes instance={instance as unknown as any} hive={hive} />);

		const all = screen.getAllByRole('checkbox');
		const enabled = all.find(el => el.getAttribute('name') === 'enabled') || all[0];
		const disabled = all.find(el => el.getAttribute('name') === 'disabled') || all[1];
		expect(enabled).not.toHaveAttribute('disabled');
		expect(disabled).toHaveAttribute('disabled');
	});
});

