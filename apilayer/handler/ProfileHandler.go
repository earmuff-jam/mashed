package handler

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/mohit2530/communityCare/db"
	"github.com/mohit2530/communityCare/model"
)

// GetAllUserProfiles ...
// swagger:route GET /api/v1/profile/list Profiles getAllUserProfiles
//
// # Retrieves all the user profiles listed in the database
//
// Responses:
// 200: []Profile
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func GetAllUserProfiles(rw http.ResponseWriter, r *http.Request, user string) {

	resp, err := db.FetchAllUserProfiles(user)
	if err != nil {
		log.Printf("Unable to retrieve all profile details. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return

	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// GetProfile ...
// swagger:route GET /api/v1/profile/{id} Profiles getProfile
//
// # Retrieves the user details from the profiles table. Does not meddle with authentication
//
// Parameters:
//   - +name: id
//     in: path
//     description: The userID of the selected user
//     required: true
//     type: string
//
// Responses:
// 200: Profile
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func GetProfile(rw http.ResponseWriter, r *http.Request, user string) {

	vars := mux.Vars(r)
	userID := vars["id"]

	if len(userID) <= 0 {
		log.Printf("Unable to retrieve profile with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	resp, err := db.FetchUserProfile(user, userID)
	if err != nil {
		log.Printf("Unable to retrieve profile details. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return

	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// GetFavouriteItems ...
// swagger:route GET /api/v1/profile/{id}/fav Profiles getFavouriteItems
//
// # Retrieves the items marked as favourite by the selected user.
//
// Parameters:
//   - +name: id
//     in: path
//     description: The userID of the selected user
//     required: true
//     type: string
//   - +name: limit
//     in: query
//     description: The limit of items to return. If not passed in defaults to 1000
//     required: false
//     type: integer
//     format: int32
//
// Responses:
// 200: []FavouriteItem
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func GetFavouriteItems(rw http.ResponseWriter, r *http.Request, user string) {

	vars := mux.Vars(r)
	userID := vars["id"]
	limit := r.URL.Query().Get("limit")

	limitInt, err := strconv.Atoi(limit)
	if err != nil {
		limitInt = 1000
	}

	if len(userID) <= 0 {
		log.Printf("Unable to retrieve favourite items with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	resp, err := db.FetchFavouriteItems(user, userID, limitInt)
	if err != nil {
		log.Printf("Unable to retrieve favourite items. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return

	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// SaveFavItem ...
// swagger:route POST /api/v1/profile/{id}/fav Profiles saveFavItem
//
// # Creates a new favourite item for the selected user
//
// Parameters:
//   - +name: id
//     in: path
//     description: The userID of the selected user
//     required: true
//     type: string
//   - +name: FavouriteItem
//     in: body
//     description: The object that is marked favourite by the user
//     type: FavouriteItem
//     required: true
//
// Responses:
// 200: []FavouriteItem
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func SaveFavItem(rw http.ResponseWriter, r *http.Request, user string) {

	vars := mux.Vars(r)
	userID := vars["id"]

	if len(userID) <= 0 {
		log.Printf("Unable to save favourite item with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	var favItem model.FavouriteItem
	if err := json.NewDecoder(r.Body).Decode(&favItem); err != nil {
		log.Printf("Error decoding data. error: %+v", err)
		rw.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := db.SaveFavouriteItem(user, userID, favItem)
	if err != nil {
		log.Printf("Unable to save favourite item. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return

	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// RemoveFavItem ...
// swagger:route DELETE /api/v1/profile/{id}/fav Profiles removeFavItem
//
// # Deletes the item that is marked as favourite by the user
//
// Parameters:
//   - +name: id
//     in: path
//     description: The userID of the selected user
//     required: true
//     type: string
//   - +name: itemID
//     in: query
//     description: The itemID to remove from the db
//     required: true
//     type: string
//
// Responses:
// 200: MessageResponse
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func RemoveFavItem(rw http.ResponseWriter, r *http.Request, user string) {

	vars := mux.Vars(r)
	userID := vars["id"]
	itemID := r.URL.Query().Get("itemID")

	if len(userID) <= 0 {
		log.Printf("Unable to delete favourite item with empty user id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	if len(itemID) <= 0 {
		log.Printf("Unable to delete favourite item with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	resp, err := db.RemoveFavItem(user, userID, itemID)
	if err != nil {
		log.Printf("Unable to remove favourite item. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return

	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// GetUsername ...
// swagger:route GET /api/v1/profile/{id} Profiles getUsername
//
// # Retrieves the user name from the profiles table. Does not meddle with authentication
//
// Parameters:
//   - +name: id
//     in: path
//     description: The userID of the selected user
//     required: true
//     type: string
//
// Responses:
// 200: MessageResponse
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func GetUsername(rw http.ResponseWriter, r *http.Request, user string) {

	vars := mux.Vars(r)
	userID := vars["id"]

	if len(userID) <= 0 {
		log.Printf("Unable to retrieve username with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	resp, err := db.FetchUserProfile(user, userID)
	if err != nil {
		log.Printf("Unable to retrieve user profile. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return

	}

	// only send username as response
	username := resp.Username

	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(username)
}

// UpdateProfile ...
// swagger:route PUT /api/v1/profile Profiles updateProfile
//
// # Updates the current user profile for the selected user. Does not meddle with authentication
//
// Parameters:
//   - +name: id
//     in: query
//     description: The userID of the selected user
//     required: true
//     type: string
//   - +name: Profile
//     in: body
//     description: The full profile object of the user
//     type: Profile
//     required: true
//
// Responses:
// 200: Profile
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func UpdateProfile(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	userID := vars["id"]

	if len(userID) <= 0 {
		log.Printf("Unable to update profile with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	var updatedProfile model.Profile
	if err := json.NewDecoder(r.Body).Decode(&updatedProfile); err != nil {
		log.Printf("Error decoding data. error: %+v", err)
		rw.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := db.UpdateUserProfile(user, userID, updatedProfile)
	if err != nil {
		log.Printf("Unable to update profile details. error: +%v", err)
		rw.WriteHeader(http.StatusInternalServerError)
		return
	}

	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// UpdateProfileAvatar ...
// swagger:route POST /api/v1/profile/{id}/updateAvatar Profiles updateProfileAvatar
//
// # Updates the current user avatar for the selected user. Does not meddle with authentication
//
// Parameters:
//   - +name: id
//     in: path
//     description: The userID of the selected user
//     type: string
//     required: true
//   - +name: FileHeader
//     in: body
//     description: The full file details of the avatar
//     type: string
//     format: byte
//     required: true
//
// Responses:
// 200: Profile
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func UpdateProfileAvatar(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	userID := vars["id"]
	if len(userID) <= 0 {
		log.Printf("Unable to update profile avatar with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	err := r.ParseMultipartForm(10 << 20) // 10 MB max
	if err != nil {
		log.Printf("Unable to parse form file. error  %+v", err)
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("avatarSrc")
	if err != nil {
		log.Printf("Unable to form file properly. error  %+v", err)
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Read file data into a buffer
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}

	resp, err := db.UpdateProfileAvatar(user, userID, header, fileBytes)
	if err != nil {
		log.Printf("Unable to update profile avatar. error: +%v", err)
		rw.WriteHeader(http.StatusInternalServerError)
		return
	}

	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}
