"use client";

import PropTypes from "prop-types";
import "./SegmentedControl.css";

export default function SegmentedControl({
  value,
  onChange,
  options,
  accent = "#0d5c63",
  className = "",
  size = "md",
  ariaLabel = "Segmented control",
}) {
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div
      className={[
        "segmented-control",
        `segmented-control--${size}`,
        className.trim(),
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ "--seg-accent": accent }}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {safeOptions.map((opt) => {
        const isActive = opt.value === value;
        const isDisabled = Boolean(opt.disabled);
        return (
          <button
            key={String(opt.value)}
            type="button"
            className={[
              "segmented-control__option",
              isActive ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            role="radio"
            aria-checked={isActive}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange?.(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

SegmentedControl.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      disabled: PropTypes.bool,
    }),
  ).isRequired,
  accent: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md"]),
  ariaLabel: PropTypes.string,
};

