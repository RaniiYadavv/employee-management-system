import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch, setDepartmentFilter, setSort } from '../redux/employeeSlice';
import { DEPARTMENTS } from './EmployeeFormModal';

const SearchAndFilterBar = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.employees.filters);
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce search-as-you-type to avoid firing a request on every keystroke
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    clearTimeout(window.__empSearchTimer);
    window.__empSearchTimer = setTimeout(() => dispatch(setSearch(value)), 400);
  };

  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split(':');
    dispatch(setSort({ sortBy, order }));
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <input
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search by name…"
          aria-label="Search employees by name"
          className="w-full rounded-md border border-[#dcd6cb] bg-white px-3 py-2 pl-9 text-sm text-[#15191E] outline-none transition focus:border-[#D98E3F]"
        />
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a39c8f]">⌕</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filters.department}
          onChange={(e) => dispatch(setDepartmentFilter(e.target.value))}
          aria-label="Filter by department"
          className="rounded-md border border-[#dcd6cb] bg-white px-3 py-2 text-sm text-[#15191E] outline-none focus:border-[#D98E3F]"
        >
          <option value="">All departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={`${filters.sortBy}:${filters.order}`}
          onChange={handleSortChange}
          aria-label="Sort employees"
          className="rounded-md border border-[#dcd6cb] bg-white px-3 py-2 text-sm text-[#15191E] outline-none focus:border-[#D98E3F]"
        >
          <option value="createdAt:desc">Newest first</option>
          <option value="createdAt:asc">Oldest first</option>
          <option value="fullName:asc">Name A–Z</option>
          <option value="fullName:desc">Name Z–A</option>
          <option value="joiningDate:desc">Joining date (latest)</option>
          <option value="joiningDate:asc">Joining date (earliest)</option>
          <option value="department:asc">Department A–Z</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilterBar;
