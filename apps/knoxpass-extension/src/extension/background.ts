import type { LoginRequest, LoginResponse } from '../types/LoginRequest';

// const io = require('socket.io-client')

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ color: '#3aa757' });
	// TODO: Set keypair
});

chrome.runtime.onMessage.addListener(function (
	request: LoginRequest,
	_sender,
	sendResponse
) {
	console.log('got message', request);

	const notificationOptions = {
		type: 'basic',
		iconUrl: './assets/icon/knoxpass_logo-128px.ico',
		title: 'Login Request',
		message: 'Check your secure device',
	};
	chrome.notifications.create(request.uuid, notificationOptions);

	const response: LoginResponse = {
		uuid: request.uuid,
		username: 'MyUser',
		password: 'MyPassword',
	};

	sendResponse(response);

	return true;
});
