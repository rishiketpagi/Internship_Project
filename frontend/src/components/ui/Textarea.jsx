import { forwardRef, useId } from 'react';
import './Textarea.css';

const Textarea = forwardRef(({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled = false,
  required = false,
  readOnly = false,
  rows = 4,
  maxLength,
  showCharCount = false,
  className = '',
  id: providedId,
  autoResize = false,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const hasError = Boolean(error);

  const describedBy = [
    hasError && errorId,
    helperText && !hasError && helperId,
    showCharCount && maxLength && `${id}-count`
  ].filter(Boolean).join(' ') || undefined;

  const handleChange = (event) => {
    if (maxLength && event.target.value.length > maxLength) {
      return;
    }
    onChange?.(event);
  };

  return (
    <div className={`textarea-wrapper ${hasError ? 'textarea-wrapper--error' : ''} ${disabled ? 'textarea-wrapper--disabled' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="textarea__label">
          {label}
          {required && <span className="textarea__required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="textarea__container" style={{ position: 'relative' }}>
        <textarea
          ref={ref}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          rows={rows}
          className="textarea__field"
          aria-invalid={hasError}
          aria-describedby={describedBy}
          aria-required={required}
          style={autoResize ? { resize: 'none', minHeight: 'auto' } : {}}
          {...props}
        />
        {autoResize && (
          <textarea
            aria-hidden="true"
            className="textarea__ghost"
            readOnly
            tabIndex={-1}
            defaultValue={value}
            style={{ visibility: 'hidden', position: 'absolute', top: 0, left: 0, pointerEvents: 'none', height: 'auto', minHeight: 0 }}
          />
        )}
      </div>
      <div className="textarea__footer">
        {showCharCount && maxLength && (
          <span id={`${id}-count`} className="textarea__count" aria-live="polite">
            {value.length}/{maxLength}
          </span>
        )}
        {!showCharCount && !maxLength && helperText && !hasError && (
          <p id={helperId} className="textarea__helper">{helperText}</p>
        )}
      </div>
      {hasError && (
        <p id={errorId} className="textarea__message textarea__message--error" role="alert">
          {error}
        </p>
      )}
      {!hasError && helperText && !showCharCount && !maxLength && (
        <p id={helperId} className="textarea__message textarea__message--helper">
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;