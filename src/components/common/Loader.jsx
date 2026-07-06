export default function Loader({ size = 'md', text = '' }) {
  const sizes = { sm: 20, md: 36, lg: 52 };
  const px = sizes[size] || sizes.md;

  return (
    <div className="loader-wrap">
      <div
        className="loader-spinner"
        style={{ width: px, height: px, borderWidth: px > 30 ? 4 : 3 }}
      />
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}
