import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-[#e3ddd2] bg-[#15191E]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#D98E3F]" />
          <h1 className="font-display text-lg font-semibold tracking-tight text-[#F6F4F0]">
            Roster<span className="text-[#D98E3F]">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden text-sm text-[#b7b0a3] sm:inline">
            Signed in as <span className="text-[#F6F4F0]">{user?.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="rounded-md border border-[#3a3f47] px-3 py-1.5 text-sm font-medium text-[#F6F4F0] transition hover:border-[#D98E3F] hover:text-[#D98E3F]"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
