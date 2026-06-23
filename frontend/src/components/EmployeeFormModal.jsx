import { useEffect, useState } from 'react';

export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Sales',
  'Marketing',
  'Finance',
  'Operations',
  'Customer Support',
  'IT',
  'Other',
];

const emptyForm = {
  fullName: '',
  email: '',
  mobileNumber: '',
  department: '',
  designation: '',
  joiningDate: '',
};

/**
 * Shared Add / Edit employee modal. When `employee` is provided, the form
 * is pre-filled and operates in edit mode.
 */
const EmployeeFormModal = ({ employee, onClose, onSubmit, isSubmitting, serverError }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setForm({
        fullName: employee.fullName || '',
        email: employee.email || '',
        mobileNumber: employee.mobileNumber || '',
        department: employee.department || '',
        designation: employee.designation || '',
        joiningDate: employee.joiningDate ? employee.joiningDate.slice(0, 10) : '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [employee]);

  const validate = () => {
    const next = {};
    if (form.fullName.trim().length < 2) next.fullName = 'Enter at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!/^[0-9]{10}$/.test(form.mobileNumber)) next.mobileNumber = 'Enter exactly 10 digits';
    if (!form.department) next.department = 'Select a department';
    if (!form.designation.trim()) next.designation = 'Designation is required';
    if (!form.joiningDate) next.joiningDate = 'Joining date is required';
    else if (new Date(form.joiningDate) > new Date()) next.joiningDate = 'Date cannot be in the future';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const fieldClass = (hasError) =>
    `w-full rounded-md border px-3 py-2 text-sm text-[#15191E] outline-none transition focus:border-[#D98E3F] ${
      hasError ? 'border-red-400' : 'border-[#dcd6cb]'
    }`;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-[#FBF9F6] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-[#15191E]">
            {employee ? 'Edit employee record' : 'Add a new employee'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close form"
            className="rounded-full p-1 text-[#6b6258] hover:bg-[#eee9e0]"
          >
            ✕
          </button>
        </div>

        {serverError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#6b6258]">Full name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={fieldClass(errors.fullName)}
              placeholder="e.g. Rani Yadav"
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#6b6258]">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={fieldClass(errors.email)}
                placeholder="name@company.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#6b6258]">Mobile number</label>
              <input
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
                className={fieldClass(errors.mobileNumber)}
                placeholder="10-digit number"
                maxLength={10}
              />
              {errors.mobileNumber && <p className="mt-1 text-xs text-red-600">{errors.mobileNumber}</p>}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#6b6258]">Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className={fieldClass(errors.department)}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.department && <p className="mt-1 text-xs text-red-600">{errors.department}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#6b6258]">Designation</label>
              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className={fieldClass(errors.designation)}
                placeholder="e.g. Software Engineer"
              />
              {errors.designation && <p className="mt-1 text-xs text-red-600">{errors.designation}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[#6b6258]">Joining date</label>
            <input
              name="joiningDate"
              type="date"
              value={form.joiningDate}
              onChange={handleChange}
              className={fieldClass(errors.joiningDate)}
              max={new Date().toISOString().slice(0, 10)}
            />
            {errors.joiningDate && <p className="mt-1 text-xs text-red-600">{errors.joiningDate}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#dcd6cb] px-4 py-2 text-sm font-medium text-[#15191E] hover:bg-[#eee9e0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-[#15191E] px-4 py-2 text-sm font-medium text-[#F6F4F0] transition hover:bg-[#D98E3F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : employee ? 'Save changes' : 'Add employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
