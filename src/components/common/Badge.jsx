export default function Badge({ role }) {
  return (
    <span className={`badge badge-${role}`}>
      {role === 'admin' ? '🛡️ Admin' : '👤 User'}
    </span>
  );
}
