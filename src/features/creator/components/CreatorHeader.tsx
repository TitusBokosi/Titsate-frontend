import React from 'react';
import CreateCourseButton from './CreateCourseButton';
import CreateCourseModal from './CreateCourseModal';

type Props = {
  onCreate: (
    title: string,
    description?: string,
    categoryId?: string | null,
  ) => Promise<any> | any;
  isProcessing?: boolean;
};

import { useAuthContext } from '@/providers/AuthProvider';

export function CreatorHeader({ onCreate, isProcessing }: Props) {
  const [showModal, setShowModal] = React.useState(false);
  const { user } = useAuthContext();
  const isSuperCreator = user?.role === 'SUPER_CREATOR';

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Creator Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {isSuperCreator 
            ? 'Manage your courses and curriculum directly.' 
            : 'Manage your courses and track their approval status.'}
        </p>
      </div>

      <CreateCourseButton
        onOpen={() => setShowModal(true)}
        disabled={isProcessing}
      />

      <CreateCourseModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={onCreate}
        isProcessing={isProcessing}
      />
    </div>
  );
}

export default CreatorHeader;
