import { useState } from "react";
import BtnRed from "../../../Share/BtnRed";
import BtnGray from "../../../Share/BtnGray";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useMemberContext } from "../../../../hooks/useMemberContext";
import { useParams } from "react-router-dom";

const DeleteMemberModal = ({ _id }) => {
  const [isOpened, setIsOpened] = useState(false);

  const toggleModal = () => {
    setIsOpened(!isOpened);
  };

  // board id
  const { id } = useParams();
  const { membersDispatch } = useMemberContext();
  const { user } = useAuthContext();
  const handleDeleteMember = async (_id) => {
    toggleModal();
    try {
      const res = await axios.delete(
        `http://localhost:3700/api/boardRoute/${id}/member/${_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      membersDispatch({ type: "DELETE_MEMBER", payload: res.data });
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred (FE).");
    }
  };

  return (
    <div>
      <button onClick={toggleModal}>
        <i className="fa-solid fa-trash"></i>
      </button>
      {isOpened && (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
          <div className="w-[450px] h-fit bg-white flex flex-col justify-between">
            {/* header */}
            <div className="p-6 flex justify-between">
              <p className="font-semibold">Delete</p>
              <button onClick={toggleModal}>
                <i className="fa-solid fa-x"></i>
              </button>
            </div>
            {/* body */}
            <div className="grow border-y border-gray-400 px-6 py-3 flex flex-col gap-2">
              Do you want to remove this user from project?
            </div>
            {/* footer */}
            <div className="p-6 flex gap-6">
              <BtnGray text="Cancle" onClick={toggleModal} />
              <BtnRed
                text="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMember(_id);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteMemberModal;
