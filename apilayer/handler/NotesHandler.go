package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/mohit2530/communityCare/db"
	"github.com/mohit2530/communityCare/model"
)

// GetUserNotesDetails ...
// swagger:route GET /api/profile/notes/{id} GetUserNotesDetails getUserNotesDetails
//
// # Retrieves the list of notes for the user.
//
// Parameters:
//   - +name: id
//     in: path
//     description: The userID of the selected user
//     type: string
//     required: true
//
// Responses:
// 200: []Notes
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func GetUserNotesDetails(rw http.ResponseWriter, r *http.Request, user string) {
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

	resp, err := db.RetrieveUserNotes(user, parsedUUID)
	if err != nil {
		log.Printf("Unable to retrieve notes. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// AddNewNote ...
// swagger:route POST /api/profile/notes/{id} AddNewNote addNewNote
//
// # Add a new note to the database
//
// Parameters:
//   - +name: id
//     in: path
//     description: The id of the selected note
//     type: string
//     required: true
//   - +name: Note
//     in: query
//     description: The note object to add into the db
//     type: object
//     required: true
//
// Responses:
// 200: MessageResponse
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func AddNewNote(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	userID := vars["id"]

	if len(userID) <= 0 {
		log.Printf("Unable to update notes with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	var note model.Note
	if err := json.NewDecoder(r.Body).Decode(&note); err != nil {
		log.Printf("Error decoding data. error: %+v", err)
		rw.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := db.AddNewNote(user, userID, note)
	if err != nil {
		log.Printf("Unable to add new note. error: +%v", err)
		rw.WriteHeader(http.StatusInternalServerError)
		return
	}

	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// UpdateNote ...
// swagger:route PUT /api/profile/notes/{id} UpdateNote updateNote
//
// # Updates an existing note in the database
//
// Parameters:
//   - +name: id
//     in: path
//     description: The id of the selected note
//     type: string
//     required: true
//   - +name: Note
//     in: query
//     description: The note object to update into the db
//     type: object
//     required: true
//
// Responses:
// 200: MessageResponse
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func UpdateNote(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	userID := vars["id"]

	if len(userID) <= 0 {
		log.Printf("Unable to update notes with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	var note model.Note
	if err := json.NewDecoder(r.Body).Decode(&note); err != nil {
		log.Printf("Error decoding data. error: %+v", err)
		rw.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := db.UpdateSelectedNote(user, userID, note)
	if err != nil {
		log.Printf("Unable to update notes. error: +%v", err)
		rw.WriteHeader(http.StatusInternalServerError)
		return
	}

	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// RemoveSelectedNote ...
// swagger:route DELETE /api/profile/notes/{id} RemoveSelectedNote removeSelectedNote
//
// # Removes the note from the db
//
// Parameters:
//   - +name: id
//     in: path
//     description: The id of the selected note
//     type: string
//     required: true
//
// Responses:
// 200: MessageResponse
// 400: MessageResponse
// 404: MessageResponse
// 500: MessageResponse
func RemoveSelectedNote(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	noteID := vars["id"]

	if len(noteID) <= 0 {
		log.Printf("Unable to update notes with empty noteID")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	var note model.Note
	note.ID = noteID

	if len(note.ID) <= 0 {
		log.Printf("Unable to update notes with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	err := db.RemoveSelectedNote(user, note.ID)
	if err != nil {
		log.Printf("Unable to remove notes. error: +%v", err)
		rw.WriteHeader(http.StatusInternalServerError)
		return
	}

	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(note.ID)
}
