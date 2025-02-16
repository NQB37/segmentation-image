import { Link } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import DropdownProfile from './DropdownProfile';

const Header = () => {
    return (
        <header className="bg-gray-300 p-4 flex justify-between items-center">
            <Link to="/board" className="text-xl font-bold">
                NGU0188
            </Link>
            <div className="flex gap-4 items-center">
                <div className="cursor-pointer">
                    <i className="fa-solid fa-bell"></i>
                </div>
                <DropdownProfile />
            </div>
        </header>
    );
};

export default Header;
