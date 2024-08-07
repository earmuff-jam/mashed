package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
	"github.com/mohit2530/communityCare/config"
	"github.com/mohit2530/communityCare/db"
	"github.com/mohit2530/communityCare/model"
	"github.com/stretchr/testify/assert"
)

func Test_GetAllCategories(t *testing.T) {

	// retrieve the selected profile
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

	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/categories?id=%s&limit=%d", prevUser.ID.String(), 5), nil)
	w := httptest.NewRecorder()
	GetAllCategories(w, req, config.CTO_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	var categories []model.Category
	err = json.Unmarshal(data, &categories)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	assert.Equal(t, 200, res.StatusCode)
	assert.Greater(t, len(data), 0)
	assert.Greater(t, len(categories), 0)
}

func Test_GetAllCategories_IncorrectCategoryID(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/categories?id=%s&limit=%d", "", 5), nil)
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	GetAllCategories(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_GetAllCategories_InvalidDBUser(t *testing.T) {

	// retrieve the selected profile
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

	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/categories?id=%s&limit=%d", prevUser.ID.String(), 5), nil)
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	GetAllCategories(w, req, config.CEO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_CreateNewCategory(t *testing.T) {

	// retrieve the selected profile
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

	draftCategory := model.Category{
		Name:           "Kitty litter box",
		Description:    "Palette storage of kitty litter",
		Color:          "#f7f7f7",
		Status:         "general",
		MaxItemsLimit:  120,
		MinItemsLimit:  1,
		CreatedBy:      prevUser.ID.String(),
		UpdatedBy:      prevUser.ID.String(),
		SharableGroups: []string{prevUser.ID.String()},
	}

	// Marshal the draftEvent into JSON bytes
	requestBody, err := json.Marshal(draftCategory)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}

	req := httptest.NewRequest(http.MethodPost, "/api/v1/category", bytes.NewBuffer(requestBody))
	w := httptest.NewRecorder()
	CreateCategory(w, req, config.CTO_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, 200, res.StatusCode)

	var selectedCategory model.Category
	err = json.Unmarshal(data, &selectedCategory)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	assert.Equal(t, "Kitty litter box", selectedCategory.Name)
	assert.Equal(t, "Palette storage of kitty litter", selectedCategory.Description)
	assert.Equal(t, "general", selectedCategory.StatusName)
	assert.Equal(t, 120, selectedCategory.MaxItemsLimit)
	assert.Equal(t, 1, selectedCategory.MinItemsLimit)

	// cleanup
	db.RemoveCategory(config.CTO_USER, selectedCategory.ID)
}

func Test_CreateCategory_IncorrectUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/categories?id=%s&limit=%d", "", 5), nil)
	req = mux.SetURLVars(req, map[string]string{"id": "request"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	CreateCategory(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_CreateCategory_InvalidDBUser(t *testing.T) {

	draftCategory := model.Category{}
	requestBody, err := json.Marshal(draftCategory)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}
	req := httptest.NewRequest(http.MethodPost, "/api/v1/category", bytes.NewBuffer(requestBody))
	w := httptest.NewRecorder()
	CreateCategory(w, req, config.CEO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_UpdateCategory(t *testing.T) {

	// profile are automatically derieved from the auth table
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

	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/categories?id=%s&limit=%d", prevUser.ID.String(), 5), nil)
	w := httptest.NewRecorder()
	GetAllCategories(w, req, config.CTO_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	var categories []model.Category
	err = json.Unmarshal(data, &categories)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	selectedCategory := categories[0]
	assert.Greater(t, len(categories), 1)

	selectedCategory.Name = "Updated Title"
	selectedCategory.Description = "Update title description"
	selectedCategory.Status = "completed" // change status so id is not passed to service

	// Marshal the draftUpdateEvent into JSON bytes
	updateCategoryRequest, err := json.Marshal(selectedCategory)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}

	req = httptest.NewRequest(http.MethodPut, fmt.Sprintf("/api/v1/categories/%s", selectedCategory.ID), bytes.NewBuffer(updateCategoryRequest))
	req = mux.SetURLVars(req, map[string]string{"id": prevUser.ID.String()})
	w = httptest.NewRecorder()
	UpdateCategory(w, req, config.CTO_USER)
	res = w.Result()
	defer res.Body.Close()
	data, err = io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	assert.Equal(t, 200, res.StatusCode)
	assert.Greater(t, len(data), 0)

	var updatedCategory model.Category
	err = json.Unmarshal(data, &updatedCategory)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, "Updated Title", updatedCategory.Name)

	// cleanup
	db.RemoveNote(config.CTO_USER, updatedCategory.ID)
}

func Test_UpdateCategory_IncorrectUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/categories?id=%s&limit=%d", "", 5), nil)
	req = mux.SetURLVars(req, map[string]string{"id": "request"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	UpdateCategory(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_UpdateCategory_InvalidDBUser(t *testing.T) {

	draftCategory := model.Category{}
	requestBody, err := json.Marshal(draftCategory)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}
	req := httptest.NewRequest(http.MethodPost, "/api/v1/category", bytes.NewBuffer(requestBody))
	w := httptest.NewRecorder()
	UpdateCategory(w, req, config.CEO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_RemoveCategory(t *testing.T) {
	req := httptest.NewRequest(http.MethodDelete, "/api/v1/category/0802c692-b8e2-4824-a870-e52f4a0cccf8", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "0802c692-b8e2-4824-a870-e52f4a0cccf8"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	RemoveCategory(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 200, res.StatusCode)
	assert.Equal(t, "200 OK", res.Status)
}

func Test_RemoveCategory_IncorrectUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/categories?id=%s&limit=%d", "", 5), nil)
	req = mux.SetURLVars(req, map[string]string{"id": "request"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	RemoveCategory(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_RemoveCategory_InvalidDBUser(t *testing.T) {

	draftCategory := model.Category{}
	requestBody, err := json.Marshal(draftCategory)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}
	req := httptest.NewRequest(http.MethodPost, "/api/v1/category", bytes.NewBuffer(requestBody))
	w := httptest.NewRecorder()
	RemoveCategory(w, req, config.CEO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}
