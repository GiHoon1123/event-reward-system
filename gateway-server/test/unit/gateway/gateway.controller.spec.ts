// test/unit/gateway/gateway.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from 'src/gateway/gateway.controller';
import { GatewayService } from 'src/gateway/gateway.service';

const mockRequest: any = {
  path: '/any/path',
  body: { key: 'value' },
  headers: { 'content-type': 'application/json' },
};

const mockResponse: any = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
};

const mockGatewayService = {
  forward: jest.fn(),
};

describe('GatewayController', () => {
  let controller: GatewayController;
  let service: GatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [
        {
          provide: GatewayService,
          useValue: mockGatewayService,
        },
      ],
    }).compile();

    controller = module.get<GatewayController>(GatewayController);
    service = module.get<GatewayService>(GatewayService);
    jest.clearAllMocks();
  });

  const endpoints = [
    {
      name: 'token',
      method: () => controller.token(mockRequest, mockResponse),
    },
    {
      name: 'login',
      method: () => controller.login(mockRequest, mockResponse),
    },
    {
      name: 'register',
      method: () => controller.register(mockRequest, mockResponse),
    },
    {
      name: 'changeRole',
      method: () => controller.changeRole(mockRequest, mockResponse),
    },
    {
      name: 'eventSet',
      method: () => controller.eventSet(mockRequest, mockResponse),
    },
    {
      name: 'getAllHistory',
      method: () => controller.getAllHistory(mockRequest, mockResponse),
    },
    {
      name: 'requestReward',
      method: () => controller.requestReward(mockRequest, mockResponse),
    },
    {
      name: 'events',
      method: () => controller.events(mockRequest, mockResponse),
    },
  ];

  endpoints.forEach(({ name, method }) => {
    it(`${name}() should forward request to GatewayService`, async () => {
      await method();
      expect(service.forward).toHaveBeenCalledWith(mockRequest, mockResponse);
    });
  });
});
