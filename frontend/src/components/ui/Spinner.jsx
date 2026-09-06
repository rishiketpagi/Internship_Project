import './Spinner.css';

function Spinner({
  size = 'md',
  className = '',
  'aria-label': ariaLabel = 'Loading',
  color = 'primary'
}) {
  const classNames = [
    'spinner',
    `spinner--${size}`,
    `spinner--${color}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span
      className={classNames}
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
    >
      <svg className="spinner__svg" viewBox="0 0 50 50" aria-hidden="true">
        <circle
          className="spinner__track"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
        />
        <circle
          className="spinner__indicator"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="90, 150"
        />
      </svg>
    </span>
  );
}

Spinner.displayName = 'Spinner';

export default Spinner;