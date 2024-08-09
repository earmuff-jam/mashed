import { useEffect, useState } from 'react';
import InventoryListDetails from './InventoryListDetails';
import { useDispatch } from 'react-redux';
import { inventoryActions } from './inventorySlice';
import { RetrieveClientLocation } from '../common/utils';

export default function InventoryList() {
  const dispatch = useDispatch();
  const [location, setLocation] = useState({ lat: 0, long: 0 });

  console.debug(location); // todo remove this later

  useEffect(() => {
    dispatch(inventoryActions.getAllInventoriesForUser());
    const clientLocationCoordinates = RetrieveClientLocation();
    setLocation(clientLocationCoordinates);
  }, []);

  return <InventoryListDetails />;
}
