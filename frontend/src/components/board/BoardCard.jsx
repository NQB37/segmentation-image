import { useNavigate } from 'react-router-dom';
import DeleteBoard from './form/DeleteBoard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Users } from 'lucide-react';

const BoardCard = ({ board }) => {
    const navigate = useNavigate();
    const memberCount = board.membersId?.length || 0;
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
            </div>

            <CardHeader className="pt-4">
                <CardTitle className="truncate">{board.title}</CardTitle>
                <CardDescription>Updated {updatedAt}</CardDescription>
                <CardAction
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    <DeleteBoard _id={board._id} />
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
