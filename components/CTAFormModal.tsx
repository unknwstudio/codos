import React, { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { supabase } from '../supabaseClient';

type CTAFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ACCENT = '#F26B1F';
const CREAM = '#f5f1ea';
const PAPER = '#faf5ec';
const INK = '#1a1a1a';
const DIM = '#3a3a3a';
const FAINT = 'rgba(26,26,26,0.55)';
const RULE = 'rgba(26,26,26,0.12)';
const RULE_HI = 'rgba(26,26,26,0.22)';

const SERIF = '"Fraunces", "Instrument Serif", Georgia, serif';
const SANS = "'Urbanist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
const MONO = '"Geist Mono", ui-monospace, monospace';

const labelStyle: CSSProperties = {
  display: 'block',
  fontFamily: MONO,
  fontSize: 10,
  letterSpacing: 0.22,
  textTransform: 'uppercase',
  color: FAINT,
  marginBottom: 8,
  fontWeight: 500,
};

const inputStyle: CSSProperties = {
  width: '100%',
  background: '#fff',
  color: INK,
  fontFamily: SANS,
  fontSize: 15,
  lineHeight: 1.4,
  border: `1px solid ${RULE}`,
  borderRadius: 12,
  padding: '12px 14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 88,
  fontFamily: SANS,
};

function useIsMobile(breakpoint = 760) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

const CTAFormModal: React.FC<CTAFormModalProps> = ({ isOpen, onClose }) => {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: '',
    teamSize: '',
    role: '',
    lookingFor: '',
    tried: '',
    budget: '',
    email: '',
    telegram: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusKey, setFocusKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setIsSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const isFormValid = useMemo(() => {
    return Boolean(
      formData.name.trim() &&
        formData.teamSize.trim() &&
        formData.role.trim() &&
        formData.lookingFor.trim() &&
        formData.tried.trim() &&
        formData.budget.trim() &&
        formData.email.trim()
    );
  }, [formData]);

  const handleClose = () => {
    setErrorMessage(null);
    setIsSuccess(false);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const leadPayload = {
      name: formData.name.trim(),
      team_size: formData.teamSize.trim(),
      role: formData.role.trim(),
      looking_for: formData.lookingFor.trim(),
      tried: formData.tried.trim(),
      budget: formData.budget.trim(),
      source: 'website',
      email: formData.email.trim(),
      telegram: formData.telegram.trim() || null,
    };

    const submitViaTelegramApi = async () => {
      const response = await fetch('/api/telegram-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
      });
      if (!response.ok) throw new Error('Fallback submission failed');
    };

    try {
      const { error } = await supabase.from('atlas_submissions').insert({
        name: leadPayload.name,
        team_size: leadPayload.team_size,
        looking_for: leadPayload.looking_for,
        tried: `${formData.tried.trim()}\n\nRole: ${formData.role.trim()}\nBudget: ${formData.budget.trim()}`,
        source: leadPayload.source,
        email: leadPayload.email,
        telegram: leadPayload.telegram,
      });
      if (error) await submitViaTelegramApi();
    } catch (error) {
      try {
        await submitViaTelegramApi();
      } catch {
        setErrorMessage('Submission failed. Please try again.');
        setIsSubmitting(false);
        return;
      }
    }

    setIsSuccess(true);
    setFormData({
      name: '',
      teamSize: '',
      role: '',
      lookingFor: '',
      tried: '',
      budget: '',
      email: '',
      telegram: '',
    });
    setIsSubmitting(false);
  };

  const fieldFocusStyle = (key: string): CSSProperties =>
    focusKey === key
      ? { borderColor: ACCENT, boxShadow: `0 0 0 3px ${ACCENT}1f` }
      : {};

  const renderInput = (
    key: keyof typeof formData,
    placeholder: string,
    type: string = 'text',
    required = true
  ) => (
    <input
      required={required}
      type={type}
      name={key}
      value={formData[key]}
      onChange={handleChange}
      onFocus={() => setFocusKey(key)}
      onBlur={() => setFocusKey(null)}
      style={{ ...inputStyle, ...fieldFocusStyle(key) }}
      placeholder={placeholder}
    />
  );

  const renderTextarea = (
    key: keyof typeof formData,
    placeholder: string,
    rows = 3
  ) => (
    <textarea
      required
      name={key}
      rows={rows}
      value={formData[key]}
      onChange={handleChange}
      onFocus={() => setFocusKey(key)}
      onBlur={() => setFocusKey(null)}
      style={{ ...textareaStyle, ...fieldFocusStyle(key) }}
      placeholder={placeholder}
    />
  );

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, fontFamily: SANS,
      }}
    >
      <div
        onClick={handleClose}
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(26, 26, 26, 0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: 'ctaFadeIn 200ms ease',
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: 640,
          maxHeight: '88vh', overflowY: 'auto',
          background: CREAM,
          color: INK,
          borderRadius: 24,
          border: `1px solid ${RULE_HI}`,
          boxShadow: '0 40px 80px -20px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.12)',
          animation: 'ctaPopIn 280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close form"
          style={{
            position: 'absolute', right: 18, top: 18,
            width: 34, height: 34, borderRadius: '50%',
            background: 'transparent',
            border: `1px solid ${RULE_HI}`,
            color: INK,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, lineHeight: 1,
            transition: 'background 150ms ease, color 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = INK;
            e.currentTarget.style.color = CREAM;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = INK;
          }}
        >
          ×
        </button>

        {/* Masthead */}
        <div
          style={{
            padding: isMobile ? '28px 22px 22px' : '40px 44px 28px',
            borderBottom: `1px solid ${RULE}`,
          }}
        >
          <div
            style={{
              fontFamily: MONO, fontSize: 10, letterSpacing: 0.3,
              color: ACCENT, textTransform: 'uppercase', marginBottom: 12,
            }}
          >
            §00 · book a call
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? 14 : 18 }}>
            <img
              src="/assets/founder-1.png"
              alt="Dima Khanarin"
              style={{
                width: isMobile ? 48 : 56, height: isMobile ? 48 : 56, borderRadius: 14,
                objectFit: 'cover', objectPosition: 'center top',
                background: '#f5ede0',
                border: `1px solid ${RULE_HI}`,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: isMobile ? 24 : 34, lineHeight: 1.1, letterSpacing: isMobile ? -0.5 : -0.8,
                  fontWeight: 400, margin: 0,
                }}
              >
                Hey, it's the <em style={{ fontStyle: 'italic', color: ACCENT }}>Codos founders</em>.
              </h2>
              <p style={{ margin: '8px 0 0', color: DIM, fontSize: isMobile ? 13 : 15, lineHeight: 1.5 }}>
                Tell us a little about you and we'll set up a call.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: isMobile ? '22px 22px 28px' : '28px 44px 36px', display: 'flex', flexDirection: 'column', gap: isMobile ? 18 : 22 }}>
          {/* Name */}
          <label>
            <span style={labelStyle}>Your name <span style={{ color: ACCENT }}>*</span></span>
            {renderInput('name', 'Jane Doe')}
          </label>

          {/* Team size + Role */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 18 : 16 }}>
            <label>
              <span style={labelStyle}>Team size <span style={{ color: ACCENT }}>*</span></span>
              {renderInput('teamSize', 'e.g. 50–250')}
            </label>
            <label>
              <span style={labelStyle}>Your role <span style={{ color: ACCENT }}>*</span></span>
              {renderInput('role', 'CEO, COO, Head of Ops…')}
            </label>
          </div>

          {/* Looking for */}
          <label>
            <span style={labelStyle}>What are you looking for? <span style={{ color: ACCENT }}>*</span></span>
            {renderTextarea('lookingFor', 'What outcomes are you expecting?')}
          </label>

          {/* Tried */}
          <label>
            <span style={labelStyle}>What have you already tried? <span style={{ color: ACCENT }}>*</span></span>
            {renderTextarea('tried', 'Tools, workflows, or experiments so far')}
          </label>

          {/* Budget */}
          <label>
            <span style={labelStyle}>Budget to solve the problem <span style={{ color: ACCENT }}>*</span></span>
            {renderInput('budget', 'e.g. $5k–$20k / month')}
          </label>

          {/* Email + Telegram */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 18 : 16 }}>
            <label>
              <span style={labelStyle}>Email <span style={{ color: ACCENT }}>*</span></span>
              {renderInput('email', 'you@company.com', 'email')}
            </label>
            <label>
              <span style={labelStyle}>Telegram <span style={{ color: FAINT, fontSize: 9 }}>(optional)</span></span>
              {renderInput('telegram', '@handle', 'text', false)}
            </label>
          </div>

          {errorMessage && (
            <div
              style={{
                background: 'rgba(181, 87, 43, 0.08)',
                border: '1px solid rgba(181, 87, 43, 0.35)',
                color: '#7a3a1c',
                padding: '12px 14px',
                borderRadius: 12,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {errorMessage}
            </div>
          )}
          {isSuccess && (
            <div
              style={{
                background: 'rgba(63, 122, 94, 0.08)',
                border: '1px solid rgba(63, 122, 94, 0.35)',
                color: '#2c5a44',
                padding: '12px 14px',
                borderRadius: 12,
                fontSize: 14,
                lineHeight: 1.5,
                fontFamily: SERIF,
                fontStyle: 'italic',
              }}
            >
              Thanks — we'll get in touch shortly.
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, paddingTop: 6, flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              style={{
                flex: '1 1 220px',
                background: INK, color: CREAM,
                padding: '14px 24px',
                borderRadius: 999, border: 'none',
                fontFamily: SANS, fontSize: 14, fontWeight: 600, letterSpacing: 0.01,
                cursor: !isFormValid || isSubmitting ? 'not-allowed' : 'pointer',
                opacity: !isFormValid || isSubmitting ? 0.5 : 1,
                transition: 'background 150ms ease, transform 150ms ease',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={(e) => {
                if (!isFormValid || isSubmitting) return;
                e.currentTarget.style.background = ACCENT;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = INK;
              }}
            >
              {isSubmitting ? 'Submitting…' : 'Submit →'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: '0 1 140px',
                background: 'transparent', color: INK,
                padding: '14px 22px',
                borderRadius: 999,
                border: `1px solid ${RULE_HI}`,
                fontFamily: SANS, fontSize: 14, fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 150ms ease, border-color 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(26, 26, 26, 0.06)';
                e.currentTarget.style.borderColor = INK;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = RULE_HI;
              }}
            >
              Cancel
            </button>
          </div>

          <div
            style={{
              fontFamily: MONO, fontSize: 10, color: FAINT,
              letterSpacing: 0.18, textTransform: 'uppercase',
              borderTop: `1px solid ${RULE}`,
              paddingTop: 18, marginTop: 4,
            }}
          >
            Required fields marked with <span style={{ color: ACCENT }}>*</span>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes ctaFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ctaPopIn {
          from { opacity: 0; transform: translateY(12px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* hidden — preload the cream paper background variable for nested elements */}
      <span style={{ display: 'none' }} aria-hidden="true" data-paper={PAPER} />
    </div>
  );
};

export default CTAFormModal;
