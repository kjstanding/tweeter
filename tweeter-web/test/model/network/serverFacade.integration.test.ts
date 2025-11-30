import 'isomorphic-fetch';
import { Buffer } from 'buffer';
import { ServerFacade } from '../../../src/model/network/ServerFacade';
import { RegisterRequest, PagedItemRequest, UserDTO, FollowRequest } from 'tweeter-shared';

describe('ServerFacade Integration Test', () => {
	const serverFacade = new ServerFacade();
	let registeredUserAlias: string;
	let authToken: string;
	let registeredUserDTO: UserDTO;

	beforeAll(async () => {
		// Minimal image bytes
		const imageBytes = new Uint8Array([0, 1, 2]);
		const imageStringBase64: string = Buffer.from(imageBytes).toString('base64');
		const request: RegisterRequest = {
			firstName: 'Test',
			lastName: 'User',
			alias: '@testUser',
			password: 'password',
			userImageBase64: imageStringBase64,
			imageFileExtension: 'png',
		};

		const [user, token] = await serverFacade.register(request);
		// FakeData returns Allen Anderson
		registeredUserAlias = user.alias;
		registeredUserDTO = user.dto;
		authToken = token.token;
	});

	test('Register', async () => {
		expect(registeredUserAlias).toBe('@allen');
		expect(registeredUserDTO.firstName).toBe('Allen');
		expect(registeredUserDTO.lastName).toBe('Anderson');
		expect(authToken).toBeDefined();
		expect(authToken.length).toBeGreaterThan(0);
	});

	test('getMoreFollowers', async () => {
		const request: PagedItemRequest<UserDTO> = {
			token: authToken,
			userAlias: registeredUserAlias,
			pageSize: 5,
			lastItem: null,
		};
		const [users, hasMore] = await serverFacade.getMoreFollowers(request);
		expect(users.length).toBe(5);
		expect(hasMore).toBe(true);
		expect(users[0].alias).toBe('@amy');
		users.forEach((u) => expect(u.alias).not.toBe(registeredUserAlias));
	});

	test('getMoreFollowers 2nd page', async () => {
		const firstPageReq: PagedItemRequest<UserDTO> = {
			token: authToken,
			userAlias: registeredUserAlias,
			pageSize: 5,
			lastItem: null,
		};
		const [firstPageUsers] = await serverFacade.getMoreFollowers(firstPageReq);
		const lastFirstPage = firstPageUsers[4];
		expect(lastFirstPage.alias).toBe('@cindy');

		const secondPageReq: PagedItemRequest<UserDTO> = {
			token: authToken,
			userAlias: registeredUserAlias,
			pageSize: 5,
			lastItem: lastFirstPage.dto,
		};
		const [secondPageUsers] = await serverFacade.getMoreFollowers(secondPageReq);
		expect(secondPageUsers[0].alias).toBe('@dan');
	});

	test('getFollowerCount', async () => {
		const request: FollowRequest = {
			token: authToken,
			selectedUser: registeredUserDTO,
		};
		const count = await serverFacade.getFollowerCount(request);
		expect(count).toBeGreaterThanOrEqual(1);
		expect(count).toBeLessThanOrEqual(10);
	});

	test('getFolloweeCount', async () => {
		const request: FollowRequest = {
			token: authToken,
			selectedUser: registeredUserDTO,
		};
		const count = await serverFacade.getFolloweeCount(request);
		expect(count).toBeGreaterThanOrEqual(1);
		expect(count).toBeLessThanOrEqual(10);
	});
});

