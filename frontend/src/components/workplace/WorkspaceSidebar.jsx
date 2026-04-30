import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LabelContainer from "./label/LabelContainer";
import MemberContainer from "./member/MemberContainer";
import { useLabelStore } from "../../stores/useLabelStore";
import { useMemberStore } from "../../stores/useMemberStore";
import { useAuthStore } from "../../stores/useAuthStore";

const WorkspaceSidebar = () => {
  const labels = useLabelStore((state) => state.labels);
  const members = useMemberStore((state) => state.members);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="w-72 border-l bg-background flex flex-col">
      <Tabs defaultValue="labels" className="flex flex-col h-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-2 h-10">
          <TabsTrigger value="labels" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none">
            Labels
          </TabsTrigger>
          <TabsTrigger value="members" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none">
            Members
          </TabsTrigger>
        </TabsList>
        <TabsContent value="labels" className="flex-grow overflow-hidden m-0">
          <LabelContainer labels={labels} />
        </TabsContent>
        <TabsContent value="members" className="flex-grow overflow-hidden m-0">
          <MemberContainer 
            members={members.filter(member => member.email !== user?.email)} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkspaceSidebar;
