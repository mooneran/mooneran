import { useQuery } from '@tanstack/react-query';
import api from './api';

export interface JobRequest {
  jobId: number;
  jobName: string;
  jobDescription: string;
  requiredCertification: string;
  workTimeInfo: string;
  physicalInfo: string;
  imageUrl: string;
}

export interface JobDetailRequest {
  jobId: number;
  jobName: string;
  jobDescription: string;
  certification: string;
  certificationPeriod: string;
  salaryType: string;
  salaryCost: string;
  strong: {
    physical: string;
    stress: string;
    relationship: string;
  };
}

export interface JobViewRequest {
  id: number;
  url: string;
  active: number;
  title: string;
  companyName: string;
  locationName: string;
  jobTypeName: string;
  experienceLevel: string;
  requiredEducationLevel: string;
  closeType: string;
  salary: string;
  deadline: string;
  'expiration-timestamp': string;
  'expiration-date': string;
  count: number;
}

const jobFoundList = async (
  pageNum: number,
  require: string,
  workTime: string,
  bodyActivity: string
) => {
  try {
    const response = await api.get(`/v1/job/list`, {
      params: {
        pageNum: pageNum - 1,
        require: require || undefined,
        workTime: workTime || undefined,
        physical: bodyActivity || undefined,
      },
    });
    return {
      content: response.data.data.content,
      totalPages: response.data.data.totalPages,
    };
  } catch (error) {
    console.error('직업 목록 API 호출 실패:', error);
    throw new Error('직업 목록을 불러오는데 실패했습니다');
  }
};
export const useJobQuery = (
  pageNum: number,
  require: string,
  workTime: string,
  bodyActivity: string
) => {
  return useQuery({
    queryKey: ['jobList', pageNum, require, workTime, bodyActivity],
    queryFn: () => jobFoundList(pageNum, require, workTime, bodyActivity),
  });
};

//직업 상세
const jobDetail = async (id: number): Promise<JobDetailRequest> => {
  try {
    const response = await api.get(`/v1/job/detail/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('직업 상세 정보 API 호출 실패:', error);
    throw error;
  }
};

export const useJobDetailQuery = (id: number) => {
  return useQuery({
    queryKey: ['jobDetail', id],
    queryFn: () => jobDetail(id),
  });
};

//직업탐색-일자리 둘러보기
const jobView = async (keyWord: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await api.get(`/v1/recruit/list`, {
      params: {
        pageNum: 0,
        keyWord,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data.job;
  } catch (error) {
    console.error('직업 상세 정보를 불러오는데 실패했습니다', error);
    throw error;
  }
};

export const useJobViewQuery = (keyWord: string) => {
  return useQuery<JobViewRequest[]>({
    queryKey: ['jobView', keyWord],
    queryFn: () => jobView(keyWord),
  });
};

//로그인 안했을때 일자리 둘러보기
const NoLoginjobView = async (keyWord: string) => {
  try {
    const response = await api.get(`/v1/recruit/list`, {
      params: {
        pageNum: 0,
        keyWord,
      },
    });
    return response.data.data.job;
  } catch (error) {
    console.error('직업 상세 정보를 불러오는데 실패했습니다', error);
    throw error;
  }
};

export const useNoJobViewQuery = (keyWord: string) => {
  return useQuery<JobViewRequest[]>({
    queryKey: ['NoLoginjobView', keyWord],
    queryFn: () => NoLoginjobView(keyWord),
  });
};
