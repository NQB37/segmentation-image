import AddMemberModal from "./form/AddMemberModal";
import DeleteMemberModal from "./form/DeleteMemberModal";

const MemberContainer = ({ members }) => {
  return (
    <div>
      <div className="px-4 py-2 flex justify-between border-b border-black ">
        <div className="font-bold">User</div>
        <AddMemberModal />
      </div>

      <div className="px-4 py-2 overflow-y-scroll hide-scrollbar space-y-2">
        {members.map((member) => (
          <div
            key={member._id}
            className="p-1 flex justify-between hover border-b border-black"
          >
            <div className="flex items-center space-x-2">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-8 h-8 rounded-full"
              />
              <div>{member.name}</div>
            </div>
            <DeleteMemberModal _id={member._id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberContainer;
