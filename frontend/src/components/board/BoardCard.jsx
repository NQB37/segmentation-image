import { useNavigate } from 'react-router-dom';
import DeleteBoard from './form/DeleteBoard';
import LeaveBoard from './form/LeaveBoard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { isBoardOwner } from '@/lib/boardPermissions';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Crown, UserCheck, Users } from 'lucide-react';

const BoardCard = ({ board, user }) => {
    const navigate = useNavigate();
    const memberCount = board.membersId?.length || 0;
    const isOwner = isBoardOwner(board, user);
    const roleBadge = isOwner
        ? {
              label: 'Owner',
              Icon: Crown,
              className: 'bg-primary/90 text-primary-foreground shadow-sm',
          }
        : {
              label: 'Member',
              Icon: UserCheck,
              className: 'bg-background/90 text-foreground shadow-sm',
          };
    const updatedAt = board.updatedAt
        ? new Date(board.updatedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          })
        : 'Not saved';

    const handleCardClick = () => {
        navigate(`/board/${board._id}`);
    };

    return (
        <Card
            role="button"
            tabIndex="0"
            onClick={handleCardClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick();
                }
            }}
            className="group cursor-pointer gap-0 p-0 transition-all duration-200 hover:-translate-y-0.5 hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-muted">
                <img
                    src={board.image}
                    alt={board.title}
                    className="size-full object-contain object-center p-3 transition duration-200 group-hover:scale-[1.02]"
                />
                <Badge
                    variant="secondary"
                    className="absolute left-3 top-3 gap-1 bg-background/90 shadow-sm"
                >
                    <Users className="size-3" />
                    {memberCount} {memberCount === 1 ? 'member' : 'members'}
                </Badge>
                {user?._id && (
                    <Badge
                        variant={isOwner ? 'default' : 'secondary'}
                        className={`absolute right-3 top-3 gap-1 ${roleBadge.className}`}
                    >
                        <roleBadge.Icon className="size-3" />
                        {roleBadge.label}
                    </Badge>
                )}
            </div>

            <CardHeader className="p-4">
                <CardTitle className="truncate">{board.title}</CardTitle>
                <CardDescription>Updated {updatedAt}</CardDescription>
                <CardAction
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    {isOwner ? (
                        <DeleteBoard _id={board._id} />
                    ) : (
                        <LeaveBoard _id={board._id} />
                    )}
                </CardAction>
            </CardHeader>

            <CardContent className="pb-4">
                <Badge
                    variant="outline"
                    className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Ready
                </Badge>
            </CardContent>

            <CardFooter className="justify-end bg-muted/40">
                <Button variant="ghost" size="sm" className="text-primary">
                    Open
                    <ArrowRight data-icon="inline-end" className="size-3.5" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default BoardCard;
