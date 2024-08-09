import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Dialog,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Slide,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import {
  CheckRounded,
  CircleRounded,
  CloseRounded,
  EditRounded,
  GridViewRounded,
  ViewListRounded,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import HeaderWithButton from '../common/HeaderWithButton';
import SimpleModal from '../common/SimpleModal';
import { ConfirmationBoxModal, generateTitleColor } from '../common/utils';
import TableComponent from './TableComponent';
import GridComponent from './GridComponent';
import { VIEW_INVENTORY_LIST_HEADERS } from './constants';
import { useSelector } from 'react-redux';
import SelectedRowItem from './SelectedRowItemComponent';
import { useNavigate } from 'react-router-dom';
import AddInventoryDetail from '../../Components/Inventory/AddInventoryDetail';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const MODAL_STATE = {
  NONE: 'none',
  ADD_ITEM: 'item',
  BULK_ITEM: 'bulk',
  MORE_DETAILS: 'more',
  ASSIGN_CATEGORY: 'assign_category',
  ASSIGN_MAINTENANCE_PLAN: 'assign_maintenance_plan',
};

const InventoryListDetails = ({ hideActionMenu = false }) => {
  const navigate = useNavigate();
  const { loading, inventories } = useSelector((state) => state.inventory);

  const [options, setOptions] = useState([]);
  const [inputColumn, setInputColumn] = useState('');
  const [editLineItem, setEditLineItem] = useState({ editItem: false, rowID: -1, column: '' });
  const [selectedRow, setSelectedRow] = useState([]); // to display more details
  const [rowSelected, setRowSelected] = useState([]); // this is for checkbox and associated events
  const [gridMode, setGridMode] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [idToDelete, setIdToDelete] = useState(-1);
  const [modalState, setModalState] = useState(MODAL_STATE.NONE);

  const handleCloseModal = () => setModalState(MODAL_STATE.NONE);
  // const handleAddCategory = () => setModalState(MODAL_STATE.ASSIGN_CATEGORY);
  // const handleAddInventory = () => setModalState(MODAL_STATE.ASSIGN_MAINTENANCE_PLAN);

  // checkbox actions
  const handleRowSelection = (_, id) => {
    if (id === 'all') {
      if (rowSelected.length === 0) {
        setRowSelected(inventories.map((v) => v.id));
      } else {
        setRowSelected([]);
      }
    } else {
      const selectedIndex = rowSelected.indexOf(id);
      let draftSelected = [];
      if (selectedIndex === -1) {
        draftSelected = draftSelected.concat(rowSelected, id);
      } else if (selectedIndex === 0) {
        draftSelected = draftSelected.concat(rowSelected.slice(1));
      } else if (selectedIndex === rowSelected.length - 1) {
        draftSelected = draftSelected.concat(rowSelected.slice(0, -1));
      } else if (selectedIndex > 0) {
        draftSelected = draftSelected.concat(rowSelected.slice(0, selectedIndex), rowSelected.slice(selectedIndex + 1));
      }
      setRowSelected(draftSelected);
    }
  };

  const populateIcon = (editLineItem, row, column, inputColumn, setInputColumn) => {
    if (editLineItem.editItem && editLineItem.rowID === row.id && editLineItem.column === column && inputColumn) {
      return (
        <CheckRounded
          sx={{ height: '1rem', width: '1rem', marginLeft: '0.5rem', cursor: 'pointer' }}
          color="primary"
          onClick={() => {
            // const draftRequest = {
            //   id: row.id,
            //   price: editLineItem.column === 'price' ? inputColumn : row.price,
            //   quantity: editLineItem.column === 'quantity' ? inputColumn : row.quantity,
            //   updated_by: user.id,
            //   updated_on: dayjs(),
            // };
            // updateInventory.mutate({ ...draftRequest });
            setInputColumn('');
            setEditLineItem({ editItem: false, rowID: -1, column: '' });
          }}
        />
      );
    } else if (editLineItem.editItem && editLineItem.rowID === row.id && editLineItem.column === column) {
      return (
        <CloseRounded
          sx={{ height: '1rem', width: '1rem', marginLeft: '0.5rem', cursor: 'pointer' }}
          onClick={() => setEditLineItem({ editItem: false, rowID: -1, column: '' })}
        />
      );
    } else {
      return (
        <EditRounded
          sx={{ height: '1rem', width: '1rem', marginLeft: '0.5rem', cursor: 'pointer' }}
          onClick={() => setEditLineItem({ editItem: true, rowID: row.id, column: column })}
        />
      );
    }
  };

  const rowFormatter = (row, column, color) => {
    if (['created_at', 'updated_at'].includes(column)) {
      return dayjs(row[column]).fromNow();
    }
    if (['price', 'quantity'].includes(column)) {
      return (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {editLineItem.editItem && editLineItem.rowID === row.id && editLineItem.column === column ? (
            <TextField
              fullWidth
              variant="standard"
              label={`Editing ${column}`}
              value={inputColumn}
              onChange={(ev) => setInputColumn(ev.target.value)}
            />
          ) : row[column] <= 0 ? (
            '-'
          ) : (
            row[column]
          )}
          {populateIcon(editLineItem, row, column, inputColumn, setInputColumn)}
        </Stack>
      );
    }
    if (['updater_name', 'creator_name'].includes(column)) {
      return row[column] ?? '-';
    }
    if (['is_returnable'].includes(column)) {
      return row[column] ? <CheckRounded color="primary" /> : <CloseRounded color="error" />;
    }
    if (['name'].includes(column)) {
      return (
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          {color ? <CircleRounded sx={{ height: '0.75rem', width: '0.75rem', color: { color } }} /> : null}
          <Typography variant="subtitle2">{row[column] || '-'}</Typography>
        </Stack>
      );
    }
    return row[column] ?? '-';
  };

  const onRowSelect = (row) => {
    setModalState(MODAL_STATE.MORE_DETAILS);
    setSelectedRow(row);
  };

  const resetSelection = () => {
    handleCloseModal();
  };

  // const handleDeleteInventory = () => {
  //   setOpenDialog(true);
  //   setIdToDelete(rowSelected);
  // };

  const reset = () => {
    setOpenDialog(false);
    setRowSelected([]);
    setIdToDelete(-1);
  };

  const confirmDelete = (id) => {
    if (id === -1) {
      return;
    }
    // deleteInventories.mutate(rowSelected);
    reset();
  };

  const handleEdit = (itemID) => {
    navigate(`/inventories/${itemID}/update`);
  };

  useEffect(() => {
    if (Array.isArray(inventories)) {
      setOptions(inventories);
    }
  }, [loading]);

  return (
    <Stack flexGrow="1">
      <Stack direction="row" justifyContent="space-between">
        <HeaderWithButton title="Assets" />
        <FormGroup>
          <FormControlLabel
            control={<Switch defaultChecked size="small" />}
            sx={{
              alignItems: 'unset',
            }}
            label={
              gridMode ? (
                <GridViewRounded color="primary" fontSize="small" />
              ) : (
                <ViewListRounded color="primary" fontSize="small" />
              )
            }
            labelPlacement="end"
            onClick={() => setGridMode(!gridMode)}
          />
        </FormGroup>
      </Stack>

      <Autocomplete
        sx={{ maxWidth: '20rem', mb: 1 }}
        id="inventory-items-autocomplete"
        options={options}
        autoHighlight
        getOptionLabel={(option) => option.name}
        onChange={(_, newValue) => {
          if (newValue) {
            setOptions(inventories.filter((option) => option.id === newValue.id));
          } else {
            setOptions(inventories);
          }
        }}
        renderInput={(params) => <TextField variant="standard" {...params} label="Search ..." />}
      />
      {gridMode ? (
        <GridComponent isLoading={loading} data={options} rowSelected={rowSelected} />
      ) : (
        <TableComponent
          isLoading={false}
          hideActionMenu={hideActionMenu}
          data={options}
          columns={Object.values(VIEW_INVENTORY_LIST_HEADERS).filter((v) => v.displayConcise)}
          rowFormatter={rowFormatter}
          generateTitleColor={generateTitleColor}
          rowSelected={rowSelected}
          onRowSelect={onRowSelect}
          handleRowSelection={handleRowSelection}
          handleEdit={handleEdit}
        />
      )}
      {modalState === MODAL_STATE.ADD_ITEM && (
        <SimpleModal title="Add New Item" handleClose={handleCloseModal}>
          <AddInventoryDetail handleClose={handleCloseModal} />
        </SimpleModal>
      )}
      {modalState === MODAL_STATE.BULK_ITEM && (
        <SimpleModal title="Add Bulk Item" handleClose={handleCloseModal} maxSize="md">
          {/* <AddBulkUploadInventory handleClose={handleCloseModal} /> */}
        </SimpleModal>
      )}
      {modalState === MODAL_STATE.MORE_DETAILS && (
        <Dialog
          open
          keepMounted
          onClose={resetSelection}
          aria-labelledby="detailed-inventory-item"
          scroll="paper"
          TransitionComponent={Transition}
          sx={{
            '& .MuiDialog-container': {
              justifyContent: 'flex-end',
            },
          }}
        >
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              View item details
              <IconButton aria-label="close" onClick={resetSelection} color="error">
                <CloseRounded />
              </IconButton>
            </Stack>
          </DialogTitle>
          <SelectedRowItem selectedRow={selectedRow} columns={Object.values(VIEW_INVENTORY_LIST_HEADERS)} />
        </Dialog>
      )}
      {modalState === MODAL_STATE.ASSIGN_CATEGORY && (
        <SimpleModal title="Assign category" handleClose={handleCloseModal} maxSize="md">
          {/* <AssignCategory rowSelected={rowSelected} handleCloseAssignFn={handleCloseModal} /> */}
        </SimpleModal>
      )}
      {modalState === MODAL_STATE.ASSIGN_MAINTENANCE_PLAN && (
        <SimpleModal
          title="Assign maintenance plan"
          subtitle="Create or add new maintenance plans"
          redirectSubtitle={true}
          subtitleLinkTo="/maintenance"
          handleClose={handleCloseModal}
          maxSize="md"
        >
          {/* <AssignPlan rowSelected={rowSelected} handleCloseAssignFn={handleCloseModal} /> */}
        </SimpleModal>
      )}
      <ConfirmationBoxModal
        openDialog={openDialog}
        title="Confirm deletion"
        text="Confirm deletion of selected item(s) ? Deletion is permanent and cannot be undone."
        textVariant="body2"
        handleClose={reset}
        maxSize="sm"
        deleteID={idToDelete}
        confirmDelete={confirmDelete}
      />
    </Stack>
  );
};

export default InventoryListDetails;
