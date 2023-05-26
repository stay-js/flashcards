export const PaginationButton: React.FC<{
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}> = ({ direction, disabled, onClick }) => (
  <button
    className="select-none rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-50"
    disabled={disabled}
    onClick={onClick}
  >
    {direction === 'prev' ? 'Prev' : 'Next'}
  </button>
);
