package hoard

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/brianvoe/gofakeit"
	_ "github.com/lib/pq"
	"github.com/mohit2530/communityCare/db"
	"github.com/mohit2530/communityCare/model"

	"github.com/joho/godotenv"
)

// IngestSvc ...
//
// main function to ingest data from the datalake
func IngestSvc() {

	// load environment variables
	err := godotenv.Load(filepath.Join("..", "..", ".env"))
	if err != nil {
		log.Printf("No env file detected. Using os system configuration.")
	}

	// setupDB
	currentUser := os.Getenv("CLIENT_USER")
	db, err := SetupDB(currentUser)
	if err != nil {
		log.Fatal("Unable to use data lake without a db source")
	}
	defer db.Close()

	emailAddress := "test@gmail.com"
	// using the same user as test instance
	creatorID, err := GenerateFakeUser(currentUser, emailAddress)
	if err != nil {
		log.Fatal("error during finding a test user... %+v", err)
	}
	GenerateFakeDataWithLimit(currentUser, 200, "event", creatorID)
	GenerateFakeDataWithLimit(currentUser, 20, "report", creatorID)

}

// GenerateFakeDataWithLimit ...
//
// GenerateFakeDataWithLimit retrieves fake data for mashed application with a limit of rows.
func GenerateFakeDataWithLimit(user string, limitRows int, typeOf string, creatorID string) error {

	if limitRows <= 0 {
		fmt.Println("unable to add fake data with empty limit")
		return errors.New("unable to add fake data")
	}

	// rowCounts are generated from limitRows. this is to generate dynamic information
	rowCounts := gofakeit.Number(limitRows, limitRows+100)

	switch typeOf {
	case "event":
		log.Printf("loading %d of event rows", limitRows)
		populateFakeEventDetails(user, limitRows, creatorID)
	case "report":
		log.Printf("loading %d of expense rows", rowCounts)
		populateFakeReportDetails(user, rowCounts, creatorID)
	case "expense":
		log.Printf("loading %d of expense rows", rowCounts)
		populateFakeExpenseDetails(user, rowCounts, creatorID)
	default:
	}
	return nil
}

// populateFakeEventDetails ...
//
// generate fake event data to test in the application
func populateFakeEventDetails(user string, limit int, creatorID string) {

	userGroup := []string{creatorID}

	for i := 1; i <= limit; i++ {
		draftEvent := model.Event{}

		// time is set for created / updated
		now := time.Now()
		daysAgo := gofakeit.Number(1, 30)
		startDate := now.AddDate(0, 0, -daysAgo)

		draftEvent.Title = gofakeit.Sentence(6)
		draftEvent.Description = gofakeit.Sentence(12)
		draftEvent.Cause = "Celebrations"
		draftEvent.ProjectType = "Education"
		draftEvent.Street = gofakeit.Street()
		draftEvent.City = gofakeit.City()
		draftEvent.State = gofakeit.State()
		draftEvent.ZipCode = gofakeit.Zip()
		draftEvent.Lattitude = fmt.Sprintf("%f", gofakeit.Latitude())
		draftEvent.Longitude = fmt.Sprintf("%f", gofakeit.Longitude())
		draftEvent.MaxAttendees = gofakeit.Number(1, 20)
		draftEvent.Attendees = userGroup
		draftEvent.SharableGroups = userGroup
		draftEvent.TotalManHours = gofakeit.Number(40, 100)
		draftEvent.Deactivated = gofakeit.Bool()
		draftEvent.StartDate = startDate
		draftEvent.CreatedBy = creatorID
		draftEvent.UpdatedBy = creatorID

		db.SaveNewEvent(user, &draftEvent)
	}

}

// populateFakeReportDetails ...
//
// used to generate fake report for the first eventID
// generate fake report data to test in the application
func populateFakeReportDetails(user string, limit int, creatorID string) {

	resp, err := db.RetrieveAllEvents(user)
	if err != nil {
		log.Printf("unable to populate reports without eventID. err %+v", err)
		return
	}

	draftEvent := resp[0]
	userGroup := []string{creatorID}

	for i := 1; i <= limit; i++ {
		draftReport := model.ReportEvent{}

		// time is set for created / updated
		now := time.Now()
		daysAgo := gofakeit.Number(1, 30)
		startDate := now.AddDate(0, 0, -daysAgo)

		draftReport.Subject = gofakeit.JobTitle()
		draftReport.Description = gofakeit.JobDescriptor()
		draftReport.EventLocation = gofakeit.Address().Address
		draftReport.OrganizerName = gofakeit.Name()
		draftReport.EventID = draftEvent.ID
		draftReport.CreatedAt = startDate
		draftReport.UpdatedAt = startDate
		draftReport.CreatedBy = creatorID
		draftReport.UpdatedBy = creatorID
		draftReport.SharableGroups = userGroup

		db.SaveNewReport(user, &draftReport)
	}

}

// populateFakeExpenseDetails ...
//
// generate fake expense data to test in the application
func populateFakeExpenseDetails(user string, limit int, creatorID string) {

	userGroup := []string{creatorID}

	for i := 1; i <= limit; i++ {
		draftEvent := model.Event{}

		// time is set for created / updated
		now := time.Now()
		daysAgo := gofakeit.Number(1, 30)
		startDate := now.AddDate(0, 0, -daysAgo)

		draftEvent.Title = gofakeit.Sentence(6)
		draftEvent.Description = gofakeit.Sentence(12)
		draftEvent.Cause = "Celebrations"
		draftEvent.ProjectType = "Education"
		draftEvent.Street = gofakeit.Street()
		draftEvent.City = gofakeit.City()
		draftEvent.State = gofakeit.State()
		draftEvent.ZipCode = gofakeit.Zip()
		draftEvent.Lattitude = fmt.Sprintf("%f", gofakeit.Latitude())
		draftEvent.Longitude = fmt.Sprintf("%f", gofakeit.Longitude())
		draftEvent.MaxAttendees = gofakeit.Number(1, 20)
		draftEvent.Attendees = userGroup
		draftEvent.SharableGroups = userGroup
		draftEvent.TotalManHours = gofakeit.Number(40, 100)
		draftEvent.Deactivated = gofakeit.Bool()
		draftEvent.StartDate = startDate
		draftEvent.CreatedBy = creatorID
		draftEvent.UpdatedBy = creatorID

		db.SaveNewEvent(user, &draftEvent)
	}
}

// GenerateFakeUser ...
//
// used to create a fake user for testing and ingest purpose only
func GenerateFakeUser(user string, emailAddress string) (string, error) {
	db, err := SetupDB(user)
	if err != nil {
		return "", err
	}
	defer db.Close()

	tx, err := db.Begin()
	if err != nil {
		return "", err
	}

	var updatedProfile model.Profile

	sqlStr := `
	UPDATE community.profiles SET 
	username = 'IngestSvcUser',
	full_name = 'John Doe',
	phone_number = '1234567890',
	about_me = 'There is a lot of things that are in the unknown. Explore them'
	WHERE email_address = $1
	RETURNING id;`

	row := tx.QueryRow(sqlStr, emailAddress)
	if err != nil {
		tx.Rollback()
		return "", err
	}
	err = row.Scan(
		&updatedProfile.ID,
	)

	if err != nil {
		tx.Rollback()
		return "", err
	}

	if err := tx.Commit(); err != nil {
		return "", err
	}

	updatedProfile.Validate()
	return updatedProfile.ID.String(), nil
}

// SetupDB ...
//
// function is used to build the db for the data lake
func SetupDB(user string) (*sql.DB, error) {

	pwd := os.Getenv("CLIENT_PASSWORD")
	if len(pwd) == 0 {
		pwd = "password"
	}

	host := os.Getenv("DATABASE_DOCKER_CONTAINER_IP_ADDRESS")
	if len(host) == 0 {
		host = "localhost"
	}

	port := os.Getenv("DATABASE_DOCKER_CONTAINER_PORT")
	if len(port) == 0 {
		port = "5432"
	}

	psqlStr := fmt.Sprintf("postgres://%s:%s@%s:%s/community?sslmode=disable", user, pwd, host, port)
	var db, err = sql.Open("postgres", psqlStr)
	if err != nil {
		log.Fatalf("failed to open postgres db. error: +%v", err)
		return nil, err
	}

	// if the user is unable to ping the db, we don't want to submit the request
	err = db.Ping()
	if err != nil {
		fmt.Printf("unable to ping. error: +%v", err)
		return nil, err
	}
	return db, nil
}
