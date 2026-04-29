import LabelContainer from "../components/workplace/label/LabelContainer";
import { useCanvasContext } from "../hooks/useCanvasContext";
import ToolboxContainer from "../components/workplace/toolbox/ToolboxContainer";
import CanvasContainer from "../components/workplace/canvas/CanvasContainer";
import Header from "../components/Share/Header";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "../components/Share/Loading";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect } from "react";
import MemberContainer from "../components/workplace/member/MemberContainer";
import { useLabelContext } from "../hooks/useLabelContext";
import { useMemberContext } from "../hooks/useMemberContext";

const BoardDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { labels, labelsDispatch } = useLabelContext();
  const { members, membersDispatch } = useMemberContext();
  const { handleLoadImage } = useCanvasContext();

  const { data, isLoading, error } = useFetch(
    `/api/boardRoute/${id}`,
    {
      headers: { Authorization: `Bearer ${user?.token}` },
    }
  );

  useEffect(() => {
    if (data) {
      handleLoadImage("background", data.image);
      handleLoadImage("annotation", data.annotationImage);
      labelsDispatch({ type: "SET_LABELS", payload: data.labelsId });
      membersDispatch({ type: "SET_MEMBERS", payload: data.membersId });
    }
  }, [data]);
  return (
    <div>
      <Header />
      <>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-col h-screen">
            {/* tool box */}
            <ToolboxContainer />
            <div className="flex grow">
              {/* canvas field */}
              <CanvasContainer />
              {/* label/user field */}
              <div className="w-1/6 flex flex-col border-l border-black">
                {/* label */}
                <div className="h-1/3">
                  <LabelContainer labels={labels} />
                </div>
                {/* Segmentation controls stay hidden until inference and mask rendering are implemented. */}
                {/* user */}
                <div className="h-1/3">
                  <MemberContainer
                    members={members.filter(
                      (member) => member.email !== user.email
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default BoardDetailPage;
