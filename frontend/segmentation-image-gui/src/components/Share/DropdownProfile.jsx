import { useEffect, useRef, useState } from 'react';
import { useLogout } from '../../hooks/useLogout';
import { Link } from 'react-router-dom';

const DropdownProfile = () => {
    const { logout } = useLogout();
    const handleLogout = () => {
        logout();
    };
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div ref={dropdownRef} className="group relative">
            {/* dropdown button  */}
            <button
                onClick={toggleDropdown}
                className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-black"
            >
                {/* <img src="" alt="" className="w-full object-cover"/> */}
            </button>
            {/* dropdown menu  */}
            {isOpen && (
                <div
                    className={`absolute right-0 top-full mt-1 rounded flex flex-col border border-black`}
                >
                    <Link
                        to="/profile"
                        className="px-8 py-2 bg-white border-b border-black rounded-t hover:bg-gray-100 cursor-pointer"
                    >
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="px-8 py-2 bg-white rounded-b hover:bg-gray-100 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default DropdownProfile;
