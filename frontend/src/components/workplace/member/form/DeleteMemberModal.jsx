import { useState } from "react";
import { toast } from "react-toastify";
import apiClient from "../../../../api/client";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useMemberContext } from "../../../../hooks/useMemberContext";
import { useParams } from "react-router-dom";
import { Trash2, UserX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DeleteMemberModal = ({ _id }) => {
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const { membersDispatch } = useMemberContext();
  const { user } = useAuthContext();

  const handleDeleteMember = async () => {
    try {
      const res = await apiClient.delete(
        `/api/boardRoute/${id}/member/${_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      membersDispatch({ type: "DELETE_MEMBER", payload: res.data });
      toast.success("Member removed successfully");
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred (FE).");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm p-1"
          aria-label="Remove member"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0">
        <div className="p-6 pt-8">
          <DialogHeader className="flex flex-col items-center gap-4 text-center">
            {/* UserX icon in a red circular background at the top center */}
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2" aria-hidden="true">
              <UserX className="w-8 h-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold tracking-tight">Remove Member?</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Are you sure you want to remove this user from the project? They will lose all access immediately.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>
        <DialogFooter className={cn(
          "flex flex-col gap-2 p-6 pt-2 sm:flex-col sm:justify-center border-none bg-transparent m-0"
        )}>
          {/* Full-width red "Yes, Remove Member" button */}
          <Button 
            className="w-full py-6 text-base font-semibold bg-red-600 text-white hover:bg-red-700 transition-all active:scale-[0.98]"
            onClick={handleDeleteMember}
          >
            Yes, Remove Member
          </Button>
          {/* "Keep Member" ghost/outline button */}
          <Button 
            variant="ghost" 
            className="w-full py-6 text-base font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            Keep Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMemberModal;
