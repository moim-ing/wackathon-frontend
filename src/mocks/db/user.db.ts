import type { MockUser } from '../types';

// 초기 테스트용 데이터
export const userDB: MockUser[] = [
  {
    email: 'test@example.com',
    name: '테스트 유저',
    password: 'password123',
    token: 'mock-token-for-user-1',
  },
  {
    email: 'jun411@snu.ac.kr',
    name: '이준엽',
    password: 'qwer1234!',
    token: 'mock-token-for-user-2',
  },
];
