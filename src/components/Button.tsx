import Link from 'next/link';

const computeVariantClasses = (variant?: string) => {
  switch (variant) {
    case 'red':
      return 'border-red-500 bg-red-500 hover:text-red-500';
    case 'green':
      return 'border-green-500 bg-green-500 hover:text-green-500';
    default:
      return 'border-blue-700 bg-blue-700 hover:text-blue-700';
  }
};

export const Button: React.FC<{
  onClick?: () => void;
  href?: string;
  variant?: 'blue' | 'red' | 'green';
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}> = ({ onClick, href, variant, type = 'button', children }) => {
  if (href) {
    return (
      <Link
        className={`whitespace-nowrap rounded border-2 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-transparent
        ${computeVariantClasses(variant)}`}
        href={href}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={`whitespace-nowrap rounded border-2 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-transparent
      ${computeVariantClasses(variant)}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
