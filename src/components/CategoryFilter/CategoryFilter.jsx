import "./CategoryFilter.css";

export default function CategoryFilter({ value, onChange, categories }) {
  return (
    <label className="filterWrap">
      <span className="srOnly">Filter menu by category</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter menu by category"
      >
        <option value="All">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </label>
  );
}