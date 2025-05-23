import AddMemberModal from './form/AddMemberModal';

const MemberContainer = ({ members }) => {
    const handleDeleteMember = async (_id) => {};
    return (
        <div>
            <div className="px-4 py-2 flex justify-between border-b border-black ">
                <div className="font-bold">User</div>
                <AddMemberModal />
            </div>

            <div className="px-4 py-2 overflow-y-scroll hide-scrollbar space-y-2">
                {members.map((member) => {
                    <div className="p-1 flex justify-between hover border-b border-black">
                        <div key={member._id}>
                            <img src={member.avatar} alt={member.name} />
                            <div>{member.name}</div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMember(member._id);
                                }}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                        ;
                    </div>;
                })}
            </div>
        </div>
    );
};

export default MemberContainer;
