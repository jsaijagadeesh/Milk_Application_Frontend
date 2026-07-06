export default function Input({
  id,
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  min,
  max,
  step,
  autoComplete,
  required,
}) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
          {required && <span style={{ color: 'var(--color-danger)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        autoComplete={autoComplete}
        className={`form-input${error ? ' form-input-error' : ''}`}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
