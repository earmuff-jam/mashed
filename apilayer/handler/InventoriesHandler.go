package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/mohit2530/communityCare/db"
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
