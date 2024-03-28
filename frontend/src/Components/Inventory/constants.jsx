import { AllInboxRounded, DraftsRounded, LoyaltyRounded, VisibilityOffRounded } from '@material-ui/icons';

export const INVENTORY_TABS = [
    {
      id: 1,
      icon: <AllInboxRounded />,
      tootipTitle: 'Displays products that are not hidden',
      label: 'All products',
    },
    {
      id: 2,
      icon: <LoyaltyRounded />,
      tootipTitle: 'Displays products that were labelled as bought in sale',
      label: 'Coupons / Deals',
    },
    {
      id: 3,
      icon: <DraftsRounded />,
      tootipTitle: 'Displays all products labelled as draft / published',
      label: 'Draft / Published',
    },
    {
      id: 4,
      icon: <VisibilityOffRounded />,
      tootipTitle: 'Displays all products with hidden status',
      label: 'Hidden status',
    },
  ];


  export const VIEW_PERSONAL_INVENTORY_LIST_HEADERS = {
    name: {
      key: 'name',
      title: 'Item name',
      displayName: 'Item name',
    },
    description: {
      key: 'item_description',
      title: 'Item Description',
      displayName: 'Description',
    },
    price: {
      key: 'price',
      title: 'Cost',
      displayName: 'Cost Per Unit',
      modifier: (title) => `${title}`,
    },
    status: {
      key: 'status',
      title: 'Status',
      displayName: 'Item Status',
      modifier: (title) => `${title}`,
    },
    barcode: {
      key: 'barcode',
      title: 'Barcode',
      displayName: 'Barcode',
      modifier: (title) => `${title}`,
    },
    sku: {
      key: 'SKU',
      title: 'SKU',
      displayName: 'SKU',
    },
    quantity: {
      key: 'quantity',
      title: 'Quantity',
      displayName: 'Item Quantity',
      modifier: (title) => `${title}`,
    },
    created_at: {
      key: 'created_at',
      title: 'Created At',
      displayName: 'Creation Date',
    },
    updated_at: {
      key: 'updated_at',
      title: 'Updated At',
      displayName: 'Update Date',
    },
    location: {
      key: 'location',
      title: 'Storage Location',
      displayName: 'Location',
    },
    item_detail: {
      key: 'item_detail',
      title: 'Item Detail',
      displayName: 'Item Details',
    },
    bought_at: {
      key: 'bought_at',
      title: 'Bought At',
      displayName: 'Purchase Location',
    },
    creator_name: {
      key: 'creator_name',
      title: 'Creator Name',
      displayName: 'Creator',
    },
    updater_name: {
      key: 'updater_name',
      title: 'Updator Name',
      displayName: 'Updater',
    },
  };
  