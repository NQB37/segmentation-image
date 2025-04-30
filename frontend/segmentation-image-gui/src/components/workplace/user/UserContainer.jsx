import AddUserModal from './AddUserModal';

const UserContainer = () => {
    return (
        <div>
            <div className="px-4 py-2 flex justify-between border-b border-black ">
                <div className="font-bold">User</div>
                <AddUserModal />
            </div>

            <div className="px-4 py-2 overflow-y-scroll hide-scrollbar space-y-2">
                <div className="p-1 flex justify-between hover border-b border-black">
                    <div>You</div>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>
        </div>
    );
};

export default UserContainer;
