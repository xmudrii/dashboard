// Code generated by go-swagger; DO NOT EDIT.

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// GitSource git source
//
// swagger:model GitSource
type GitSource struct {

	// Path of the "source" in the repository. default is repository root
	Path string `json:"path,omitempty"`

	// URL to the repository. Can be HTTP(s) (e.g. https://example.com/myrepo) or SSH (e.g. git://example.com[:port]/path/to/repo.git/)
	// +kubebuilder:validation:MinLength=1
	Remote string `json:"remote,omitempty"`

	// credentials
	Credentials *GitCredentials `json:"credentials,omitempty"`

	// ref
	Ref *GitReference `json:"ref,omitempty"`
}

// Validate validates this git source
func (m *GitSource) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateCredentials(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateRef(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *GitSource) validateCredentials(formats strfmt.Registry) error {
	if swag.IsZero(m.Credentials) { // not required
		return nil
	}

	if m.Credentials != nil {
		if err := m.Credentials.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("credentials")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("credentials")
			}
			return err
		}
	}

	return nil
}

func (m *GitSource) validateRef(formats strfmt.Registry) error {
	if swag.IsZero(m.Ref) { // not required
		return nil
	}

	if m.Ref != nil {
		if err := m.Ref.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("ref")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("ref")
			}
			return err
		}
	}

	return nil
}

// ContextValidate validate this git source based on the context it is used
func (m *GitSource) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateCredentials(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateRef(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *GitSource) contextValidateCredentials(ctx context.Context, formats strfmt.Registry) error {

	if m.Credentials != nil {
		if err := m.Credentials.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("credentials")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("credentials")
			}
			return err
		}
	}

	return nil
}

func (m *GitSource) contextValidateRef(ctx context.Context, formats strfmt.Registry) error {

	if m.Ref != nil {
		if err := m.Ref.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("ref")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("ref")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *GitSource) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *GitSource) UnmarshalBinary(b []byte) error {
	var res GitSource
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}