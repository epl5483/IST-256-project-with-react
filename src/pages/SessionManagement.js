import React, { useState, useContext } from 'react';
import { ConferenceContext } from '../ConferenceContext';
import { validateSessionForm } from '../validationUtils';
import '../styles/pages.css';

const SessionManagement = () => {
  const { sessions, addSession, updateSession, deleteSession, filterSessions } = useContext(ConferenceContext);

  const [formData, setFormData] = useState({
    sessionID: '',
    sessionTitle: '',
    workshop: '',
    duration: '',
    registrationFee: '',
    speaker: '',
    additionalInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const displayedSessions = searchQuery.trim() ? filterSessions(searchQuery) : sessions;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { isValid, errors: validationErrors } = validateSessionForm(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    if (editIndex !== null) {
      updateSession(editIndex, formData);
    } else {
      addSession(formData);
    }

    setFormData({
      sessionID: '',
      sessionTitle: '',
      workshop: '',
      duration: '',
      registrationFee: '',
      speaker: '',
      additionalInfo: ''
    });
    setErrors({});
    setEditIndex(null);
    
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleEdit = (index) => {
    const session = sessions[index];
    setFormData(session);
    setEditIndex(index);
    setErrors({});
  };

  return React.createElement(React.Fragment, null, [
    React.createElement('header', { className: "bg-success text-white py-4", key: "header" },
      React.createElement('div', { className: "container", key: "hdr-content" },
        React.createElement('h2', { className: "fw-bold m-0", key: "title" }, "Wildlife Conservation Conference")
      )
    ),
    React.createElement('div', { className: "container text-center mt-5", key: "hero" }, [
      React.createElement('h1', { key: "h1" }, "Session Management"),
      React.createElement('p', { className: "lead", key: "lead" }, "Create, edit, and manage conference sessions")
    ]),
    React.createElement('div', { className: "container my-5", key: "form-sec" },
      React.createElement('div', { className: "card shadow-lg p-4" }, [
        React.createElement('h2', { className: "text-center mb-4", key: "form-title" }, editIndex !== null ? 'Edit Session' : 'Create New Session'),
        ...(submitted ? [React.createElement('div', { className: "alert alert-success", role: "alert", key: "alert" }, editIndex !== null ? 'Session updated successfully!' : 'Session successfully registered!')] : []),
        React.createElement('form', { onSubmit: handleSubmit, className: "row g-3 needs-validation", noValidate: true, key: "form" }, [
          React.createElement('div', { className: "col-md-6", key: "id" }, [
            React.createElement('label', { htmlFor: "sessionID", className: "form-label" }, "Session ID *"),
            React.createElement('input', { type: "text", className: `form-control ${errors.sessionID ? 'is-invalid' : ''}`, id: "sessionID", name: "sessionID", value: formData.sessionID, onChange: handleChange, required: true }),
            errors.sessionID ? React.createElement('div', { className: "text-danger" }, errors.sessionID) : null
          ]),
          React.createElement('div', { className: "col-md-6", key: "title" }, [
            React.createElement('label', { htmlFor: "sessionTitle", className: "form-label" }, "Session Title *"),
            React.createElement('input', { type: "text", className: `form-control ${errors.sessionTitle ? 'is-invalid' : ''}`, id: "sessionTitle", name: "sessionTitle", value: formData.sessionTitle, onChange: handleChange, required: true }),
            errors.sessionTitle ? React.createElement('div', { className: "text-danger" }, errors.sessionTitle) : null
          ]),
          React.createElement('div', { className: "col-md-6", key: "workshop" }, [
            React.createElement('label', { htmlFor: "workshop", className: "form-label" }, "Workshop *"),
            React.createElement('input', { type: "text", className: `form-control ${errors.workshop ? 'is-invalid' : ''}`, id: "workshop", name: "workshop", value: formData.workshop, onChange: handleChange, required: true }),
            errors.workshop ? React.createElement('div', { className: "text-danger" }, errors.workshop) : null
          ]),
          React.createElement('div', { className: "col-md-6", key: "duration" }, [
            React.createElement('label', { htmlFor: "duration", className: "form-label" }, "Duration *"),
            React.createElement('input', { type: "text", className: `form-control ${errors.duration ? 'is-invalid' : ''}`, id: "duration", name: "duration", value: formData.duration, onChange: handleChange, required: true }),
            errors.duration ? React.createElement('div', { className: "text-danger" }, errors.duration) : null
          ]),
          React.createElement('div', { className: "col-md-6", key: "fee" }, [
            React.createElement('label', { htmlFor: "registrationFee", className: "form-label" }, "Registration Fee *"),
            React.createElement('input', { type: "number", className: `form-control ${errors.registrationFee ? 'is-invalid' : ''}`, id: "registrationFee", name: "registrationFee", value: formData.registrationFee, onChange: handleChange, required: true }),
            errors.registrationFee ? React.createElement('div', { className: "text-danger" }, errors.registrationFee) : null
          ]),
          React.createElement('div', { className: "col-md-6", key: "speaker" }, [
            React.createElement('label', { htmlFor: "speaker", className: "form-label" }, "Speaker *"),
            React.createElement('input', { type: "text", className: `form-control ${errors.speaker ? 'is-invalid' : ''}`, id: "speaker", name: "speaker", value: formData.speaker, onChange: handleChange, required: true }),
            errors.speaker ? React.createElement('div', { className: "text-danger" }, errors.speaker) : null
          ]),
          React.createElement('div', { className: "col-12", key: "info" }, [
            React.createElement('label', { htmlFor: "additionalInfo", className: "form-label" }, "Additional Information"),
            React.createElement('textarea', { className: `form-control ${errors.additionalInfo ? 'is-invalid' : ''}`, id: "additionalInfo", name: "additionalInfo", value: formData.additionalInfo, onChange: handleChange, rows: 3 }),
            errors.additionalInfo ? React.createElement('div', { className: "text-danger" }, errors.additionalInfo) : null
          ]),
          React.createElement('div', { className: "col-12 text-center mt-3", key: "buttons" }, [
            React.createElement('button', { className: "btn btn-success btn-lg", type: "submit", key: "submit" }, editIndex !== null ? 'Update Session' : 'Create Session'),
            React.createElement('button', { className: "btn btn-secondary btn-lg ms-2", onClick: () => { setFormData({ sessionID: '', sessionTitle: '', workshop: '', duration: '', registrationFee: '', speaker: '', additionalInfo: '' }); setErrors({}); setEditIndex(null); }, key: "clear" }, "Clear Form")
          ])
        ])
      ])
    ),
    React.createElement('div', { className: "container my-5", key: "search-sec" },
      React.createElement('div', { className: "card shadow-lg p-4" }, [
        React.createElement('h3', { className: "text-center mb-4", key: "search-title" }, "Search Sessions"),
        React.createElement('div', { className: "row g-3", key: "search-row" }, [
          React.createElement('div', { className: "col-md-8", key: "input" },
            React.createElement('input', { type: "text", className: "form-control", placeholder: "Search by ID, title, workshop, or speaker", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })
          ),
          React.createElement('div', { className: "col-md-4", key: "btn" },
            React.createElement('button', { className: "btn btn-primary w-100", onClick: () => setSearchQuery('') }, "Clear Search")
          )
        ])
      ])
    ),
    React.createElement('div', { className: "container text-center my-5", key: "list-sec" }, [
      React.createElement('h3', { className: "mb-3", key: "list-title" }, "Conference Sessions"),
      React.createElement('p', { className: "text-muted", key: "list-lead" }, "Manage existing sessions below."),
      React.createElement('div', { className: "container my-4", key: "list" },
        displayedSessions.length === 0 ? React.createElement('p', { className: "text-muted" }, searchQuery.trim() ? "No sessions match your search." : "No sessions registered yet.") :
        displayedSessions.map((session, index) =>
          React.createElement('div', { key: index, className: "card mb-3 p-3" }, [
            React.createElement('h5', { key: "name" }, session.sessionTitle),
            React.createElement('p', { key: "id" }, `Session ID: ${session.sessionID}`),
            React.createElement('p', { key: "workshop" }, `Workshop: ${session.workshop}`),
            React.createElement('p', { key: "duration" }, `Duration: ${session.duration}`),
            React.createElement('p', { key: "fee" }, `Fee: $${session.registrationFee}`),
            React.createElement('p', { key: "speaker" }, `Speaker: ${session.speaker}`),
            session.additionalInfo ? React.createElement('p', { key: "info" }, `Additional Info: ${session.additionalInfo}`) : null,
            React.createElement('div', { className: "mt-2", key: "actions" }, [
              React.createElement('button', { className: "btn btn-warning me-2", onClick: () => handleEdit(index), key: "edit" }, "Edit"),
              React.createElement('button', { className: "btn btn-danger", onClick: () => deleteSession(index), key: "delete" }, "Delete")
            ])
          ])
        )
      )
    ]),
    React.createElement('footer', { className: "bg-dark text-white text-center py-3 mt-auto", key: "footer" },
      React.createElement('p', null, "© 2026 Wildlife Conservation Conference | IST 256 Group Project")
    )
  ]);
};

export default SessionManagement;