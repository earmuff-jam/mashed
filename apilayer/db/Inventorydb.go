package db

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/mohit2530/communityCare/model"
)

// RetrieveAllInventoriesForUser ...
func RetrieveAllInventoriesForUser(user string, userID string) ([]model.Inventory, error) {

	db, err := SetupDB(user)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	sqlStr := `SELECT
    inv.id,
    inv.name,
    inv.description,
    inv.price,
    inv.status,
    inv.barcode,
    inv.sku,
    inv.quantity,
	inv.bought_at,
    inv.location,
    inv.storage_location_id,
    inv.created_by,
    COALESCE(cp.username, cp.full_name, cp.email_address) AS creator_name,
    inv.created_at,
    inv.updated_by,
    COALESCE(up.username, up.full_name, up.email_address) AS updater_name,
    inv.updated_at
FROM
    community.inventory inv
LEFT JOIN community.profiles cp ON inv.created_by = cp.id
LEFT JOIN community.profiles up ON inv.updated_by = up.id
WHERE
   inv.created_by = $1
ORDER BY
   inv.updated_at  DESC;
	`
	rows, err := db.Query(sqlStr, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var data []model.Inventory

	for rows.Next() {
		var inventory model.Inventory

		if err := rows.Scan(
			&inventory.ID,
			&inventory.Name,
			&inventory.Description,
			&inventory.Price,
			&inventory.Status,
			&inventory.Barcode,
			&inventory.SKU,
			&inventory.Quantity,
			&inventory.BoughtAt,
			&inventory.Location,
			&inventory.StorageLocationID,
			&inventory.CreatedBy,
			&inventory.CreatorName,
			&inventory.CreatedAt,
			&inventory.UpdatedBy,
			&inventory.UpdaterName,
			&inventory.UpdatedAt,
		); err != nil {
			return nil, err
		}
		data = append(data, inventory)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	if len(data) == 0 {
		// empty array to factor in for null
		return make([]model.Inventory, 0), nil
	}
	return data, nil
}

// AddInventory ...
func AddInventory(user string, userID string, draftInventory model.Inventory) (*model.Inventory, error) {

	db, err := SetupDB(user)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	tx, err := db.Begin()
	if err != nil {
		return nil, err
	}

	// storage location is unique key in the database.
	// storage location can be shared across inventories and items that are stored in events.
	parsedStorageLocationID, err := uuid.Parse(draftInventory.Location)
	if err != nil {
		// if the location is not a uuid type, then it should resemble a new storage location
		emptyLocationID := ""
		err := addNewStorageLocation(user, draftInventory.Location, draftInventory.CreatedBy, &emptyLocationID)
		if err != nil {
			tx.Rollback()
			return nil, err
		}
		parsedStorageLocationID, err = uuid.Parse(emptyLocationID)
		if err != nil {
			tx.Rollback()
			return nil, err
		}
		draftInventory.StorageLocationID = emptyLocationID
	}

	parsedCreatedByUUID, err := uuid.Parse(draftInventory.CreatedBy)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	sqlStr := `INSERT INTO community.inventory
	(name, description, price, status, barcode, sku, quantity, bought_at, location, storage_location_id, created_by, created_at, updated_by, updated_at)
    VALUES
	($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
	RETURNING id`

	err = tx.QueryRow(
		sqlStr,
		draftInventory.Name,
		draftInventory.Description,
		draftInventory.Price,
		draftInventory.Status,
		draftInventory.Barcode,
		draftInventory.SKU,
		draftInventory.Quantity,
		draftInventory.BoughtAt,
		draftInventory.Location,
		parsedStorageLocationID,
		parsedCreatedByUUID,
		time.Now(),
		parsedCreatedByUUID, // created is the same for the first time
		time.Now(),
	).Scan(&draftInventory.ID)

	if err != nil {
		// Rollback the transaction if there is an error
		tx.Rollback()
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &draftInventory, nil
}

// UpdateInventory ...
func UpdateInventory(user string, userID string, draftInventory model.InventoryItemToUpdate) (*model.Inventory, error) {

	db, err := SetupDB(user)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	tx, err := db.Begin()
	if err != nil {
		return nil, err
	}

	parsedInventoryID, err := uuid.Parse(draftInventory.ID)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	parsedUserID, err := uuid.Parse(draftInventory.UserID)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	columnToUpdate := draftInventory.Column

	sqlStr := `
        UPDATE community.inventory
        SET ` + columnToUpdate + ` = $1,
            updated_by = $2,
            updated_at = now()
        WHERE id = $3
        RETURNING id`

	var updatedInventoryID uuid.UUID
	err = tx.QueryRow(sqlStr, draftInventory.Value, parsedUserID, parsedInventoryID).Scan(&updatedInventoryID)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		tx.Rollback()
		return nil, errors.New("commit failed: " + err.Error())
	}

	// new tx to bring fresh values
	tx, err = db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	sqlGetUpdatedInventory := `
	SELECT
		inv.id,
		inv.name,
		inv.description,
		inv.price,
		inv.status,
		inv.barcode,
		inv.sku,
		inv.quantity,
		inv.bought_at,
		inv.location,
		inv.storage_location_id,
		inv.created_at,
		inv.created_by,
		coalesce (cp.full_name, cp.username, cp.email_address) as creator_name,
		inv.updated_at,
		inv.updated_by,
		coalesce (up.full_name, up.username, up.email_address)  as updater_name
	FROM
		community.inventory inv
	LEFT JOIN community.storage_locations sl on sl.id = inv.storage_location_id 
	LEFT JOIN community.profiles cp on cp.id  = inv.created_by
	LEFT JOIN community.profiles up on up.id  = inv.updated_by
	WHERE inv.id = $1
`

	row := tx.QueryRow(sqlGetUpdatedInventory, updatedInventoryID)

	updatedInventory := model.Inventory{}
	err = row.Scan(
		&updatedInventory.ID,
		&updatedInventory.Name,
		&updatedInventory.Description,
		&updatedInventory.Price,
		&updatedInventory.Status,
		&updatedInventory.Barcode,
		&updatedInventory.SKU,
		&updatedInventory.Quantity,
		&updatedInventory.BoughtAt,
		&updatedInventory.Location,
		&updatedInventory.StorageLocationID,
		&updatedInventory.CreatedAt,
		&updatedInventory.CreatedBy,
		&updatedInventory.CreatorName,
		&updatedInventory.UpdatedAt,
		&updatedInventory.UpdatedBy,
		&updatedInventory.UpdaterName,
	)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	// Commit the transaction
	if err := tx.Commit(); err != nil {
		return nil, err
	}

	// Return the updated inventory object
	return &updatedInventory, nil
}

// DeleteInventory ...
func DeleteInventory(user string, userID string, draftInventory model.Inventory) (*model.Inventory, error) {

	db, err := SetupDB(user)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	tx, err := db.Begin()
	if err != nil {
		return nil, err
	}

	// storage location is unique key in the database.
	// storage location can be shared across inventories and items that are stored in events.
	parsedStorageLocationID, err := uuid.Parse(draftInventory.Location)
	if err != nil {
		// if the location is not a uuid type, then it should resemble a new storage location
		emptyLocationID := ""
		err := addNewStorageLocation(user, draftInventory.Location, draftInventory.CreatedBy, &emptyLocationID)
		if err != nil {
			tx.Rollback()
			return nil, err
		}
		parsedStorageLocationID, err = uuid.Parse(emptyLocationID)
		if err != nil {
			tx.Rollback()
			return nil, err
		}
		draftInventory.StorageLocationID = emptyLocationID
	}

	parsedCreatedByUUID, err := uuid.Parse(draftInventory.CreatedBy)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	sqlStr := `INSERT INTO community.inventory
	(name, description, price, status, barcode, sku, quantity, boughtAt, location, storage_location_id, created_by, created_at, updated_by, updated_at)
    VALUES
	($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
	RETURNING id`

	err = tx.QueryRow(
		sqlStr,
		draftInventory.Name,
		draftInventory.Description,
		draftInventory.Price,
		draftInventory.Status,
		draftInventory.Barcode,
		draftInventory.SKU,
		draftInventory.Quantity,
		draftInventory.BoughtAt,
		draftInventory.Location,
		parsedStorageLocationID,
		parsedCreatedByUUID,
		time.Now(),
		parsedCreatedByUUID, // created is the same for the first time
		time.Now(),
	).Scan(&draftInventory.ID)

	if err != nil {
		// Rollback the transaction if there is an error
		tx.Rollback()
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &draftInventory, nil
}
