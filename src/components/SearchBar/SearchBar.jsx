import "./SearchBar.css";

export default function SearchBar({ value, onChange }) {
  return (
    <label className="searchWrap">
      <span className="srOnly">Search menu items by name</span>
      <input
        type="text"
        placeholder="Search by item name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search menu items by name"
      />
    </label>
  );
}