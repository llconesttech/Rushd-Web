import React from "react";
import PropTypes from "prop-types";
import { Search } from "lucide-react";

const SearchInput = ({
  // Reusable API
  onSubmit,
  value,
  onChange,
  placeholder = "Search...",
  className = "topbar-search-form mobile-menu-search",
  inputClassName = "",
  iconSize = 16,
  showIcon = true,
  inputType = "text",
  // Backward compatibility (existing AppShell usage)
  handleMobileSearch,
  mobileSearchQuery,
  setMobileSearchQuery,
}) => {
  const submitHandler = onSubmit || handleMobileSearch;
  const inputValue =
    value !== undefined ? value : mobileSearchQuery !== undefined ? mobileSearchQuery : "";
  const inputChangeHandler =
    onChange || (setMobileSearchQuery ? (e) => setMobileSearchQuery(e.target.value) : undefined);

  return (
    <form className={className} onSubmit={submitHandler}>
      {showIcon && <Search size={iconSize} />}
      <input
        type={inputType}
        placeholder={placeholder}
        value={inputValue}
        onChange={inputChangeHandler}
        className={inputClassName}
      />
    </form>
  );
};

SearchInput.propTypes = {
  onSubmit: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  iconSize: PropTypes.number,
  showIcon: PropTypes.bool,
  inputType: PropTypes.string,
  handleMobileSearch: PropTypes.func,
  mobileSearchQuery: PropTypes.string,
  setMobileSearchQuery: PropTypes.func,
};

export default SearchInput;
