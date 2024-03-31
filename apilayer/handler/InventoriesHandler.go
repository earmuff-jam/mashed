package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/mohit2530/communityCare/db"
	"github.com/mohit2530/communityCare/model"
)

// GetAllInventories ...
// swagger:route GET /api/v1/profile/{id}/inventories
//
// # Retrieves the list of items that the user has.
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

// AddNewInventory ...
// swagger:route POST /api/profile/{id}/inventories AddNewInventory addNewInventory
//
// # Add new personal item to the user inventory
//
// Parameters:
//   - +name: id
//     in: path
//     description: The id of the selected note
//     type: string
//     required: true
//   - +name: Inventory
//     in: query
//     description: The inventory object to add into the db
//     type: object
//     required: true
//
// Responses:
// 200: MessageResponse
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