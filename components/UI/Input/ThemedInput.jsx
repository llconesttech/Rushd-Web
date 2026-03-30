"use client";

import PropTypes from "prop-types";
import "./ThemedInput.css";

export default function ThemedInput({
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
  inputMode,
  prefix,
  ariaLabel,
  name,
  id,
  className = "",
  ...inputProps
}) {
  return (
    <div className={["themed-input", className.trim()].filter(Boolean).join(" ")}>
      {prefix ? <span className="themed-input__prefix">{prefix}</span> : null}
      <input
        id={id}
        name={name}
        className="themed-input__field"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={inputMode}
        aria-label={ariaLabel}
        {...inputProps}
      />
    </div>
  );
}

ThemedInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  inputMode: PropTypes.string,
  prefix: PropTypes.node,
  ariaLabel: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  // Any other valid <input> props (e.g. onWheel, min, step)
};

