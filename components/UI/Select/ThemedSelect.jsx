"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import Select from "react-select";
import "./ThemedSelect.css";

const DEFAULT_ACCENT = "#0d5c63";

/**
 * Theme-aware react-select styles (Rushd light/dark via CSS variables).
 * Use directly when you need a custom Select with the same look.
 *
 * @param {string} [accent=DEFAULT_ACCENT] Focus ring / accent (hex)
 * @param {{ menuListMaxHeight?: number }} [opts]
 */
export function useThemedSelectStyles(accent = DEFAULT_ACCENT, opts = {}) {
  const { menuListMaxHeight = 280 } = opts;
  const [themeTick, setThemeTick] = useState(0);

  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setThemeTick((t) => t + 1));
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  return useMemo(() => {
    void themeTick;
    return {
      control: (base, state) => ({
        ...base,
        cursor: "pointer",
        fontFamily: "inherit",
        minHeight: 42,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: state.isFocused
          ? accent
          : "var(--border-color, #e5e7eb)",
        boxShadow: "none",
        backgroundColor: "var(--card-bg, var(--color-bg-card, #fff))",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          borderColor: state.isFocused
            ? accent
            : "var(--border-color, #d1d5db)",
        },
      }),
      singleValue: (base) => ({
        ...base,
        color: "var(--text-primary, var(--color-text-main, #1a1a1a))",
        fontWeight: 600,
        fontSize: "0.875rem",
      }),
      placeholder: (base) => ({
        ...base,
        color: "var(--text-secondary, var(--color-text-muted, #5a6a72))",
        fontSize: "0.875rem",
      }),
      menu: (base) => ({
        ...base,
        borderRadius: 6,
        overflow: "hidden",
        marginTop: 6,
        zIndex: 10050,
        boxShadow:
          "0 12px 40px rgba(15, 23, 42, 0.14), 0 0 0 1px var(--border-color, #e5e7eb)",
        backgroundColor: "var(--card-bg, var(--color-bg-card, #fff))",
      }),
      menuList: (base) => ({
        ...base,
        padding: 6,
        maxHeight: menuListMaxHeight,
      }),
      option: (base, state) => ({
        ...base,
        cursor: "pointer",
        borderRadius: 4,
        margin: "2px 0",
        padding: "8px 12px",
        fontSize: "0.875rem",
        fontWeight: state.isSelected ? 600 : 500,
        color: "var(--text-primary, var(--color-text-main, #1a1a1a))",
        backgroundColor: state.isSelected
          ? `color-mix(in srgb, ${accent} 16%, var(--card-bg, #fff))`
          : state.isFocused
            ? "color-mix(in srgb, var(--border-color, #e5e7eb) 55%, var(--card-bg, #fff))"
            : "transparent",
        "&:active": {
          backgroundColor: `color-mix(in srgb, ${accent} 22%, var(--card-bg, #fff))`,
        },
      }),
      indicatorSeparator: () => ({ display: "none" }),
      dropdownIndicator: (base, state) => ({
        ...base,
        color: state.isFocused ? accent : "var(--text-secondary, #6b7280)",
        paddingRight: 10,
        "&:hover": { color: accent },
      }),
      valueContainer: (base) => ({
        ...base,
        paddingLeft: 12,
        paddingRight: 6,
      }),
      input: (base) => ({
        ...base,
        color: "var(--text-primary, var(--color-text-main, #1a1a1a))",
      }),
    };
  }, [accent, themeTick, menuListMaxHeight]);
}

function mergeSelectStyles(base, patch) {
  if (!patch) return base;
  const out = { ...base };
  for (const key of Object.keys(patch)) {
    const p = patch[key];
    const b = base[key];
    if (typeof p === "function") {
      out[key] = (provided, state) => {
        const layered =
          typeof b === "function" ? b(provided, state) : { ...provided };
        const extra = p(layered, state);
        return { ...layered, ...extra };
      };
    } else {
      out[key] = p;
    }
  }
  return out;
}

/**
 * Rushd-themed wrapper around react-select (light/dark, brand accent).
 *
 * @param {object} props
 * @param {string} [props.accent] Focus/accent color (hex)
 * @param {string} [props.label] Optional visible label (sets aria-labelledby)
 * @param {string} [props.labelId] Optional id for label (default: `${instanceId}-label`)
 * @param {string} [props.wrapperClassName] Class on outer wrapper (always a div when label set; optional when no label)
 * @param {string} [props.classNamePrefix] react-select BEM prefix (default `themed-rs`)
 * @param {boolean} [props.menuPortal] Portal menu to body (default true)
 * @param {number} [props.menuListMaxHeight]
 * @param {string} [props.instanceId] Stable id for SSR/hydration (optional; derived from useId)
 * @param {import('react-select').StylesConfig} [props.styles] Merged on top of built-in themed styles
 */
export default function ThemedSelect({
  accent = DEFAULT_ACCENT,
  label,
  labelId: labelIdProp,
  wrapperClassName = "",
  classNamePrefix = "themed-rs",
  menuPortal = true,
  menuListMaxHeight = 280,
  instanceId: instanceIdProp,
  styles: stylesFromParent,
  ...selectProps
}) {
  const rid = useId();
  const safe = rid.replace(/:/g, "");
  const instanceId = instanceIdProp ?? `themed-rs-${safe}`;
  const labelId = labelIdProp ?? `${instanceId}-label`;
  const inputId = `${instanceId}-input`;

  const builtIn = useThemedSelectStyles(accent, { menuListMaxHeight });
  const styles = mergeSelectStyles(builtIn, stylesFromParent);

  const {
    blurInputOnSelect = true,
    menuPosition: menuPositionProp,
    ...restSelectProps
  } = selectProps;

  const portalTarget =
    menuPortal && typeof document !== "undefined" ? document.body : undefined;

  const selectEl = (
    <Select
      {...restSelectProps}
      instanceId={instanceId}
      inputId={inputId}
      aria-labelledby={
        label ? labelId : (restSelectProps["aria-labelledby"] ?? undefined)
      }
      classNamePrefix={classNamePrefix}
      styles={styles}
      menuPortalTarget={portalTarget}
      menuPosition={menuPortal ? "fixed" : menuPositionProp}
      blurInputOnSelect={blurInputOnSelect}
    />
  );

  if (label) {
    return (
      <div
        className={["themed-select-wrapper", wrapperClassName.trim()]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="themed-select-label" id={labelId}>
          {label}
        </span>
        {selectEl}
      </div>
    );
  }

  if (wrapperClassName.trim()) {
    return <div className={wrapperClassName.trim()}>{selectEl}</div>;
  }

  return selectEl;
}
