import { ScrollArea } from "../../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import AddMemberModal from "./form/AddMemberModal";
import DeleteMemberModal from "./form/DeleteMemberModal";

const MemberContainer = ({ members, isOwner }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 flex justify-between items-center border-b bg-muted/30">
        <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Collaborators</span>
        {isOwner && <AddMemberModal />}
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-2 space-y-1">
          {members.map((member) => (
            <div key={member._id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted group">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">{member.name}</div>
              </div>
              {isOwner && <DeleteMemberModal member={member} />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MemberContainer;
