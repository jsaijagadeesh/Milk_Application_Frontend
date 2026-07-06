export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  id,
  style,
}) {
  return (
    <button
      id={id}
      type={type}
      className={`btn btn-${variant} btn-${size}${fullWidth ? ' btn-full' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
    >
      {loading ? <span className="btn-spinner" /> : children}
    </button>
  );
}
