import Arrow from '@assets/icons/arrow.svg?react';
import {
  JobViewRequest,
  useJobViewQuery,
  useNoJobViewQuery,
} from '@hook/useJobQuery';
import LoadingSpinner from '@common/LoadingSpinner';
import { useState } from 'react';
import SelectModal from '@common/modal/SelectModal';
import { useFilterStore } from '@store/filterStore';
import { useNavigate } from 'react-router-dom';

interface JobViewComponentProps {
  jobName: string;
}

const JobView = ({ jobName }: JobViewComponentProps) => {
  const [selectedItem, setSelectedItem] = useState<JobViewRequest | null>(null);
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const query = isLoggedIn ? useJobViewQuery : useNoJobViewQuery;
  const { data: jobView, isLoading, error } = query(jobName);
  const setSelection = useFilterStore((state) => state.setSelection);
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  if (error) return <div>에러가 발생했어요.</div>;

  return (
    <div className="mt-[70px] flex w-full flex-col items-start gap-[50px]">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="text-gray-900 font-T02-B">
          {' '}
          {jobName}의 일자리 둘러보기
        </div>
        <div
          className="flex cursor-pointer flex-row items-center"
          onClick={() => {
            setSelection('job', jobName);
            navigate('/jobsearch');
          }}
        >
          <div className="text-gray-500 font-B02-SB"> 더 보러가기 </div>
          <Arrow className="h-9 w-9" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {jobView && jobView.length > 0 ? (
          jobView.slice(0, 3).map((view) => (
            <div
              key={view.id}
              onClick={() => setSelectedItem(view)}
              className="flex h-auto w-full cursor-pointer flex-col items-start rounded-[30px] border-2 border-gray-200 p-[30px] hover:shadow-shadow2"
            >
              <div className="self-end rounded-[10px] bg-purple-100 px-[10px] py-2 text-purple-500 font-B01-B">
                {view.deadline}
              </div>
              <div className="text-gray-500 font-B03-M">{view.companyName}</div>
              <div className="mt-3 text-black font-T04-SB">{view.title}</div>
              <div className="mt-4 text-gray-500 font-B03-M">
                {view.locationName}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500 font-B02-M">
            해당 직업에 대한 일자리가 없습니다.
          </div>
        )}
      </div>
      {selectedItem && (
        <SelectModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default JobView;
