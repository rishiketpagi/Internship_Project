import './Skeleton.css';

function Skeleton({
  variant = 'text',
  width = '100%',
  height,
  lines = 1,
  className = '',
  'aria-label': ariaLabel = 'Loading content'
}) {
  const classNames = [
    'skeleton',
    `skeleton--${variant}`,
    className
  ].filter(Boolean).join(' ');

  const styles = {
    width,
    height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? '48px' : variant === 'rectangular' ? '120px' : undefined)
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={classNames} style={styles} aria-label={ariaLabel} aria-busy="true" role="status">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton__line"
            style={{
              width: i === lines - 1 ? '60%' : '100%',
              marginBottom: i === lines - 1 ? 0 : '0.5rem'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={classNames}
      style={styles}
      aria-label={ariaLabel}
      aria-busy="true"
      role="status"
    />
  );
}

Skeleton.displayName = 'Skeleton';

export default Skeleton;