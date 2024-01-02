package model

import (
	"encoding/json"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"github.com/mohit2530/communityCare/config"
)

// UserCredentials ...
type UserCredentials struct {
	ID                uuid.UUID `json:"id,omitempty"`
	Email             string    `json:"email,omitempty"`
	Role              string    `json:"role"`
	UserAgent         string    `json:"user_agent,omitempty"`
	EncryptedPassword string    `json:"password,omitempty"`
	PreBuiltToken     string    `json:"pre_token,omitempty"`
	LicenceKey        string    `json:"licence_key,omitempty"`
	ExpirationTime    time.Time `json:"expiration_time,omitempty"`
	jwt.StandardClaims
}

// ProduceAuthToken provides the ability to add the cookie to the logged in user
// This cookie is required to preview any secure payloads.
// Expiration time: 1 mins default
func (us *UserCredentials) ProduceAuthToken(draftUser *UserCredentials) {

	draftTime := os.Getenv("TOKEN_VALIDITY_TIME")
	produceTime, err := strconv.ParseInt(draftTime, 10, 64)
	if err != nil {
		produceTime = 1
	}
	draftUser.ExpirationTime = time.Now().Add(time.Duration(produceTime) * time.Minute)
	draftUser.StandardClaims = jwt.StandardClaims{
		ExpiresAt: draftUser.ExpirationTime.Unix(),
	}

	var licenseKey = config.BASE_LICENSE_KEY
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, us)
	tokenStr, err := token.SignedString(licenseKey)
	if err != nil {
		log.Printf("unable to decode token. error :- %+v", err)
		return
	}
	draftUser.LicenceKey = string(licenseKey)
	draftUser.PreBuiltToken = tokenStr
}

// User ...
type User struct {
	InstanceID               uuid.UUID
	ID                       uuid.UUID       `json:"id,omitempty"`
	Aud                      string          `json:"aud,omitempty"`
	Role                     string          `json:"role,omitempty"`
	Email                    string          `json:"email,omitempty"`
	FirstName                string          `json:"first_name,omitempty"`
	MiddleName               string          `json:"middle_name,omitempty"`
	LastName                 string          `json:"last_name,omitempty"`
	EncryptedPassword        string          `json:"encrypted_password,omitempty"`
	EmailConfirmedAt         time.Time       `json:"email_confirmed_at,omitempty"`
	InvitedAt                time.Time       `json:"invited_at,omitempty"`
	ConfirmationToken        string          `json:"confirmation_token,omitempty"`
	ConfirmationSentAt       time.Time       `json:"confirmation_sent_at,omitempty"`
	RecoveryToken            string          `json:"recovery_token,omitempty"`
	RecoverySentAt           time.Time       `json:"recovery_sent_at,omitempty"`
	EmailChangeTokenNew      string          `json:"email_change_token_new,omitempty"`
	EmailChange              string          `json:"email_change,omitempty"`
	EmailChangeSentAt        time.Time       `json:"email_change_sent_at,omitempty"`
	LastSignInAt             time.Time       `json:"last_sign_in_at,omitempty"`
	RawAppMetaData           json.RawMessage `json:"raw_app_meta_data,omitempty"`
	RawUserMetaData          json.RawMessage `json:"raw_user_meta_data,omitempty"`
	CreatedAt                time.Time       `json:"created_at,omitempty"`
	UpdatedAt                time.Time       `json:"updated_at,omitempty"`
	Phone                    string          `json:"phone,omitempty"`
	PhoneConfirmedAt         time.Time       `json:"phone_confirmed_at,omitempty"`
	PhoneChange              string          `json:"phone_change,omitempty"`
	PhoneChangeToken         string          `json:"phone_change_token,omitempty"`
	PhoneChangeSentAt        time.Time       `json:"phone_change_sent_at,omitempty"`
	ConfirmedAt              time.Time       `json:"confirmed_at,omitempty"`
	EmailChangeTokenCurrent  string          `json:"email_change_token_current,omitempty"`
	EmailChangeConfirmStatus int             `json:"email_change_confirm_status,omitempty"`
	BannedUntil              time.Time       `json:"banned_until,omitempty"`
	ReAuthenticationToken    string          `json:"re_authentication_token,omitempty"`
	ReAuthenticationSentAt   time.Time       `json:"re_authentication_sent_at,omitempty"`
	IsSSOUser                bool            `json:"is_sso_user,omitempty"`
	DeletedAt                time.Time       `json:"deleted_at,omitempty"`
}
