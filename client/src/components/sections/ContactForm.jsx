import { useEffect, useRef, useState } from 'react';
import { SERVICE_OPTIONS, SITE } from '../../data/content.js';
import { submitLead } from '../../services/leadsApi.js';
import { whatsappLink } from '../../utils/format.js';
import { CheckIcon, WhatsAppIcon } from '../ui/Icons.jsx';

const EMPTY = { name: '', email: '', phone: '', service: SERVICE_OPTIONS[0], message: '', website: '' };

// The same rules run on the server (server/src/validators/leadSchema.js).
const RULES = {
  name: (v) => (v.trim().length >= 2 ? '' : 'Please enter your full name.'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'),
  phone: (v) => (/^[0-9+()\-\s]{7,20}$/.test(v.trim()) ? '' : 'Please enter a valid phone or WhatsApp number.'),
  service: (v) => (SERVICE_OPTIONS.includes(v) ? '' : 'Please choose a service.'),
  message: (v) => (v.trim().length >= 10 ? '' : 'Please tell us a little more (at least 10 characters).'),
};
const FIELD_ORDER = Object.keys(RULES);

function validate(values) {
  const errors = {};
  FIELD_ORDER.forEach((field) => {
    const message = RULES[field](values[field]);
    if (message) errors[field] = message;
  });
  return errors;
}

function Field({ id, label, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm({ prefill }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverError, setServerError] = useState('');
  const refs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    service: useRef(null),
    message: useRef(null),
  };
  const successRef = useRef(null);
  const whatsapp = whatsappLink(SITE.whatsapp, SITE.whatsappMessage);

  // The savings calculator can fill in the form for the visitor.
  useEffect(() => {
    if (!prefill) return undefined;
    setValues((current) => ({ ...current, ...prefill.values }));
    setErrors({});
    setStatus((current) => (current === 'success' ? 'idle' : current));
    const timer = setTimeout(() => refs.name.current?.focus({ preventScroll: true }), 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill]);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  };

  const focusFirstError = (found) => {
    const first = FIELD_ORDER.find((field) => found[field]);
    if (first) refs[first].current?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'submitting') return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }

    setStatus('submitting');
    setServerError('');
    try {
      await submitLead(values);
      setValues(EMPTY);
      setStatus('success');
    } catch (err) {
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
        setStatus('idle');
        focusFirstError(err.fieldErrors);
      } else {
        setServerError(err.message);
        setStatus('error');
      }
    }
  };

  const describe = (field) => (errors[field] ? `lead-${field}-error` : undefined);

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <div className="contact-info">
          <h2 id="contact-title">Tell us what slows your team down.</h2>
          <p className="contact-lead">
            Book your free workflow audit. Send a short note about the work you would like to hand off, and we will reply with next steps and a time for your audit.
          </p>
          <ul className="direct">
            <li>
              <span>Email</span>
              <a className="mail" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </li>
            {whatsapp && (
              <li>
                <span>Prefer WhatsApp?</span>
                <a className="btn btn-wa" href={whatsapp} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>

        {status === 'success' ? (
          <div className="form-success" role="status" tabIndex={-1} ref={successRef}>
            <span className="success-mark">
              <CheckIcon />
            </span>
            <h3>Thank you!</h3>
            <p>Your audit request is received, we will contact you shortly.</p>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStatus('idle')}>
              Send another request
            </button>
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="row2">
              <Field id="lead-name" label="Full name" error={errors.name}>
                <input
                  ref={refs.name}
                  id="lead-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describe('name')}
                />
              </Field>
              <Field id="lead-email" label="Email" error={errors.email}>
                <input
                  ref={refs.email}
                  id="lead-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describe('email')}
                />
              </Field>
            </div>

            <div className="row2">
              <Field id="lead-phone" label="Phone or WhatsApp" error={errors.phone}>
                <input
                  ref={refs.phone}
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={describe('phone')}
                />
              </Field>
              <Field id="lead-service" label="What do you need?" error={errors.service}>
                <select
                  ref={refs.service}
                  id="lead-service"
                  name="service"
                  value={values.service}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.service)}
                  aria-describedby={describe('service')}
                >
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field id="lead-message" label="What would you like to automate?" error={errors.message}>
              <textarea
                ref={refs.message}
                id="lead-message"
                name="message"
                maxLength={2000}
                placeholder="For example: we answer every enquiry by hand and it takes hours each day."
                value={values.message}
                onChange={handleChange}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describe('message')}
              />
            </Field>

            {/* Spam trap: people never see this field, bots fill it in. */}
            <div className="hp" aria-hidden="true">
              <label htmlFor="lead-website">Website</label>
              <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={handleChange} />
            </div>

            {status === 'error' && (
              <div className="form-alert" role="alert">
                <p>{serverError}</p>
                {whatsapp && (
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                    Message us on WhatsApp instead
                  </a>
                )}
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Sending...
                </>
              ) : (
                'Book my free audit'
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
