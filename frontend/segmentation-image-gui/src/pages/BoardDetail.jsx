import LabelContainer from '../components/workplace/label/LabelContainer';
import { useCanvasContext } from '../hooks/useCanvasContext';
import ToolboxContainer from '../components/workplace/toolbox/ToolboxContainer';
import CanvasContainer from '../components/workplace/canvas/CanvasContainer';
import SegmentContainer from '../components/workplace/segmentation/SegmentContainer';
import Header from '../components/Share/Header';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Share/Loading';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect } from 'react';
import MemberContainer from '../components/workplace/member/MemberContainer';
import { useLabelContext } from '../hooks/useLabelContext';
import { useMemberContext } from '../hooks/useMemberContext';

const BoardDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuthContext();
    const { labels, labelsDispatch } = useLabelContext();
    const { members, membersDispatch } = useMemberContext();
    const { handleLoadImage } = useCanvasContext();

    const { data, isLoading, error } = useFetch(
        `http://localhost:3700/api/boardRoute/${id}`,
        {
            headers: { Authorization: `Bearer ${user?.token}` },
        },
    );

    useEffect(() => {
        if (data) {
            console.log(data);
            handleLoadImage('background', data.image);
            handleLoadImage('annotation', data.annotationImage);
            labelsDispatch({ type: 'SET_LABELS', payload: data.labelsId });
            membersDispatch({ type: 'SET_MEMBERS', payload: data.membersId });
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
                                {/* segmentation */}
                                <div className="h-fit">
                                    <SegmentContainer />
                                </div>
                                {/* user */}
                                <div className="h-1/3">
                                    <MemberContainer members={members} />
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
