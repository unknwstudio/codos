import React, { useEffect, useState } from 'react';
import '../ds.css';

/**
 * /ds — living styleguide. Renders ONLY design-system primitives.
 * Everything here consumes tokens from tokens.css (directly via var() or via
 * the token-backed Tailwind utilities mapped in tailwind.config.js). Token
 * names are read live from :root so labels reflect the current source of truth.
 */

// Read a CSS custom property's computed value from :root (single source).
const useVar = (name: string): string => {
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
  }, [name]);
  return value;
};

const Meta: React.FC<{ name: string; extra?: string }> = ({ name, extra }) => {
  const value = useVar(name);
  return (
    <div className="flex flex-wrap items-baseline gap-x-sm gap-y-xs font-body text-caption">
      <code className="text-text">{name}</code>
      <code className="text-muted">{value || '—'}{extra ? ` · ${extra}` : ''}</code>
    </div>
  );
};

const Section: React.FC<{ title: string; note?: string; children: React.ReactNode }> = ({ title, note, children }) => (
  <section className="border-t border-border pt-xl mt-xl">
    <h2 className="font-headline text-h3 text-text mb-xs">{title}</h2>
    {note ? <p className="font-body text-body-sm text-muted mb-lg max-w-xl">{note}</p> : <div className="mb-lg" />}
    {children}
  </section>
);

// ---- Token data (drives the rendered reference) ----------------------------
const HEADLINE_SCALE = [
  { tw: 'text-display', token: '--text-display', lead: '--leading-display', label: 'Display' },
  { tw: 'text-h1', token: '--text-h1', lead: '--leading-h1', label: 'Heading 1' },
  { tw: 'text-h2', token: '--text-h2', lead: '--leading-h2', label: 'Heading 2' },
  { tw: 'text-h3', token: '--text-h3', lead: '--leading-h3', label: 'Heading 3' },
  { tw: 'text-h4', token: '--text-h4', lead: '--leading-h4', label: 'Heading 4' },
];

const BODY_SCALE = [
  { tw: 'text-body-lg', token: '--text-body-lg', lead: '--leading-body-lg', label: 'Body Large' },
  { tw: 'text-body-md', token: '--text-body', lead: '--leading-body', label: 'Body' },
  { tw: 'text-body-sm', token: '--text-body-sm', lead: '--leading-body-sm', label: 'Body Small' },
  { tw: 'text-caption', token: '--text-caption', lead: '--leading-caption', label: 'Caption' },
];

const WEIGHTS = [
  { tw: 'font-thin', token: '--font-weight-thin', label: 'Thin' },
  { tw: 'font-light', token: '--font-weight-light', label: 'Light' },
  { tw: 'font-normal', token: '--font-weight-regular', label: 'Regular' },
  { tw: 'font-medium', token: '--font-weight-medium', label: 'Medium' },
  { tw: 'font-bold', token: '--font-weight-bold', label: 'Bold' },
];

const COLORS = [
  '--color-bg', '--color-surface', '--color-text', '--color-muted',
  '--color-border', '--color-accent', '--color-accent-hover', '--color-accent-contrast',
  '--color-success', '--color-warning', '--color-danger', '--color-info',
];

const SPACING = [
  '--space-1', '--space-2', '--space-3', '--space-4', '--space-5',
  '--space-6', '--space-8', '--space-10', '--space-12',
];

const BUTTON_VARIANTS = [
  { cls: 'ds-btn--primary', label: 'Primary' },
  { cls: 'ds-btn--secondary', label: 'Secondary' },
  { cls: 'ds-btn--ghost', label: 'Ghost' },
];

const BUTTON_STATES = [
  { label: 'Default', mod: '', disabled: false },
  { label: 'Hover', mod: 'is-hover', disabled: false },
  { label: 'Active', mod: 'is-active', disabled: false },
  { label: 'Focus', mod: 'is-focus', disabled: false },
  { label: 'Disabled', mod: 'is-disabled', disabled: true },
];

const FIELD_STATES = [
  { label: 'Default', mod: '', disabled: false },
  { label: 'Focus', mod: 'is-focus', disabled: false },
  { label: 'Error', mod: 'is-error', disabled: false },
  { label: 'Disabled', mod: 'is-disabled', disabled: true },
];

// ---- Small presentational helpers ------------------------------------------
const StateCaption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="font-body text-caption text-muted">{children}</span>
);

const Swatch: React.FC<{ token: string }> = ({ token }) => (
  <div className="flex flex-col gap-xs">
    <div
      className="w-full border border-border rounded-token-sm"
      style={{ background: `var(${token})`, height: 'var(--space-10)' }}
    />
    <Meta name={token} />
  </div>
);

const SpacingBar: React.FC<{ token: string }> = ({ token }) => (
  <div className="flex items-center gap-md">
    <div className="bg-accent rounded-token-sm" style={{ width: `var(${token})`, height: 'var(--space-4)' }} />
    <Meta name={token} />
  </div>
);

const Toggle: React.FC = () => {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className="ds-toggle"
      onClick={() => setOn((v) => !v)}
    >
      <span className="ds-toggle__knob" />
    </button>
  );
};

const DSPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-bg text-text font-body">
      <div className="max-w-5xl mx-auto px-lg py-2xl">
        {/* Header */}
        <header>
          <p className="font-body text-caption text-accent tracking-[0.2em] uppercase mb-sm">Design System</p>
          <h1 className="font-headline text-display text-text leading-[var(--leading-display)]">Primitives</h1>
          <p className="font-body text-body-md text-muted mt-md max-w-xl">
            The reference for tokens and primitives. Every value below comes from a token in
            <code className="text-text"> tokens.css</code>. Change a token and this page — and everything that
            consumes it — updates. Headlines use <code className="text-text">GT&nbsp;Alpina&nbsp;Typewriter</code>;
            body/UI uses <code className="text-text">DM&nbsp;Mono</code>.
          </p>
        </header>

        {/* Type scale */}
        <Section title="Type scale — headline" note="Rendered in --font-headline (GT Alpina Typewriter).">
          <div className="flex flex-col gap-lg">
            {HEADLINE_SCALE.map((t) => (
              <div key={t.token} className="flex flex-col gap-xs">
                <div className={`font-headline text-text ${t.tw}`}>{t.label} — the quick brown fox</div>
                <Meta name={t.token} extra={t.lead} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Type scale — body" note="Rendered in --font-body (DM Mono).">
          <div className="flex flex-col gap-lg">
            {BODY_SCALE.map((t) => (
              <div key={t.token} className="flex flex-col gap-xs">
                <div className={`font-body text-text ${t.tw}`}>
                  {t.label} — the quick brown fox jumps over the lazy dog
                </div>
                <Meta name={t.token} extra={t.lead} />
              </div>
            ))}
          </div>
        </Section>

        {/* Font weights */}
        <Section title="Font weights" note="GT Alpina Typewriter ships 100/300/400/500/700. DM Mono provides 300/400/500.">
          <div className="flex flex-col gap-lg">
            {WEIGHTS.map((w) => (
              <div key={w.token} className="flex flex-col gap-xs">
                <div className={`font-headline text-h3 text-text ${w.tw}`}>{w.label} — Aa Bb Cc 123</div>
                <Meta name={w.token} />
              </div>
            ))}
          </div>
        </Section>

        {/* Colors */}
        <Section title="Color palette" note="Semantic roles — labelled with their token name and current value.">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-lg">
            {COLORS.map((c) => (
              <Swatch key={c} token={c} />
            ))}
          </div>
        </Section>

        {/* Spacing */}
        <Section title="Spacing scale" note="The indent/spacing rhythm, visualized to width.">
          <div className="flex flex-col gap-md">
            {SPACING.map((s) => (
              <SpacingBar key={s} token={s} />
            ))}
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons" note="Variants × states. Hover / Active / Focus are shown statically and also work on interaction.">
          <div className="flex flex-col gap-xl">
            {BUTTON_VARIANTS.map((v) => (
              <div key={v.cls} className="flex flex-col gap-md">
                <StateCaption>{v.label}</StateCaption>
                <div className="flex flex-wrap items-start gap-lg">
                  {BUTTON_STATES.map((s) => (
                    <div key={s.label} className="flex flex-col items-center gap-xs">
                      <button type="button" className={`ds-btn ${v.cls} ${s.mod}`} disabled={s.disabled}>
                        {v.label}
                      </button>
                      <StateCaption>{s.label}</StateCaption>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Form controls */}
        <Section title="Form controls" note="Text input, textarea, select, checkbox, radio, toggle — across default / focus / error / disabled.">
          <div className="flex flex-col gap-xl">

            {/* Text input */}
            <div className="flex flex-col gap-md">
              <StateCaption>Text input</StateCaption>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
                {FIELD_STATES.map((s) => (
                  <div key={s.label} className="flex flex-col gap-xs">
                    <input
                      type="text"
                      className={`ds-field ${s.mod}`}
                      defaultValue={s.label === 'Error' ? 'invalid@' : ''}
                      placeholder="you@team.com"
                      disabled={s.disabled}
                    />
                    <StateCaption>{s.label}</StateCaption>
                  </div>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div className="flex flex-col gap-md">
              <StateCaption>Textarea</StateCaption>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
                {FIELD_STATES.map((s) => (
                  <div key={s.label} className="flex flex-col gap-xs">
                    <textarea
                      rows={3}
                      className={`ds-field ${s.mod}`}
                      defaultValue={s.label === 'Error' ? 'too short' : ''}
                      placeholder="Tell us more…"
                      disabled={s.disabled}
                    />
                    <StateCaption>{s.label}</StateCaption>
                  </div>
                ))}
              </div>
            </div>

            {/* Select */}
            <div className="flex flex-col gap-md">
              <StateCaption>Select</StateCaption>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
                {FIELD_STATES.map((s) => (
                  <div key={s.label} className="flex flex-col gap-xs">
                    <select className={`ds-field ${s.mod}`} disabled={s.disabled} defaultValue="">
                      <option value="" disabled>Choose…</option>
                      <option>Engineering</option>
                      <option>Sales</option>
                      <option>Support</option>
                    </select>
                    <StateCaption>{s.label}</StateCaption>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkbox + Radio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-xl">
              <div className="flex flex-col gap-md">
                <StateCaption>Checkbox</StateCaption>
                <div className="flex flex-wrap gap-lg">
                  <label className="flex items-center gap-sm text-body-sm">
                    <input type="checkbox" className="ds-check" /> Default
                  </label>
                  <label className="flex items-center gap-sm text-body-sm">
                    <input type="checkbox" className="ds-check" defaultChecked /> Checked
                  </label>
                  <label className="flex items-center gap-sm text-body-sm">
                    <input type="checkbox" className="ds-check is-focus" defaultChecked /> Focus
                  </label>
                  <label className="flex items-center gap-sm text-body-sm">
                    <input type="checkbox" className="ds-check is-error" /> Error
                  </label>
                  <label className="flex items-center gap-sm text-body-sm text-muted">
                    <input type="checkbox" className="ds-check" disabled /> Disabled
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-md">
                <StateCaption>Radio</StateCaption>
                <div className="flex flex-wrap gap-lg">
                  <label className="flex items-center gap-sm text-body-sm">
                    <input type="radio" name="ds-radio" className="ds-check" /> Default
                  </label>
                  <label className="flex items-center gap-sm text-body-sm">
                    <input type="radio" name="ds-radio" className="ds-check" defaultChecked /> Checked
                  </label>
                  <label className="flex items-center gap-sm text-body-sm">
                    <input type="radio" name="ds-radio2" className="ds-check is-focus" defaultChecked /> Focus
                  </label>
                  <label className="flex items-center gap-sm text-body-sm">
                    <input type="radio" name="ds-radio3" className="ds-check is-error" /> Error
                  </label>
                  <label className="flex items-center gap-sm text-body-sm text-muted">
                    <input type="radio" name="ds-radio4" className="ds-check" disabled /> Disabled
                  </label>
                </div>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex flex-col gap-md">
              <StateCaption>Toggle</StateCaption>
              <div className="flex flex-wrap items-start gap-lg">
                <div className="flex flex-col items-center gap-xs">
                  <button type="button" role="switch" aria-checked={false} className="ds-toggle"><span className="ds-toggle__knob" /></button>
                  <StateCaption>Off</StateCaption>
                </div>
                <div className="flex flex-col items-center gap-xs">
                  <button type="button" role="switch" aria-checked className="ds-toggle is-on"><span className="ds-toggle__knob" /></button>
                  <StateCaption>On</StateCaption>
                </div>
                <div className="flex flex-col items-center gap-xs">
                  <button type="button" role="switch" aria-checked className="ds-toggle is-on is-focus"><span className="ds-toggle__knob" /></button>
                  <StateCaption>Focus</StateCaption>
                </div>
                <div className="flex flex-col items-center gap-xs">
                  <button type="button" role="switch" aria-checked={false} className="ds-toggle is-disabled" disabled><span className="ds-toggle__knob" /></button>
                  <StateCaption>Disabled</StateCaption>
                </div>
                <div className="flex flex-col items-center gap-xs">
                  <Toggle />
                  <StateCaption>Interactive</StateCaption>
                </div>
              </div>
            </div>

          </div>
        </Section>
      </div>
    </main>
  );
};

export default DSPage;
