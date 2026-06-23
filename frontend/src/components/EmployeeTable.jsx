const DEPARTMENT_COLORS = {
  Engineering: '#3B6E91',
  'Human Resources': '#9C5B8E',
  Sales: '#3F8F5C',
  Marketing: '#C2592E',
  Finance: '#7A6A2E',
  Operations: '#5A5F8A',
  'Customer Support': '#3F8F8A',
  IT: '#6C5BA6',
  Other: '#8A8377',
};

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  if (employees.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="font-display text-base font-medium text-[#15191E]">No employee records found</p>
        <p className="mt-1 text-sm text-[#6b6258]">
          Try a different search term, or add a new employee to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead>
          <tr className="border-b border-[#e9e4da] text-xs uppercase tracking-wide text-[#9b9385]">
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Department</th>
            <th className="px-4 py-3 font-medium">Designation</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Joined</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp._id}
              className="border-b border-[#f0ece3] transition hover:bg-[#FBF9F6]"
              style={{ borderLeft: `3px solid ${DEPARTMENT_COLORS[emp.department] || '#8A8377'}` }}
            >
              <td className="px-4 py-3">
                <div className="font-medium text-[#15191E]">{emp.fullName}</div>
                <div className="text-xs text-[#9b9385]">{emp.email}</div>
              </td>
              <td className="px-4 py-3">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    color: DEPARTMENT_COLORS[emp.department] || '#8A8377',
                    backgroundColor: `${DEPARTMENT_COLORS[emp.department] || '#8A8377'}1A`,
                  }}
                >
                  {emp.department}
                </span>
              </td>
              <td className="px-4 py-3 text-[#15191E]">{emp.designation}</td>
              <td className="px-4 py-3 text-[#15191E]">{emp.mobileNumber}</td>
              <td className="px-4 py-3 text-[#15191E]">{formatDate(emp.joiningDate)}</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(emp)}
                  className="mr-3 text-xs font-medium text-[#15191E] underline-offset-2 hover:text-[#D98E3F] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(emp)}
                  className="text-xs font-medium text-red-600 underline-offset-2 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile card list */}
      <div className="divide-y divide-[#f0ece3] md:hidden">
        {employees.map((emp) => (
          <div
            key={emp._id}
            className="p-4"
            style={{ borderLeft: `3px solid ${DEPARTMENT_COLORS[emp.department] || '#8A8377'}` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-[#15191E]">{emp.fullName}</p>
                <p className="text-xs text-[#9b9385]">{emp.email}</p>
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  color: DEPARTMENT_COLORS[emp.department] || '#8A8377',
                  backgroundColor: `${DEPARTMENT_COLORS[emp.department] || '#8A8377'}1A`,
                }}
              >
                {emp.department}
              </span>
            </div>
            <dl className="mt-2 grid grid-cols-2 gap-1 text-xs text-[#6b6258]">
              <dt>Designation</dt>
              <dd className="text-right text-[#15191E]">{emp.designation}</dd>
              <dt>Mobile</dt>
              <dd className="text-right text-[#15191E]">{emp.mobileNumber}</dd>
              <dt>Joined</dt>
              <dd className="text-right text-[#15191E]">{formatDate(emp.joiningDate)}</dd>
            </dl>
            <div className="mt-3 flex justify-end gap-3">
              <button onClick={() => onEdit(emp)} className="text-xs font-medium text-[#15191E] hover:text-[#D98E3F]">
                Edit
              </button>
              <button onClick={() => onDelete(emp)} className="text-xs font-medium text-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EmployeeTable;
