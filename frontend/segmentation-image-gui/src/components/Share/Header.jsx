import { Link } from 'react-router-dom';
import DropdownProfile from './DropdownProfile';

const Header = () => {
    return (
        <header className="bg-gray-300 p-4 flex justify-between items-center">
            <Link to="/board" className="text-4xl font-bold">
                CellSeg
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
