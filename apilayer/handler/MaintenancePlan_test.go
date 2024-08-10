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

func Test_GetAllMaintenancePlans(t *testing.T) {

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

	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/maintenance-plans?id=%s&limit=%d", prevUser.ID.String(), 5), nil)
	w := httptest.NewRecorder()
	GetAllMaintenancePlans(w, req, config.CTO_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	var maintenancePlan []model.MaintenancePlan
	err = json.Unmarshal(data, &maintenancePlan)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	assert.Equal(t, 200, res.StatusCode)
	assert.Greater(t, len(data), 0)
	assert.Greater(t, len(maintenancePlan), 0)
}

func Test_GetAllMaintenancePlans_IncorrectPlanID(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/maintenance-plans?id=%s&limit=%d", "", 5), nil)
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	GetAllMaintenancePlans(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_GetAllMaintenancePlans_InvalidDBUser(t *testing.T) {

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

	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/maintenance-plans?id=%s&limit=%d", prevUser.ID.String(), 5), nil)
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	GetAllMaintenancePlans(w, req, config.CEO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_CreateMaintenancePlan(t *testing.T) {

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

	draftMaintenancePlan := model.MaintenancePlan{
		Name:           "Kitty litter box",
		Description:    "Palette storage of kitty litter",
		Color:          "#f7f7f7",
		Status:         "Approved",
		MaxItemsLimit:  120,
		MinItemsLimit:  1,
		PlanType:       "annual",
		CreatedBy:      prevUser.ID.String(),
		UpdatedBy:      prevUser.ID.String(),
		SharableGroups: []string{prevUser.ID.String()},
	}

	// Marshal the draftEvent into JSON bytes
	requestBody, err := json.Marshal(draftMaintenancePlan)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}

	req := httptest.NewRequest(http.MethodPost, "/api/v1/plan", bytes.NewBuffer(requestBody))
	w := httptest.NewRecorder()
	CreateMaintenancePlan(w, req, config.CTO_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, 200, res.StatusCode)

	var selectedMaintenancePlan model.MaintenancePlan
	err = json.Unmarshal(data, &selectedMaintenancePlan)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	assert.Equal(t, selectedMaintenancePlan.Name, "Kitty litter box")
	assert.Equal(t, selectedMaintenancePlan.Description, "Palette storage of kitty litter")
	assert.Equal(t, selectedMaintenancePlan.StatusName, "Approved")
	assert.Equal(t, selectedMaintenancePlan.MaxItemsLimit, 120)
	assert.Equal(t, selectedMaintenancePlan.MinItemsLimit, 1)
	assert.Equal(t, selectedMaintenancePlan.PlanType, "annual")

	// cleanup
	db.RemoveCategory(config.CTO_USER, selectedMaintenancePlan.ID)
}

func Test_CreateMaintenancePlan_IncorrectUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/categories?id=%s&limit=%d", "", 5), nil)
	req = mux.SetURLVars(req, map[string]string{"id": "request"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	CreateMaintenancePlan(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_CreateMaintenancePlan_InvalidDBUser(t *testing.T) {

	draftMaintenancePlan := model.MaintenancePlan{}
	requestBody, err := json.Marshal(draftMaintenancePlan)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}
	req := httptest.NewRequest(http.MethodPost, "/api/v1/plan", bytes.NewBuffer(requestBody))
	w := httptest.NewRecorder()
	CreateMaintenancePlan(w, req, config.CEO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_UpdateMaintenancePlan(t *testing.T) {

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

	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/maintenance-plans?id=%s&limit=%d", prevUser.ID.String(), 5), nil)
	w := httptest.NewRecorder()
	GetAllMaintenancePlans(w, req, config.CTO_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	var maintenancePlans []model.MaintenancePlan
	err = json.Unmarshal(data, &maintenancePlans)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	selectedMaintenancePlan := maintenancePlans[0]
	assert.Greater(t, len(maintenancePlans), 1)

	selectedMaintenancePlan.Name = "Updated Title"
	selectedMaintenancePlan.Description = "Update title description"
	selectedMaintenancePlan.Status = "Rejected" // change status so id is not passed to service

	// Marshal the draftUpdateEvent into JSON bytes
	updateMaintenancePlanRequest, err := json.Marshal(selectedMaintenancePlan)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}

	req = httptest.NewRequest(http.MethodPut, fmt.Sprintf("/api/v1/plan/%s", selectedMaintenancePlan.ID), bytes.NewBuffer(updateMaintenancePlanRequest))
	req = mux.SetURLVars(req, map[string]string{"id": prevUser.ID.String()})
	w = httptest.NewRecorder()
	UpdateMaintenancePlan(w, req, config.CTO_USER)
	res = w.Result()
	defer res.Body.Close()
	data, err = io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	assert.Equal(t, res.StatusCode, 200)
	assert.Greater(t, len(data), 0)

	var updatedMaintenancePlan model.MaintenancePlan
	err = json.Unmarshal(data, &updatedMaintenancePlan)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, updatedMaintenancePlan.Name, "Updated Title")
	assert.Equal(t, updatedMaintenancePlan.StatusName, "Rejected")

	// cleanup
	db.RemoveMaintenancePlan(config.CTO_USER, updatedMaintenancePlan.ID)
}

func Test_UpdateMaintenancePlan_IncorrectUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/plan", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "request"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	UpdateMaintenancePlan(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_UpdateMaintenancePlan_InvalidDBUser(t *testing.T) {

	draftMaintenancePlan := model.MaintenancePlan{}
	requestBody, err := json.Marshal(draftMaintenancePlan)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}
	req := httptest.NewRequest(http.MethodPost, "/api/v1/plan", bytes.NewBuffer(requestBody))
	w := httptest.NewRecorder()
	UpdateMaintenancePlan(w, req, config.CEO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_RemoveMaintenancePlan(t *testing.T) {
	req := httptest.NewRequest(http.MethodDelete, "/api/v1/plan/0802c692-b8e2-4824-a870-e52f4a0cccf8", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "0802c692-b8e2-4824-a870-e52f4a0cccf8"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	RemoveMaintenancePlan(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 200, res.StatusCode)
	assert.Equal(t, "200 OK", res.Status)
}

func Test_RemoveMaintenancePlan_IncorrectUserID(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/plan/0802c692-b8e2-4824-a870-e52f4a0cccf8", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "request"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	RemoveMaintenancePlan(w, req, config.CTO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}

func Test_RemoveMaintenancePlan_InvalidDBUser(t *testing.T) {

	draftMaintenancePlan := model.MaintenancePlan{}
	requestBody, err := json.Marshal(draftMaintenancePlan)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}
	req := httptest.NewRequest(http.MethodPost, "/api/v1/plan", bytes.NewBuffer(requestBody))
	w := httptest.NewRecorder()
	RemoveMaintenancePlan(w, req, config.CEO_USER)
	res := w.Result()

	assert.Equal(t, 400, res.StatusCode)
	assert.Equal(t, "400 Bad Request", res.Status)
}