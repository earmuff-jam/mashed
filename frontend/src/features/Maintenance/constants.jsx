import dayjs from "dayjs";

export const ITEMS_IN_MAINTENANCE_PLAN_HEADER = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'description', headerName: 'Description', flex: 2 },
  { field: 'price', headerName: 'Price', flex: 1 },
  { field: 'quantity', headerName: 'Quantity', flex: 1 },
  { field: 'location', headerName: 'Storage Location', flex: 1 },
  { field: 'updater_name', headerName: 'Last updated by', flex: 1 },
];

export const ITEM_TYPE_MAPPER = {
  daily: {
    display: 'Daily',
    value: 'daily',
    since: dayjs().add(1, 'day').toISOString(),
  },
  weekly: {
    display: 'Weekly',
    value: 'weekly',
    since: dayjs().add(7, 'days').toISOString(),
  },
  biweekly: {
    display: 'Bi-Weekly',
    value: 'biweekly',
    since: dayjs().add(15, 'days').toISOString(),
  },
  monthly: {
    display: 'Monthly',
    value: 'monthly',
    since: dayjs().add(30, 'days').toISOString(),
  },
  quaterly: {
    display: 'Quaterly',
    value: 'quaterly',
    since: dayjs().add(3, 'months').toISOString(),

  },
  semiannually: {
    display: 'Semi-annually',
    value: 'semiannually',
    since: dayjs().add(6, 'months').toISOString(),
  },
  annual: {
    display: 'Annually',
    value: 'annual',
    since: dayjs().add(1, 'year').toISOString(),
  },
};

const GENERIC_FORM_FIELDS = {
  type: 'text',
  variant: 'outlined',
};

export const BLANK_MAINTENANCE_PLAN = {
  name: {
    value: '',
    name: 'name',
    required: true,
    errorMsg: '',
    validators: [
      {
        validate: (value) => value.trim().length === 0,
        message: 'Plan name is required',
      },
      {
        validate: (value) => value.trim().length >= 50,
        message: 'Plan name should be less than 50 characters',
      },
    ],
  },
  description: {
    value: '',
    name: 'description',
    required: true,
    errorMsg: '',
    validators: [
      {
        validate: (value) => value.trim().length === 0,
        message: 'Plan description is required',
      },
      {
        validate: (value) => value.trim().length >= 500,
        message: 'Plan description should be less than 500 characters',
      },
    ],
  },
  min_items_limit: {
    label: 'Min items count',
    placeholder: 'Mininum count of items',
    value: '',
    name: 'min_items_limit',
    errorMsg: '',
    required: true,
    fullWidth: true,
    validators: [
      {
        validate: (value) => {
          const parsedValue = parseInt(value, 10);
          return isNaN(parsedValue) || parsedValue < 0;
        },
        message: 'Minimum threshold limit must be a positive integer',
      },
      {
        validate: (value) => !Number.isInteger(parseFloat(value)),
        message: 'Minimum threshold must be a number',
      },
      {
        validate: (value) => parseFloat(value) >= Number.MAX_SAFE_INTEGER,
        message: 'Minimum threshold number is too high',
      },
    ],
    ...GENERIC_FORM_FIELDS,
  },
  max_items_limit: {
    label: 'Max items count',
    placeholder: 'Maximum count of items',
    value: '',
    name: 'max_items_limit',
    errorMsg: '',
    required: true,
    fullWidth: true,
    validators: [
      {
        validate: (value) => {
          const parsedValue = parseInt(value, 10);
          return isNaN(parsedValue) || parsedValue < 0;
        },
        message: 'Maximum threshold limit must be a positive integer',
      },
      {
        validate: (value) => !Number.isInteger(parseFloat(value)),
        message: 'Maximum threshold must be a number',
      },
      {
        validate: (value) => parseFloat(value) >= Number.MAX_SAFE_INTEGER,
        message: 'Maximum threshold number is too high',
      },
    ],
    ...GENERIC_FORM_FIELDS,
  },
};
