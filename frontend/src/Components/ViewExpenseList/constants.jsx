import { MonetizationOnRounded, PostAddRounded } from '@material-ui/icons';

export const VIEW_EXPENSE_LIST_COLUMN_HEADERS = {
  item_name: {
    key: 'item_name',
    title: 'Title',
    displayName: 'Item Name',
  },
  description: {
    key: 'description',
    title: 'Item Description',
    displayName: 'Item Description',
  },
  item_cost: {
    key: 'item_cost',
    title: 'item_cost',
    displayName: 'Item Cost',
  },
  notes: {
    key: 'notes',
    title: 'notes',
    displayName: 'Notes',
  },
  purchase_location: {
    key: 'purchase_location',
    title: 'Bought At',
    displayName: 'Purchase Location',
    modifier: (title) => `${title}`,
  },
  creator_name: {
    key: 'creator_name',
    title: 'Creator Name',
    displayName: 'Creator',
  },
  updator_name: {
    key: 'updator_name',
    title: 'Updator Name',
    displayName: 'Updater',
  },
  created_at: {
    key: 'created_at',
    title: 'Created At',
    displayName: 'Created At',
  },
  updated_at: {
    key: 'updated_at',
    title: 'Updated At',
    displayName: 'Updated At',
  },
};

export const GENERIC_TEXTFIELD_VARIANT = {
  type: 'text',
  variant: 'standard',
  fullWidth: true,
};

export const GENERIC_TEXTAREA_VARIANT = {
  type: 'text',
  multiline: true,
  rows: 4,
  variant: 'outlined',
  fullWidth: true,
};

export const ADD_EXPENSE_FORM_FIELDS = {
  item_name: {
    label: 'Item name',
    placeholder: 'Small blue crayons ...',
    value: '',
    name: 'item_name',
    required: true,
    errorMsg: '',
    icon: <PostAddRounded />,
    validators: [
      {
        validate: (value) => value.trim().length === 0,
        message: 'Item name is required',
      },
      {
        validate: (value) => value.trim().length >= 50,
        message: 'Item name should be less than 50 characters',
      },
    ],
    ...GENERIC_TEXTFIELD_VARIANT,
  },
  item_cost: {
    label: 'Cost',
    placeholder: 'Total cost ...',
    value: '',
    required: true,
    name: 'item_cost',
    errorMsg: '',
    icon: <MonetizationOnRounded />,
    validators: [
      {
        validate: (value) => isNaN(value) || parseFloat(value) <= 0,
        message: 'Cost should be +ve in nature',
      },
    ],
    ...GENERIC_TEXTFIELD_VARIANT,
  },
  purchase_location: {
    label: 'Place of purchase',
    placeholder: 'Walmart ...',
    value: '',
    name: 'purchase_location',
    errorMsg: '',
    validators: [],
    ...GENERIC_TEXTFIELD_VARIANT,
  },
  notes: {
    label: 'Notes',
    placeholder: 'Bought to draw chalk marks ...',
    value: '',
    name: 'notes',
    errorMsg: '',
    validators: [],
    ...GENERIC_TEXTAREA_VARIANT,
  },
};
