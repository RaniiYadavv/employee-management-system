import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import SearchAndFilterBar from '../components/SearchAndFilterBar';
import EmployeeTable from '../components/EmployeeTable';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import EmployeeFormModal from '../components/EmployeeFormModal';
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  clearEmployeeError,
} from '../redux/employeeSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items, pagination, filters, status, mutationStatus, error } = useSelector(
    (state) => state.employees
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch, filters, pagination.page]);

  const openAddModal = () => {
    setActiveEmployee(null);
    dispatch(clearEmployeeError());
    setModalOpen(true);
  };

  const openEditModal = (emp) => {
    setActiveEmployee(emp);
    dispatch(clearEmployeeError());
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveEmployee(null);
  };

  const handleSubmit = async (formData) => {
    const action = activeEmployee
      ? updateEmployee({ id: activeEmployee._id, employeeData: formData })
      : createEmployee(formData);

    const result = await dispatch(action);
    if (!result.error) {
      closeModal();
      dispatch(fetchEmployees());
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteEmployee(deleteTarget._id));
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-[#F6F4F0]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#15191E]">Employee directory</h2>
            <p className="text-sm text-[#6b6258]">Add, search, and manage employee records.</p>
          </div>
          <button
            onClick={openAddModal}
            className="rounded-md bg-[#15191E] px-4 py-2 text-sm font-medium text-[#F6F4F0] transition hover:bg-[#D98E3F]"
          >
            + Add employee
          </button>
        </div>

        <div className="mb-4 rounded-xl border border-[#e9e4da] bg-white p-4">
          <SearchAndFilterBar />
        </div>

        <div className="overflow-hidden rounded-xl border border-[#e9e4da] bg-white">
          {status === 'loading' ? (
            <Loader label="Fetching employees" />
          ) : status === 'failed' ? (
            <div className="px-4 py-10 text-center text-sm text-red-600">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <EmployeeTable employees={items} onEdit={openEditModal} onDelete={setDeleteTarget} />
              </div>
              <Pagination pagination={pagination} />
            </>
          )}
        </div>
      </main>

      {modalOpen && (
        <EmployeeFormModal
          employee={activeEmployee}
          onClose={closeModal}
          onSubmit={handleSubmit}
          isSubmitting={mutationStatus === 'loading'}
          serverError={mutationStatus === 'failed' ? error : null}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-[#FBF9F6] p-6 shadow-xl">
            <h3 className="font-display text-base font-semibold text-[#15191E]">Delete this record?</h3>
            <p className="mt-1 text-sm text-[#6b6258]">
              This will permanently remove <span className="font-medium">{deleteTarget.fullName}</span> from
              the employee directory.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-[#dcd6cb] px-4 py-2 text-sm font-medium hover:bg-[#eee9e0]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
