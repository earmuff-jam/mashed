package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/mohit2530/communityCare/db"
	"github.com/mohit2530/communityCare/model"
)

// Signup ...
// swagger:route POST /api/v1/signup
//
// # Sign up users into the database system.
//
// Parameters:
//   - name: email
//     in: query
//     description: The email address of the current user
//     type: string
//     required: true
//   - name: password
//     in: query
//     description: The password of the current user
//     type: string
//     required: true
//
// Responses:
// 200: User
// 400: Message
// 404: Message
// 500: Message
func Signup(rw http.ResponseWriter, r *http.Request) {

	draftUser := &model.UserCredentials{}
	err := json.NewDecoder(r.Body).Decode(draftUser)
	r.Body.Close()
	if err != nil {
		log.Printf("Unable to decode request parameters. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	if len(draftUser.Email) <= 0 || len(draftUser.EncryptedPassword) <= 0 {
		log.Printf("Unable to decode user. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}

	if len(draftUser.Role) <= 0 {
		draftUser.Role = "USER"
	}

	backendClientUsr := os.Getenv("CLIENT_USER")
	if len(backendClientUsr) == 0 {
		log.Printf("unable to retrieve user from env. Unable to sign in. Error - %+v", err)
	}
	resp, err := db.SaveUser(backendClientUsr, draftUser) // the authority to log into backend as a certain user
	if err != nil {
		log.Printf("Unable to create new user. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// Signin ...
// swagger:route POST /api/v1/signin
//
// # Sign in users into the database system.
//
// Parameters:
//   - name: email
//     in: query
//     description: The email address of the current user
//     type: string
//     required: true
//   - name: password
//     in: query
//     description: The password of the current user
//     type: string
//     required: true
//
// Responses:
// 200: User
// 400: Message
// 404: Message
// 500: Message
func Signin(rw http.ResponseWriter, r *http.Request) {

	draftUser := &model.UserCredentials{}
	err := json.NewDecoder(r.Body).Decode(draftUser)
	r.Body.Close()
	if err != nil {
		log.Printf("Unable to decode request parameters. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	if len(draftUser.Email) <= 0 || len(draftUser.EncryptedPassword) <= 0 {
		log.Printf("Unable to decode user. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}

	draftUser.UserAgent = r.UserAgent()
	user := os.Getenv("CLIENT_USER")
	if len(user) == 0 {
		log.Printf("unable to retrieve user from env. Unable to sign in. Error - %+v", err)
	}
	resp, err := db.RetrieveUser(user, draftUser)
	if err != nil {
		log.Printf("Unable to sign user in. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}

	rw.Header().Add("Authorization2", draftUser.PreBuiltToken)
	rw.Header().Add("Role2", draftUser.Role)
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp.ID)
}

// Logout ...
// swagger:route POST /api/v1/logout
//
// # Logs users out of the database system.
//
// Responses:
// 200: nil
// 400: Message
// 404: Message
// 500: Message
func Logout(rw http.ResponseWriter, r *http.Request) {

	// immediately clear the token cookie
	http.SetCookie(rw, &http.Cookie{
		Name:     "token",
		Expires:  time.Now(),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})

	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(nil)
}
