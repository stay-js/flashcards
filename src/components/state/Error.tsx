import { TbAlertCircle } from 'react-icons/tb';

export const Error: React.FC = () => (
  <div className="flex flex-col items-center gap-2">
    <TbAlertCircle size={48} color="red" className="animate-bounce" />
    Something went wrong... try again later!
  </div>
);
