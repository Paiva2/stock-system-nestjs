import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '../user.service';

describe('Register user service', () => {
  let sut: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    sut = module.get<UserService>(UserService);
  });

  it('should init module correctly for tests', () => {
    expect(sut).toBeDefined();
  });
});
