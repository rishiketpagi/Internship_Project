import { forwardRef, useId } from 'react';
import './Input.css';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled = false,
  required = false,
  readOnly = false,
  leftIcon,
  rightIcon,
  className = '',
  id: providedId,
  autoComplete,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const hasError = Boolean(error);

  const describedBy = [
    hasError && errorId,
    helperText && !hasError && helperId
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`input-wrapper ${hasError ? 'input-wrapper--error' : ''} ${disabled ? 'input-wrapper--disabled' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="input__label">
          {label}
          {required && <span className="input__required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="input__container">
        {leftIcon && <span className="input__icon input__icon--left" aria-hidden="true">{leftIcon}</span>}
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          autoComplete={autoComplete}
          className="input__field"
          aria-invalid={hasError}
          aria-describedby={describedBy}
          aria-required={required}
          {...props}
        />
        {rightIcon && <span className="input__icon input__icon--right" aria-hidden="true">{rightIcon}</span>}
      </div>
      {hasError && (
        <p id={errorId} className="input__message input__message--error" role="alert">
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p id={helperId} className="input__message input__message--helper">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;