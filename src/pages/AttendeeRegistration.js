import React, { useState, useContext } from 'react';
import { ConferenceContext } from '../ConferenceContext';
import { validateAttendeeForm } from '../validationUtils';
import '../styles/pages.css';

/**
 * AttendeeRegistration Component - Sign Up Page
 * 
 * CONVERTED FROM: signup.html + attendee.js
 * OLD APPROACH:
 * - HTML form with multiple input fields
 * - attendee.js had functions: validateField(), validateForm(), getFormData(), saveFormDataLocally(), displayAllAttendees(), deleteAttendee(), handleSignupSubmit()
 * - DOMContentLoaded listener added event handlers
 * - Form validation manipulated DOM classes and error divs directly
 * - attendees.forEach() built HTML strings and injected into DOM
 * 
 * NEW APPROACH:
 * - Form state managed with React hooks (useState)
 * - Form data stored in component state, not DOM
 * - Validation done using utility function, errors stored in state
 * - attendees come from Context instead of localStorage
 * - Data automatically persisted via Context's useEffect
 * - Component re-renders automatically when state changes
 * 
 * Key React Concepts Used:
 * - useState: Manage form data and validation errors
 * - useContext: Get attendees state and addAttendee function
 * - Controlled components: Input values bound to state with onChange handlers
 * - Conditional rendering: Error messages shown only when there are errors
 */
const AttendeeRegistration = () => {
  // Get attendees data and functions from global context
  const { attendees, addAttendee, deleteAttendee } = useContext(ConferenceContext);
  /**
   * Form State Management
   * 
   * OLD CODE: Form data was in DOM (inputs with id="fullName", etc)
   * NEW CODE: Form data in state object
   * 
   * When user types, onChange handler updates state
   * When user submits, we read from state (not DOM)
   */
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gradeLevel: '',
    institution: '',
    contactNumber: ''
  });

  /**
   * Validation State
   * Stores error messages for each field
   * errors.fullName = "Name must be at least 2 characters" (if invalid)
   * errors.fullName = undefined (if valid)
   */
  const [errors, setErrors] = useState({});

  /**
   * Submission Feedback
   * OLD CODE: alert("Attendee successfully registered!")
   * NEW CODE: Show success message below form (better UX)
   * Auto-hide after 3 seconds
   */
  const [submitted, setSubmitted] = useState(false);

  /**
   * Handle input changes
   * Called every time user types in a field
   * Updates state with new value
   * 
   * OLD CODE: No need - data was already in DOM
   * NEW CODE: This is called "controlled component" in React
   * - Input value = state value
   * - When input changes, state updates
   * - When state updates, input re-renders with new value
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle form submission
   * 
   * OLD CODE: handleSignupSubmit() in attendee.js:
   * - event.preventDefault()
   * - Called validateForm(formElement)
   * - If invalid, showed alert
   * - If valid, called getFormData(formElement), saveFormDataLocally(), displayAllAttendees(), alert(), and reset
   * 
   * NEW CODE: Same logic, cleaner implementation:
   * - Validate using utility function
   * - Set errors in state (shows error messages automatically)
   * - Call addAttendee from context
   * - Reset form and show success message
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form using utility function
    const { isValid, errors: validationErrors } = validateAttendeeForm(formData);
    
    if (!isValid) {
      // Show errors next to fields instead of alert
      setErrors(validationErrors);
      return;
    }

    // Validation passed - add to global state (automatically saves to localStorage)
    addAttendee({
      ...formData,
      contactNumber: formData.contactNumber || "Not provided"
    });

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      gradeLevel: '',
      institution: '',
      contactNumber: ''
    });
    setErrors({});
    
    // Show success message for 3 seconds
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return React.createElement(React.Fragment, null, [
    React.createElement('header', { className: "bg-success text-white py-4", key: "header" },
      React.createElement('div', { className: "container", key: "header-content" },
        React.createElement('h2', { className: "fw-bold m-0", key: "title" }, "Wildlife Conservation Conference")
      )
    ),
    React.createElement('div', { className: "container text-center mt-5", key: "hero" }, [
      React.createElement('h1', { key: "h1" }, "Wildlife Conservation Conference 2026"),
      React.createElement('p', { className: "lead", key: "lead" }, "Register to attend workshops, meet wildlife experts, and connect with fellow animal lovers.")
    ]),
    React.createElement('div', { className: "container my-5", key: "form-section" },
      React.createElement('div', { className: "card shadow-lg p-4" }, [
        React.createElement('h2', { className: "text-center mb-4", key: "form-title" }, "Attendee Registration"),
        ...(submitted ? [React.createElement('div', { className: "alert alert-success", role: "alert", key: "success" }, "Attendee successfully registered!")] : []),
        React.createElement('form', { onSubmit: handleSubmit, className: "row g-3 needs-validation", noValidate: true, key: "form" }, [
          React.createElement('div', { className: "col-md-6", key: "fullname" }, [
            React.createElement('label', { htmlFor: "fullName", className: "form-label" }, "Attendee Name *"),
            React.createElement('input', {
              type: "text",
              className: `form-control ${errors.fullName ? 'is-invalid' : ''}`,
              id: "fullName",
              name: "fullName",
              value: formData.fullName,
              onChange: handleChange,
              required: true
            }),
            errors.fullName ? React.createElement('div', { className: "text-danger" }, errors.fullName) : null
          ]),
          React.createElement('div', { className: "col-md-6", key: "email" }, [
            React.createElement('label', { htmlFor: "email", className: "form-label" }, "Email Address *"),
            React.createElement('input', {
              type: "email",
              className: `form-control ${errors.email ? 'is-invalid' : ''}`,
              id: "email",
              name: "email",
              value: formData.email,
              onChange: handleChange,
              required: true
            }),
            errors.email ? React.createElement('div', { className: "text-danger" }, errors.email) : null
          ]),
          React.createElement('div', { className: "col-md-6", key: "grade" }, [
            React.createElement('label', { htmlFor: "gradeLevel", className: "form-label" }, "Grade Level *"),
            React.createElement('select', {
              className: `form-select ${errors.gradeLevel ? 'is-invalid' : ''}`,
              id: "gradeLevel",
              name: "gradeLevel",
              value: formData.gradeLevel,
              onChange: handleChange,
              required: true
            }, [
              React.createElement('option', { value: "", key: "choose" }, "Choose..."),
              React.createElement('option', { value: "Freshman", key: "freshman" }, "Freshman"),
              React.createElement('option', { value: "Sophomore", key: "sophomore" }, "Sophomore"),
              React.createElement('option', { value: "Junior", key: "junior" }, "Junior"),
              React.createElement('option', { value: "Senior", key: "senior" }, "Senior"),
              React.createElement('option', { value: "Graduate Student", key: "grad" }, "Graduate Student")
            ]),
            errors.gradeLevel ? React.createElement('div', { className: "text-danger" }, errors.gradeLevel) : null
          ]),
          React.createElement('div', { className: "col-md-6", key: "institution" }, [
            React.createElement('label', { htmlFor: "institution", className: "form-label" }, "Institution *"),
            React.createElement('input', {
              type: "text",
              className: `form-control ${errors.institution ? 'is-invalid' : ''}`,
              id: "institution",
              name: "institution",
              value: formData.institution,
              onChange: handleChange,
              required: true
            }),
            errors.institution ? React.createElement('div', { className: "text-danger" }, errors.institution) : null
          ]),
          React.createElement('div', { className: "col-md-6", key: "contact" }, [
            React.createElement('label', { htmlFor: "contactNumber", className: "form-label" }, "Contact Number"),
            React.createElement('input', {
              type: "tel",
              className: `form-control ${errors.contactNumber ? 'is-invalid' : ''}`,
              id: "contactNumber",
              name: "contactNumber",
              value: formData.contactNumber,
              onChange: handleChange
            }),
            errors.contactNumber ? React.createElement('div', { className: "text-danger" }, errors.contactNumber) : null
          ]),
          React.createElement('div', { className: "col-12 text-center mt-3", key: "buttons" }, [
            React.createElement('button', { className: "btn btn-success btn-lg", type: "submit", key: "submit" }, "Register for Conference"),
            React.createElement('button', { className: "btn btn-secondary btn-lg ms-2", onClick: () => {
              setFormData({
                fullName: '',
                email: '',
                gradeLevel: '',
                institution: '',
                contactNumber: ''
              });
              setErrors({});
            }, key: "clear" }, "Clear Form")
          ])
        ])
      ])
    ),
    React.createElement('div', { className: "container text-center my-5", key: "attendees" }, [
      React.createElement('h3', { className: "mb-3", key: "list-title" }, "Registered Attendees"),
      React.createElement('p', { className: "text-muted", key: "list-lead" }, "Submitted attendee information will appear below."),
      React.createElement('div', { className: "container my-4", key: "list" },
        attendees.length === 0 ? React.createElement('p', { className: "text-muted" }, "No attendees registered yet.") :
        attendees.map((attendee, index) =>
          React.createElement('div', { key: index, className: "card mb-3 p-3" }, [
            React.createElement('h5', { key: "name" }, attendee.fullName),
            React.createElement('p', { key: "email" }, `Email: ${attendee.email}`),
            React.createElement('p', { key: "grade" }, `Grade Level: ${attendee.gradeLevel}`),
            React.createElement('p', { key: "institution" }, `Institution: ${attendee.institution}`),
            React.createElement('p', { key: "contact" }, `Contact Number: ${attendee.contactNumber}`),
            React.createElement('button', { className: "btn btn-danger", onClick: () => deleteAttendee(index), key: "delete" }, "Delete")
          ])
        )
      )
    ]),
    React.createElement('footer', { className: "bg-dark text-white text-center py-3 mt-auto", key: "footer" },
      React.createElement('p', null, "© 2026 Wildlife Conservation Conference | IST 256 Group Project")
    )
  ]);
};

export default AttendeeRegistration;