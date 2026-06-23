const Loader = ({ label = 'Loading' }) => (
  <div className="flex items-center justify-center gap-2 py-10 text-sm text-[#6b6258]">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#d4d0c8] border-t-[#D98E3F]" />
    {label}…
  </div>
);

export default Loader;
