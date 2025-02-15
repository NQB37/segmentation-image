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
                {/* <div className="group w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center relative">
                    <i className="fas fa-user"></i>
                    <div className="group-hover:visible invisible absolute top-full right-0">
                        <button className="px-8 py-2 bg-white border-b border-black hover:bg-gray-100 cursor-pointer">
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-8 py-2 bg-white border-b border-black hover:bg-gray-100 cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div> */}
                <DropdownProfile />
            </div>
        </header>
    );
};

export default Header;
