package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"github.com/mohit2530/communityCare/config"
	"github.com/mohit2530/communityCare/model"
	"golang.org/x/crypto/bcrypt"
)

// SaveUser ...
func SaveUser(user string, draftUser *model.UserCredentials) (*model.UserCredentials, error) {
	db, err := SetupDB(user)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	// generate the hashed password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(draftUser.EncryptedPassword), 8)
	if err != nil {
		return nil, err
	}

	tx, err := db.Begin()
	if err != nil {
		return nil, err
	}

	sqlStr := `
	INSERT INTO auth.users(email, username, birthdate, encrypted_password, role)
	VALUES ($1, $2, $3, $4, $5)
	RETURNING id
	`

	var draftUserID string
	err = tx.QueryRow(
		sqlStr,
		draftUser.Email,
		draftUser.Username,
		draftUser.Birthday,
		string(hashedPassword),
		draftUser.Role,
	).Scan(&draftUserID)

	if err != nil {
		tx.Rollback()
		return nil, err
	}

	draftUser.ID, err = uuid.Parse(draftUserID)
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return draftUser, nil
}

// RetrieveUser ...
func RetrieveUser(user string, draftUser *model.UserCredentials) (*model.UserCredentials, error) {
	db, err := SetupDB(user)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	// retrive the encrypted pwd. EMAIL must be UNIQUE field.
	sqlStr := `SELECT id, role, encrypted_password FROM auth.users WHERE email=$1`

	result := db.QueryRow(sqlStr, draftUser.Email)
	storedCredentials := &model.UserCredentials{}
	err = result.Scan(&storedCredentials.ID, &storedCredentials.Role, &storedCredentials.EncryptedPassword)
	if err != nil {
		log.Printf("unable to retrieve user details. error: +%v", err)
		return nil, err
	}

	if err = bcrypt.CompareHashAndPassword([]byte(storedCredentials.EncryptedPassword), []byte(draftUser.EncryptedPassword)); err != nil {
		return nil, err
	}

	// apply the token after verfication of the user.
	// allow the id of the current user to prefil from the db
	// we only want to limit this functionality to the sign in method.
	draftUser.ID = storedCredentials.ID
	draftUser.Role = storedCredentials.Role
	draftUser.ProduceAuthToken(draftUser)

	applyJwtTokenToUser(user, draftUser)
	return draftUser, nil
}

// IsValidUserEmail ...
func IsValidUserEmail(user string, draftUserEmail string) (bool, error) {
	db, err := SetupDB(user)
	if err != nil {
		return false, err
	}
	defer db.Close()

	// retrive the encrypted pwd. EMAIL must be UNIQUE field.
	sqlStr := `SELECT EXISTS(SELECT 1 FROM auth.users u WHERE u.email=$1);`

	result := db.QueryRow(sqlStr, draftUserEmail)
	exists := false
	err = result.Scan(&exists)
	if err != nil {
		log.Printf("unable to validate user email address. error: +%v", err)
		return false, err
	}
	return !exists, nil // return false if found
}

// RemoveUser ...
func RemoveUser(user string, id uuid.UUID) error {
	db, err := SetupDB(user)
	if err != nil {
		return err
	}
	defer db.Close()

	sqlStr := `DELETE FROM auth.users WHERE id = $1`
	result, err := db.Exec(sqlStr, id)
	if err != nil {
		log.Printf("Error deleting user with ID %s: %v", id.String(), err)
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("Error getting rows affected after deleting user: %v", err)
		return err
	}

	if rowsAffected == 0 {
		log.Printf("No user found with ID %s", id.String())
		// You might want to return a custom error here if needed
		return nil
	}

	return nil
}

// ValidateCredentials ...
func ValidateCredentials(user string, ID string) error {
	db, err := SetupDB(user)
	if err != nil {
		return err
	}
	defer db.Close()

	tx, err := db.Begin()
	if err != nil {
		return err
	}

	var tokenFromDb string
	var expirationTime time.Time
	err = tx.QueryRow(`SELECT token, expiration_time FROM auth.oauth WHERE id=$1 LIMIT 1`, ID).Scan(&tokenFromDb, &expirationTime)
	if err != nil {
		log.Printf("unable to retrive validated token. error: +%v", err)
		tx.Rollback()
		return err
	}

	token, err := jwt.Parse(tokenFromDb, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid license detected")
		}
		return config.BASE_LICENSE_KEY, nil
	})

	if !(token.Valid) {
		log.Printf("invalid token detected. error :%+v", err)
		tx.Rollback()
		return err
	}

	// Check if the token is within the last 30 seconds of its expiry time
	// token is about to expire. if the user is continuing with activity, create new token
	timeLeft := time.Until(expirationTime)

	if timeLeft <= 30*time.Second && timeLeft > 0 {

		draftTime := os.Getenv("TOKEN_VALIDITY_TIME")
		produceTime, err := strconv.ParseInt(draftTime, 10, 64)
		if err != nil {
			produceTime = 1
		}

		var licenseKey = config.BASE_LICENSE_KEY
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Duration(produceTime) * time.Minute).Unix(),
		})
		tokenStr, err := token.SignedString(licenseKey)
		if err != nil {
			log.Printf("unable to extend token. error :- %+v", err)
			return err
		}

		parsedUserID, err := uuid.Parse(ID)
		if err != nil {
			log.Printf("unable to determine user id. error :%+v", err)
			return err
		}

		ghostUser := model.UserCredentials{
			ID:             parsedUserID,
			ExpirationTime: time.Now().Add((time.Duration(produceTime) * time.Minute)),
			PreBuiltToken:  tokenStr,
		}
		err = revalidateOauthToken(&ghostUser, tx)
		if err != nil {
			log.Printf("unable to revalidate the user. error %+v", err)
			return err
		}
	}

	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}

// applyJwtTokenToUser ...
//
// allows to update the token schema with the proper credentials for the user
// also updates the auth.users table with the used license key to decode the jwt.
// the result however is a masked entity to preserve the users jwt
func applyJwtTokenToUser(user string, draftUser *model.UserCredentials) error {
	db, err := SetupDB(user)
	if err != nil {
		return err
	}
	defer db.Close()

	tx, err := db.Begin()
	if err != nil {
		return err
	}

	// set the instance_id as the license key used to encode / decode the jwt.
	// save each users own key so that we can decode the token in private if needed be.
	sqlStr := "UPDATE auth.users SET instance_id = $1 WHERE id = $2"
	_, err = tx.Exec(sqlStr, draftUser.LicenceKey, draftUser.ID)
	if err != nil {
		log.Printf("unable to add license key to signed in user. error: +%v", err)
		tx.Rollback()
		return err
	}
	err = upsertOauthToken(draftUser, tx)
	if err != nil {
		log.Printf("unable to add auth token. error: %+v", err)
		tx.Rollback()
		return err
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}

// upsertOauthToken ...
//
// updates the oauth token table in the database
func upsertOauthToken(draftUser *model.UserCredentials, tx *sql.Tx) error {

	var maskedID string

	sqlStr := `
	INSERT INTO auth.oauth
	(token, user_id, expiration_time, user_agent)
	VALUES ($1, $2, $3, $4)
	ON CONFLICT (user_id)
	DO UPDATE SET
		token = EXCLUDED.token,
		expiration_time = EXCLUDED.expiration_time,
		user_agent = EXCLUDED.user_agent
	RETURNING id`

	err := tx.QueryRow(
		sqlStr,
		draftUser.PreBuiltToken,
		draftUser.ID,
		draftUser.ExpirationTime,
		draftUser.UserAgent,
	).Scan(&maskedID)

	if err != nil {
		log.Printf("unable to add token. Error: %v", err)
		tx.Rollback()
		return err
	}

	// apply the masked token
	draftUser.PreBuiltToken = maskedID
	return nil
}

// revalidateOauthToken ...
//
// revalidates the user token.
func revalidateOauthToken(draftUser *model.UserCredentials, tx *sql.Tx) error {

	sqlStr := `
	UPDATE auth.oauth
	SET token=$1, expiration_time=$2
	WHERE id=$3
	`
	_, err := tx.Exec(sqlStr, draftUser.PreBuiltToken, draftUser.ExpirationTime, draftUser.ID)

	if err != nil {
		log.Printf("unable to refresh token. Error: %v", err)
		tx.Rollback()
		return err
	}
	return nil
}
