package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/mohit2530/communityCare/db"
	"github.com/mohit2530/communityCare/model"
)

const defaultHiddenStatus = "HIDDEN"

// GetAllInventories ...
// swagger:route GET /api/v1/profile/{id}/inventories
//
// # Retrieves the list of inventories that the user has.
//
// Responses:
// 200: []Inventory
// 400: Message
// 404: Message
// 500: Message
func GetAllInventories(rw http.ResponseWriter, r *http.Request, user string) {

	vars := mux.Vars(r)
	userID := vars["id"]

	if len(userID) <= 0 {
		log.Printf("Unable to retrieve inventories with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	resp, err := db.RetrieveAllInventoriesForUser(user, userID)
	if err != nil {
		log.Printf("Unable to retrieve all existing inventories. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// GetInventoryByID ...
// swagger:route GET /api/v1/profile/{id}/inventories/{invID}
//
// # Retrieves the selected inventory that matches the id. must be created by the user
//
// Responses:
// 200: Inventory
// 400: Message
// 404: Message
// 500: Message
func GetInventoryByID(rw http.ResponseWriter, r *http.Request, user string) {

	vars := mux.Vars(r)
	userID := vars["id"]
	invID := vars["invID"]

	if len(userID) <= 0 {
		log.Printf("Unable to retrieve inventories with empty profile id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}
	if len(invID) <= 0 {
		log.Printf("Unable to retrieve inventories with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	resp, err := db.RetrieveSelectedInv(user, userID, invID)
	if err != nil {
		log.Printf("Unable to retrieve inventory with selected id. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}

	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// AddInventoryInBulk ...
// swagger:route POST /api/profile/{id}/inventories/bulk AddInventoryInBulk addInventoryInBulk
//
// # Bulk upload inventory list. returns the list of uploaded items.
//
// Parameters:
//   - +name: id
//     in: path
//     description: The id of the selected inventory
//     type: string
//     required: true
//   - +name: InventoryListRequest
//     in: query
//     description: The list of inventories to add into the db to support bulk upload
//     type: object
//     required: true
//
// Responses:
//
// 200: []model.Inventory
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func AddInventoryInBulk(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	userID := vars["id"]

	if len(userID) <= 0 {
		log.Printf("Unable to add new item with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	var inventoryMap map[string]model.RawInventory
	if err := json.NewDecoder(r.Body).Decode(&inventoryMap); err != nil {
		log.Printf("Error decoding data. error: %+v", err)
		rw.WriteHeader(http.StatusBadRequest)
		return
	}

	var inventoryList []model.Inventory
	for _, v := range inventoryMap {

		formattedQuantity, err := strconv.Atoi(v.Quantity)
		if err != nil {
			formattedQuantity = 0
		}

		formattedPrice, err := strconv.ParseFloat(v.Price, 64)
		if err != nil {
			formattedPrice = 0.00
		}
		draftInventory := model.Inventory{
			Name:        v.Name,
			Description: v.Description,
			Price:       formattedPrice,
			Status:      defaultHiddenStatus,
			Barcode:     v.Barcode,
			SKU:         v.SKU,
			Quantity:    formattedQuantity,
			Location:    v.Location,
			CreatedAt:   time.Now(),
			CreatedBy:   userID,
			UpdatedAt:   time.Now(),
			UpdatedBy:   userID,
			BoughtAt:    v.BoughtAt,
		}
		inventoryList = append(inventoryList, draftInventory)
	}

	inventoryListRequest := model.InventoryListRequest{
		InventoryList: inventoryList,
		CreatedBy:     userID,
		CreatedAt:     time.Now(),
	}

	// Assuming db.AddInventoryInBulk returns an error
	resp, err := db.AddInventoryInBulk(user, userID, inventoryListRequest)
	if err != nil {
		log.Printf("unable to add new item during bulk insert. error: %+v", err)
		rw.WriteHeader(http.StatusInternalServerError)
		return
	}

	rw.Header().Set("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// AddNewInventory ...
// swagger:route POST /api/profile/{id}/inventories AddNewInventory addNewInventory
//
// # Add new personal item to the user inventory
//
// Parameters:
//   - +name: id
//     in: path
//     description: The id of the selected user
//     type: string
//     required: true
//   - +name: Inventory
//     in: query
//     description: The inventory object to add into the db
//     type: object
//     required: true
//
// Responses:
// 200: Inventory
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func AddNewInventory(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	userID := vars["id"]

	if len(userID) <= 0 {
		log.Printf("Unable to add new item with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	var inventory model.Inventory
	if err := json.NewDecoder(r.Body).Decode(&inventory); err != nil {
		log.Printf("Error decoding data. error: %+v", err)
		rw.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := db.AddInventory(user, userID, inventory)
	if err != nil {
		log.Printf("Unable to add new item. error: +%v", err)
		rw.WriteHeader(http.StatusInternalServerError)
		return
	}

	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// UpdateSelectedInventory ...
// swagger:route PUT /api/profile/{id}/inventories UpdateSelectedInventory updateSelectedInventory
//
// # Update selected inventory with details.
//
// Parameters:
//   - +name: id
//     in: path
//     description: The id of the selected user
//     type: string
//     required: true
//   - +name: Inventory
//     in: query
//     description: The inventory object to add into the db
//     type: object
//     required: true
//
// Responses:
// 200: Inventory
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func UpdateSelectedInventory(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	userID := vars["id"]

	if len(userID) <= 0 {
		log.Printf("Unable to update selected inventory without id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	var inventory model.Inventory
	if err := json.NewDecoder(r.Body).Decode(&inventory); err != nil {
		log.Printf("Error decoding data. error: %+v", err)
		rw.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := db.UpdateInventory(user, userID, inventory)
	if err != nil {
		log.Printf("Unable to update selected inventory. error: +%v", err)
		rw.WriteHeader(http.StatusInternalServerError)
		return
	}

	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// RemoveSelectedInventory ...
// swagger:route POST /api/profile/{id}/inventories RemoveSelectedInventory removeSelectedInventory
//
// # Update selected inventory with details.
//
// Parameters:
//   - +name: id
//     in: path
//     description: The id of the selected user
//     type: string
//     required: true
//   - +name: Inventory
//     in: query
//     description: The inventory object to remove from the db
//     type: object
//     required: true
//
// Responses:
// 200: MessageResponse
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func RemoveSelectedInventory(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	userID := vars["id"]

	if len(userID) <= 0 {
		log.Printf("Unable to remove selected inventory without id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	var pruneInventoriesIDMap map[string]string
	if err := json.NewDecoder(r.Body).Decode(&pruneInventoriesIDMap); err != nil {
		log.Printf("Error decoding data. error: %+v", err)
		rw.WriteHeader(http.StatusBadRequest)
		return
	}

	var pruneInventoriesIDs []string
	for _, v := range pruneInventoriesIDMap {
		pruneInventoriesIDs = append(pruneInventoriesIDs, v)
	}

	resp, err := db.DeleteInventory(user, userID, pruneInventoriesIDs)
	if err != nil {
		log.Printf("Unable to remove selected inventory. error: +%v", err)
		rw.WriteHeader(http.StatusInternalServerError)
		return
	}

	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}
