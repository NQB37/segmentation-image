import Header from "../components/Share/Header";
import ToolPropertiesBar from "../components/workplace/toolbox/ToolPropertiesBar";
import ToolboxContainer from "../components/workplace/toolbox/ToolboxContainer";
import CanvasContainer from "../components/workplace/canvas/CanvasContainer";
import WorkspaceSidebar from "../components/workplace/WorkspaceSidebar";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "../components/Share/Loading";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect } from "react";
import { useCanvasContext } from "../hooks/useCanvasContext";
import { useLabelContext } from "../hooks/useLabelContext";
import { useMemberContext } from "../hooks/useMemberContext";

const BoardDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { labelsDispatch } = useLabelContext();
  const { membersDispatch } = useMemberContext();
  const { handleLoadImage } = useCanvasContext();

  const { data, isLoading } = useFetch(`/api/boardRoute/${id}`, {
    headers: { Authorization: `Bearer ${user?.token}` },
  });

  useEffect(() => {
    if (data) {
      handleLoadImage("background", data.image);
      handleLoadImage("annotation", data.annotationImage);
      labelsDispatch({ type: "SET_LABELS", payload: data.labelsId });
      membersDispatch({ type: "SET_MEMBERS", payload: data.membersId });
    }
  }, [data]);

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header />
      <ToolPropertiesBar />
      
      <div className="flex flex-grow overflow-hidden">
        <ToolboxContainer />
        <main className="flex-grow relative bg-slate-50 overflow-hidden">
          <CanvasContainer />
        </main>
        <WorkspaceSidebar />
      </div>
    </div>
  );
};

export default BoardDetailPage;
