import { Link } from 'react-router-dom';
import DropdownProfile from './DropdownProfile';
import Notification from './Notification';
import { Badge } from '@/components/ui/badge';
import { Microscope } from 'lucide-react';

const Header = () => {
  return (
    <header className='sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80'>
      <div className='container mx-auto flex h-16 items-center justify-between'>
        <Link
          to='/board'
          className='flex items-center gap-3 rounded-lg outline-none transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/50'
        >
          <span className='flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
            <Microscope className='size-5' />
          </span>
          <div className='flex items-center gap-2'>
            <span className='text-xl font-semibold tracking-tight'>
              CellSeg
            </span>
            <Badge
              variant='secondary'
              className='hidden rounded-md px-1.5 sm:inline-flex'
            >
              Workspace
            </Badge>
          </div>
        </Link>

        <div className='flex items-center gap-2'>
          <Notification />
          <DropdownProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;
