module.exports = {
  rootDir: '.',
  testMatch: ['**/test/unit/**/*.spec.ts'], // 단위 테스트만 실행
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1', // 🔥 src alias 인식
  },
};
