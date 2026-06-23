import { useDispatch } from 'react-redux';
import { setPage } from '../redux/employeeSlice';

const Pagination = ({ pagination }) => {
  const dispatch = useDispatch();
  const { page, totalPages, total, limit } = pagination;

  if (total === 0) return null;

  const rangeStart = (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e9e4da] px-4 py-3 text-sm text-[#6b6258] sm:flex-row">
      <span>
        Showing <span className="font-medium text-[#15191E]">{rangeStart}–{rangeEnd}</span> of{' '}
        <span className="font-medium text-[#15191E]">{total}</span> employees
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => dispatch(setPage(page - 1))}
          disabled={page <= 1}
          className="rounded-md border border-[#dcd6cb] px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#D98E3F]"
        >
          Prev
        </button>
        <span className="px-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => dispatch(setPage(page + 1))}
          disabled={page >= totalPages}
          className="rounded-md border border-[#dcd6cb] px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#D98E3F]"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
