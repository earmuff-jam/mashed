package handler

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/mohit2530/communityCare/db"
	"github.com/mohit2530/communityCare/model"
)

// GetProfileHealthCheck ...
// swagger:route GET /api/v1/health GetProfileHealthCheck getProfileHealthCheck
//
// # Health Check
//
// Health Check to test if the application api layer is operational or not. This api functionality
// does not attempt to connect with the backend service. It is designed to support heartbeat support system.
//
// Responses:
// 200: MessageResponse
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func GetProfileHealthCheck(rw http.ResponseWriter, r *http.Request, user string) {
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode("Health check concluded. Status shows all services are operational.")
}

// GetProfile ...
// swagger:route GET /api/v1/profile/{id} GetProfile getProfile
//
// # Retrieves the user details from the profiles table. Does not meddle with authentication
//
// Parameters:
//   - ++name: id
//     in: path
//     description: The id of the user
//     type: string
//     required: true
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

// GetUsername ...
// swagger:route GET /api/v1/profile/{id} GetUsername getUsername
//
// # Retrieves the user name from the profiles table. Does not meddle with authentication
//
// Parameters:
//   - +name: id
//     in: path
//     description: The id of the user
//     type: string
//     required: true
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
		log.Printf("Unable to retrieve profile details. error: +%v", err)
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
// swagger:route PUT /api/v1/profile UpdateProfile updateProfile
//
// # Updates the current user profile for the selected user. Does not meddle with authentication
//
// Parameters:
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
		log.Printf("Unable to retrieve profile with empty id")
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
// swagger:route POST /api/v1/profile/{id}/updateAvatar UpdateProfileAvatar updateProfileAvatar
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
//     type: FileHeader
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
		log.Printf("Unable to retrieve profile with empty id")
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

// GetUserRecentActivities ...
// swagger:route GET /api/profile/recent/{id} GetUserRecentActivities getUserRecentActivities
//
// # Retrieves the list of recent activities the user has commenced. The api is responsible for
// create / update event, create / update volunteering, create / update expense report.
//
// Parameters:
//   - +name: id
//     in: path
//     description: The userID of the selected user
//     type: string
//     required: true
//
// Responses:
// 200: []RecentActivity
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func GetUserRecentActivities(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	id, ok := vars["id"]
	if !ok || len(id) <= 0 {
		log.Printf("Unable to retrieve details without an id. ")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	parsedUUID, err := uuid.Parse(id)
	if err != nil {
		log.Printf("Unable to retrieve details with provided id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	resp, err := db.RetrieveRecentActivity(user, parsedUUID)
	if err != nil {
		log.Printf("Unable to retrieve recent activities. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// GetUserRecentHighlights ...
// swagger:route GET /api/profile/highlights/{id} GetUserRecentHighlights getUserRecentHighlights
//
// # Retrieves the list of highlights for the user. The highlights includes created, reported, volunteered events
//
// Parameters:
//   - +name: id
//     in: path
//     description: The userID of the selected user
//     type: string
//     required: true
//
// Responses:
// 200: RecentHighlight
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func GetUserRecentHighlights(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	id, ok := vars["id"]
	if !ok || len(id) <= 0 {
		log.Printf("Unable to retrieve details without an id. ")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	parsedUUID, err := uuid.Parse(id)
	if err != nil {
		log.Printf("Unable to retrieve details with provided id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	resp, err := db.RetrieveUserActivityHighlights(user, parsedUUID)
	if err != nil {
		log.Printf("Unable to retrieve recent highlights. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}
