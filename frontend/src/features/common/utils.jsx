import { Button, Stack, Typography } from '@mui/material';
import SimpleModal from './SimpleModal';
import CryptoJS from 'crypto-js';

/**
 * Function used to decrypt the client location from the local storage. To prevent XSS attacks on
 * the client web provider, we are using CyrptoJS lib to persist a scrambled version of the user location.
 *
 * @returns parsed and validated user location data
 */
export const RetrieveClientLocation = () => {
  const ciphertext = localStorage.getItem('client_location');
  if (ciphertext) {
    try {
      const userID = localStorage.getItem('userID');
      const bytes = CryptoJS.AES.decrypt(ciphertext, userID);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData || {};
    } catch (e) {
      // eat exception
    }
  }
  return null;
};

/**
 * display no matching records found component if there are no records
 */
export const EmptyComponent = ({ subtitle = '' }) => (
  <Stack alignItems="center">
    <Typography color="textSecondary">Sorry, no matching records found.</Typography>
    <Typography variant="caption" color="textSecondary">
      {subtitle}
    </Typography>
  </Stack>
);

/**
 * Confirmation Box Modal
 */
export const ConfirmationBoxModal = ({
  openDialog,
  title,
  handleClose,
  maxSize,
  textVariant,
  text,
  deleteID,
  confirmDelete,
}) => {
  return openDialog ? (
    <SimpleModal title={title} handleClose={handleClose} maxSize={maxSize}>
      <Typography variant={textVariant}>{text}</Typography>
      <Stack direction="row" justifyContent="flex-end">
        <Button onClick={handleClose}>Go back</Button>
        <Button onClick={() => confirmDelete(deleteID)}>Confirm</Button>
      </Stack>
    </SimpleModal>
  ) : null;
};

/**
 * generate title color fn is used to build out the title and associated color with it.
 * @param {Object} row - the currently selected row
 * @param {Boolean} isCategory - if the selection is pertaining to category
 * @param {Boolean} override - if the table does not need these values
 */
export const generateTitleColor = (row, isCategory, override) => {
  let title = null;
  let color = null;

  if (override) {
    title = '';
    color = '';
    return { title, color };
  }

  if (isCategory) {
    title = row?.category_item.length > 0 && `Assigned ${row?.category_item[0].category_name} Category`;
    color = row?.category_item.length > 0 && row?.category_item[0].associated_color;
  } else {
    title =
      row?.maintenance_item.length > 0 && `Assigned ${row?.maintenance_item[0].maintenance_plan_name} Maintenance Plan`;
    color = row?.maintenance_item.length > 0 && row?.maintenance_item[0].associated_color;
  }
  return { title, color };
};

/**
 * Takes array of notes and transforms them into objects categorized by the date and time
 *
 * Recently updated - Up to the last week
 * Last Week - Up to the previous week
 * Last month and beyond - everything else
 *
 * @param {Array} notes
 * @returns {Array} refactored notes
 */
export const categorizeNotes = (notes) => {
  const currentTime = new Date();
  const categorizedNotes = notes.reduce((acc, item) => {
    const updatedTime = new Date(item.updated_at);
    const differenceInDays = Math.floor((currentTime - updatedTime) / (1000 * 3600 * 24));

    let category;
    if (differenceInDays <= 7) {
      category = 'Recently added notes';
    } else if (differenceInDays <= 14) {
      category = 'Last Week';
    } else {
      category = 'Last Month and Beyond';
    }

    if (!acc[category]) {
      acc[category] = {
        id: acc.length + 1,
        category: category,
        totalNotes: 0,
        details: [],
      };
    }

    acc[category].details.push({
      id: acc[category].details.length + 1,
      ...item,
    });

    acc[category].totalNotes++;
    return acc;
  }, {});

  return Object.values(categorizedNotes);
};
