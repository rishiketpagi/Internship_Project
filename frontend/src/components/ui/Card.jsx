import './Card.css';

function Card({
  children,
  className = '',
  variant = 'elevated',
  padding = 'md',
  hoverable = false,
  onClick,
  as: Component = 'div',
  ...props
}) {
  const classNames = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    hoverable && 'card--hoverable',
    onClick && 'card--clickable',
    className
  ].filter(Boolean).join(' ');

  const ComponentType = onClick ? 'button' : Component;

  const commonProps = {
    className: classNames,
    ...props
  };

  if (ComponentType === 'button') {
    return (
      <button
        {...commonProps}
        type="button"
        onClick={onClick}
        disabled={props.disabled}
      >
        {children}
      </button>
    );
  }

  return <ComponentType {...commonProps}>{children}</ComponentType>;
}

Card.displayName = 'Card';

export default Card;