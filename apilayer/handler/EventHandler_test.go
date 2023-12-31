package handler

import (
	"bytes"
	"encoding/json"
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

func Test_GetEventHealthCheck(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/health", nil)
	w := httptest.NewRecorder()
	GetEventHealthCheck(w, req, config.DB_TEST_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.True(t, len(string(data)) <= 69)
	assert.Equal(t, 200, res.StatusCode)
}

func Test_GetAllEventsApi(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/events", nil)
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	GetAllEvents(w, req, config.DB_TEST_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, 200, res.StatusCode)
	t.Logf("response = %+v", string(data))
}

func Test_GetAllItemsApi(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/items/0902c692-b8e2-4824-a870-e52f4a0cccf8", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "0902c692-b8e2-4824-a870-e52f4a0cccf8"})
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	GetAllItems(w, req, config.DB_TEST_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, 200, res.StatusCode)
	assert.Greater(t, len(data), 0)
	t.Logf("response = %+v", string(data))
}

func Test_CreateNewEvent(t *testing.T) {
	draftEvent := &model.Event{
		Title:          "Test Event for Community Care",
		Cause:          "Celebrations",          // Celebrations
		ProjectType:    "Community Development", // Community Development
		Attendees:      []string{"d1173b89-ca88-4e39-91c1-189dd4678586"},
		TotalManHours:  200,
		StartDate:      time.Now(),
		CreatedBy:      "d1173b89-ca88-4e39-91c1-189dd4678586",
		UpdatedBy:      "d1173b89-ca88-4e39-91c1-189dd4678586",
		SharableGroups: []string{"d1173b89-ca88-4e39-91c1-189dd4678586"},
		ProjectSkills:  []string{"Videography"},
	}

	// Marshal the draftEvent into JSON bytes
	requestBody, err := json.Marshal(draftEvent)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}

	req := httptest.NewRequest(http.MethodPost, "/api/v1/events", bytes.NewBuffer(requestBody))
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	CreateNewEvent(w, req, config.DB_TEST_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, 200, res.StatusCode)

	// cleanup

	var selectedEvent model.Event
	err = json.Unmarshal(data, &selectedEvent)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	db.DeleteEvent(config.DB_TEST_USER, selectedEvent.ID)
}

func Test_CreateNewReport(t *testing.T) {

	draftEvent := &model.Event{
		Title:          "Test Event for Community Care",
		Cause:          "Celebrations",          // Celebrations
		ProjectType:    "Community Development", // Community Development
		Attendees:      []string{"d1173b89-ca88-4e39-91c1-189dd4678586"},
		TotalManHours:  200,
		StartDate:      time.Now(),
		CreatedBy:      "d1173b89-ca88-4e39-91c1-189dd4678586",
		UpdatedBy:      "d1173b89-ca88-4e39-91c1-189dd4678586",
		SharableGroups: []string{"d1173b89-ca88-4e39-91c1-189dd4678586"},
		ProjectSkills:  []string{"Videography"},
	}

	// Marshal the draftEvent into JSON bytes
	requestBody, err := json.Marshal(draftEvent)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}

	req := httptest.NewRequest(http.MethodPost, "/api/v1/events", bytes.NewBuffer(requestBody))
	w := httptest.NewRecorder()
	db.PreloadAllTestVariables()
	CreateNewEvent(w, req, config.DB_TEST_USER)
	res := w.Result()
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, 200, res.StatusCode)

	var selectedEvent model.Event
	err = json.Unmarshal(data, &selectedEvent)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	draftReport := &model.ReportEvent{
		Subject:        "Test Reporting Event",
		Description:    "Long Description of a report for the event",
		OrganizerName:  "Test User",
		EventLocation:  "Test Event Location for Selected Event",
		EventID:        selectedEvent.ID,
		CreatedBy:      selectedEvent.CreatedBy,
		UpdatedBy:      selectedEvent.UpdatedBy,
		SharableGroups: []string{selectedEvent.CreatedBy},
	}

	// Marshal the draftEvent into JSON bytes
	requestBody, err = json.Marshal(draftReport)
	if err != nil {
		t.Errorf("failed to marshal JSON: %v", err)
	}

	req = httptest.NewRequest(http.MethodPost, "/api/v1/report", bytes.NewBuffer(requestBody))
	w = httptest.NewRecorder()
	db.PreloadAllTestVariables()
	CreateNewReport(w, req, config.DB_TEST_USER)
	res = w.Result()
	defer res.Body.Close()
	data, err = io.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}
	assert.Equal(t, 200, res.StatusCode)

	// cleanup
	var selectedReport model.ReportEvent
	err = json.Unmarshal(data, &selectedReport)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	db.DeleteEvent(config.DB_TEST_USER, selectedEvent.ID)
	db.DeleteReport(config.DB_TEST_USER, selectedReport.ID)
}
