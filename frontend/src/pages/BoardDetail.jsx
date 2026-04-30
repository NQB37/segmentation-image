import Header from "../components/Share/Header";
import ToolPropertiesBar from "../components/workplace/toolbox/ToolPropertiesBar";
import ToolboxContainer from "../components/workplace/toolbox/ToolboxContainer";
import CanvasContainer from "../components/workplace/canvas/CanvasContainer";
import WorkspaceSidebar from "../components/workplace/WorkspaceSidebar";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "../components/Share/Loading";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect } from "react";
import { useCanvasContext } from "../hooks/useCanvasContext";
import { useLabelStore } from "../stores/useLabelStore";
import { useMemberStore } from "../stores/useMemberStore";
import { isBoardOwner } from "../lib/boardPermissions";

const BoardDetailPage = () => {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const setLabels = useLabelStore((state) => state.setLabels);
  const setMembers = useMemberStore((state) => state.setMembers);
  const { handleLoadImage } = useCanvasContext();

  const { data, isLoading } = useFetch(`/api/boardRoute/${id}`, {
    headers: { Authorization: `Bearer ${user?.token}` },
  });

  useEffect(() => {
    if (data) {
      handleLoadImage("background", data.image);
      handleLoadImage("annotation", data.annotationImage);
      setLabels(data.labelsId);
      setMembers(data.membersId);
    }
  }, [data, handleLoadImage, setLabels, setMembers]);

  if (isLoading) return <Loading />;

  const isOwner = isBoardOwner(data, user);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header />
      <ToolPropertiesBar />
      
      <div className="flex flex-grow overflow-hidden">
        <ToolboxContainer />
        <main className="flex-grow relative bg-slate-50 overflow-hidden">
          <CanvasContainer />
        </main>
        <WorkspaceSidebar isOwner={isOwner} />
      </div>
    </div>
  );
};

export default BoardDetailPage;
