import Link from 'next/link';

type Variant = 'red' | 'green' | 'blue';

const computeClasses = (variant: Variant) => {
  const base =
    'whitespace-nowrap rounded border-2 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-transparent';

  switch (variant) {
    case 'red':
      return `${base} border-red-500 bg-red-500 hover:text-red-500`;
    case 'green':
      return `${base} border-green-500 bg-green-500 hover:text-green-500`;
    case 'blue':
      return `${base} border-blue-700 bg-blue-700 hover:text-blue-700`;
  }
};

export const Button: React.FC<{
  onClick?: () => void;
  href?: string;
  variant?: Variant;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}> = ({ onClick, href, variant = 'blue', type = 'button', children }) => {
  if (href) {
    return (
      <Link className={computeClasses(variant)} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={computeClasses(variant)} onClick={onClick}>
      {children}
    </button>
  );
};
