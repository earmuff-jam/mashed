package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gorilla/mux"
	"github.com/mohit2530/communityCare/config"
	"github.com/mohit2530/communityCare/db"
	"github.com/mohit2530/communityCare/model"
	"github.com/stretchr/testify/assert"
)

func Test_GetAllInventories(t *testing.T) {

	// profile are automatically derieved from the auth table. due to this, we attempt to create a new user
	draftUserCredentials := model.UserCredentials{
		Email:             "test@gmail.com",
		Role:              "TESTER",
		EncryptedPassword: "1231231",
	}

	db.PreloadAllTestVariables()
	prevUser, err := db.RetrieveUser(config.CTO_USER, &draftUserCredentials)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/profile/%s/inventories", prevUser.ID), nil)
	req = mux.SetURLVars(req, map[string]string{"id": prevUser.ID.String()})
	w := httptest.NewRecorder()
	GetAllInventories(w, req, config.CTO_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	assert.Equal(t, 200, res.StatusCode)
	assert.Greater(t, len(data), 0)
}

func Test_GetAllInventories_WrongUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "0802c692-b8e2-4824-a870-e52f4a0cccf8"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	GetAllInventories(w, req, config.CTO_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, 200, res.StatusCode)

	var foundInventories []model.Inventory
	err = json.Unmarshal(data, &foundInventories)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, 0, len(foundInventories)) // empty inventory list
}

func Test_GetAllInventories_NoUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories", nil)
	req = mux.SetURLVars(req, map[string]string{"id": ""})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	GetAllInventories(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_GetAllInventories_IncorrectUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "request"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	GetAllInventories(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_GetAllInventories_InvalidDBUser(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "0802c692-b8e2-4824-a870-e52f4a0cccf8"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	GetAllInventories(w, req, config.CEO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_AddNewInventory(t *testing.T) {

	// profile are automatically derieved from the auth table. due to this, we attempt to create a new user
	draftUserCredentials := model.UserCredentials{
		Email:             "test@gmail.com",
		Role:              "TESTER",
		EncryptedPassword: "1231231",
	}

	db.PreloadAllTestVariables()
	prevUser, err := db.RetrieveUser(config.CTO_USER, &draftUserCredentials)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	draftInventory := model.Inventory{
		Name:           "Alexandro Kitteyy Litter",
		Description:    "Kitty litter for a pro name game",
		Price:          23.99,
		Status:         "HIDDEN",
		Barcode:        "1231231231",
		SKU:            "1231231231",
		Quantity:       12,
		IsReturnable:   true,
		ReturnLocation: "Target",
		MaxWeight:      "12",
		MinWeight:      "120",
		MaxHeight:      "24",
		MinHeight:      "12",
		Location:       "Broom Closet",
		CreatedAt:      time.Now(),
		CreatedBy:      prevUser.ID.String(),
		BoughtAt:       "Walmart",
	}

	// Marshal the draftEvent into JSON bytes
	requestBody, err := json.Marshal(draftInventory)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}

	req := httptest.NewRequest(http.MethodPost, fmt.Sprintf("/api/v1/profile/%s/inventories", draftUserCredentials.ID.String()), bytes.NewBuffer(requestBody))
	req = mux.SetURLVars(req, map[string]string{"id": draftUserCredentials.ID.String()})
	w := httptest.NewRecorder()
	AddNewInventory(w, req, config.CTO_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, 200, res.StatusCode)

	var selectedInventory model.Inventory
	err = json.Unmarshal(data, &selectedInventory)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	assert.Equal(t, "Alexandro Kitteyy Litter", selectedInventory.Name)
	assert.Equal(t, "Broom Closet", selectedInventory.Location)

	// cleanup
	removeInventory := []string{selectedInventory.ID}
	db.DeleteInventory(config.CTO_USER, selectedInventory.ID, removeInventory)
}

func Test_AddNewInventory_WrongUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "0802c692-b8e2-4824-a870-e52f4a0cccf8"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	AddNewInventory(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_AddNewInventory_NoUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories", nil)
	req = mux.SetURLVars(req, map[string]string{"id": ""})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	AddNewInventory(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_AddNewInventory_IncorrectUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "request"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	AddNewInventory(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_AddNewInventory_InvalidDBUser(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "0802c692-b8e2-4824-a870-e52f4a0cccf8"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	AddNewInventory(w, req, config.CEO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_UpdateSelectedInventory(t *testing.T) {
	// profile are automatically derieved from the auth table. due to this, we attempt to create a new user
	draftUserCredentials := model.UserCredentials{
		Email:             "test@gmail.com",
		Role:              "TESTER",
		EncryptedPassword: "1231231",
	}

	db.PreloadAllTestVariables()
	prevUser, err := db.RetrieveUser(config.CTO_USER, &draftUserCredentials)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	draftInventory := model.Inventory{
		Name:        "Alexandro Kitteyy Litter",
		Description: "Kitty litter for a pro name game",
		Price:       23.99,
		Status:      "HIDDEN",
		Barcode:     "1231231231",
		SKU:         "1231231231",
		Quantity:    12,
		Location:    "Broom Closet",
		CreatedAt:   time.Now(),
		CreatedBy:   prevUser.ID.String(),
		BoughtAt:    "Walmart",
	}

	// Marshal the draftEvent into JSON bytes
	requestBody, err := json.Marshal(draftInventory)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}

	req := httptest.NewRequest(http.MethodPost, fmt.Sprintf("/api/v1/profile/%s/inventories", draftUserCredentials.ID.String()), bytes.NewBuffer(requestBody))
	req = mux.SetURLVars(req, map[string]string{"id": draftUserCredentials.ID.String()})
	w := httptest.NewRecorder()
	AddNewInventory(w, req, config.CTO_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, 200, res.StatusCode)

	var selectedInventory model.Inventory
	err = json.Unmarshal(data, &selectedInventory)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	assert.Equal(t, "Alexandro Kitteyy Litter", selectedInventory.Name)
	assert.Equal(t, "Broom Closet", selectedInventory.Location)

	// test to perform update but with consistent storage location name
	// TODO: write another test that checks two different inserts into storage locations as
	// this only tests updating the found name.

	selectedInventory.Name = "Alexandro Kitty Litter"

	// Marshal the draftEvent into JSON bytes
	requestBody, err = json.Marshal(selectedInventory)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}

	req = httptest.NewRequest(http.MethodPut, fmt.Sprintf("/api/v1/profile/%s/inventories", prevUser.ID.String()), bytes.NewBuffer(requestBody))
	req = mux.SetURLVars(req, map[string]string{"id": prevUser.ID.String()})
	w = httptest.NewRecorder()
	UpdateSelectedInventory(w, req, config.CTO_USER)
	res = w.Result()
	defer res.Body.Close()
	data, err = io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, 200, res.StatusCode)

	var updatedInventory model.Inventory
	err = json.Unmarshal(data, &updatedInventory)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	assert.Equal(t, "Alexandro Kitty Litter", updatedInventory.Name)
	assert.Equal(t, "Broom Closet", updatedInventory.Location)

	// cleanup fn
	removeInventory := []string{selectedInventory.ID}
	db.DeleteInventory(config.CTO_USER, selectedInventory.ID, removeInventory)
}

func Test_UpdateSelectedInventory_WrongUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "0802c692-b8e2-4824-a870-e52f4a0cccf8"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	UpdateSelectedInventory(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_UpdateSelectedInventory_NoUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories", nil)
	req = mux.SetURLVars(req, map[string]string{"id": ""})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	UpdateSelectedInventory(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_UpdateSelectedInventory_IncorrectUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "request"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	UpdateSelectedInventory(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_UpdateSelectedInventory_InvalidDBUser(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "0802c692-b8e2-4824-a870-e52f4a0cccf8"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	UpdateSelectedInventory(w, req, config.CEO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_RemoveSelectedInventory(t *testing.T) {
	// profile are automatically derieved from the auth table. due to this, we attempt to create a new user
	draftUserCredentials := model.UserCredentials{
		Email:             "test@gmail.com",
		Role:              "TESTER",
		EncryptedPassword: "1231231",
	}

	db.PreloadAllTestVariables()
	prevUser, err := db.RetrieveUser(config.CTO_USER, &draftUserCredentials)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	draftInventory := model.Inventory{
		Name:        "Alexandro Kitteyy Litter",
		Description: "Kitty litter for a pro name game",
		Price:       23.99,
		Status:      "HIDDEN",
		Barcode:     "1231231231",
		SKU:         "1231231231",
		Quantity:    12,
		Location:    "Broom Closet",
		CreatedAt:   time.Now(),
		CreatedBy:   prevUser.ID.String(),
		BoughtAt:    "Walmart",
	}

	// Marshal the draftEvent into JSON bytes
	requestBody, err := json.Marshal(draftInventory)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}

	req := httptest.NewRequest(http.MethodPost, fmt.Sprintf("/api/v1/profile/%s/inventories", draftUserCredentials.ID.String()), bytes.NewBuffer(requestBody))
	req = mux.SetURLVars(req, map[string]string{"id": draftUserCredentials.ID.String()})
	w := httptest.NewRecorder()
	AddNewInventory(w, req, config.CTO_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, 200, res.StatusCode)

	var selectedInventory model.Inventory
	err = json.Unmarshal(data, &selectedInventory)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	assert.Equal(t, "Alexandro Kitteyy Litter", selectedInventory.Name)
	assert.Equal(t, "Broom Closet", selectedInventory.Location)

	removeInventory := map[string]string{"0": selectedInventory.ID}

	// Marshal the draftEvent into JSON bytes
	requestBody, err = json.Marshal(removeInventory)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}

	req = httptest.NewRequest(http.MethodPost, fmt.Sprintf("/api/v1/profile/%s/inventories/prune", draftUserCredentials.ID.String()), bytes.NewBuffer(requestBody))
	req = mux.SetURLVars(req, map[string]string{"id": draftUserCredentials.ID.String()})
	w = httptest.NewRecorder()
	RemoveSelectedInventory(w, req, config.CTO_USER)
	res = w.Result()
	defer res.Body.Close()

	assert.Equal(t, 200, res.StatusCode)
}

func Test_RemoveSelectedInventory_WrongUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories/prune", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "0802c692-b8e2-4824-a870-e52f4a0cccf8"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	RemoveSelectedInventory(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_RemoveSelectedInventory_NoUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories/prune", nil)
	req = mux.SetURLVars(req, map[string]string{"id": ""})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	RemoveSelectedInventory(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_RemoveSelectedInventory_IncorrectUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories/prune", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "request"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	RemoveSelectedInventory(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_RemoveSelectedInventory_InvalidDBUser(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/v1/profile/0802c692-b8e2-4824-a870-e52f4a0cccf8/inventories/prune", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "0802c692-b8e2-4824-a870-e52f4a0cccf8"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	RemoveSelectedInventory(w, req, config.CEO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}
