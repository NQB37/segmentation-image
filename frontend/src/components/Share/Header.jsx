import { Link } from 'react-router-dom';
import DropdownProfile from './DropdownProfile';
import Notification from './Notification';

const Header = () => {
  return (
    <header className='bg-gray-300 py-4'>
      <div className='container mx-auto flex justify-between'>
        <Link to='/board' className='text-4xl font-bold'>
          CellSeg
        </Link>
        <div className='flex gap-8 items-center'>
          <Notification />
          <DropdownProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;
