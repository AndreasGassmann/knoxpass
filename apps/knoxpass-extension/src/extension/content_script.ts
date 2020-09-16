import type { LoginRequest, LoginResponse } from '../types/LoginRequest';

import { generateUuid } from '@knoxpass/api-interfaces';

const USER_KEYWORDS = ['email', 'user', 'username'];
const PASSWORD_KEYWORDS = ['password', 'pass'];
const ATTRIBUTE_USER_KEYWORDS = ['username', 'email'];
const ATTRIBUTE_CURRENT_PASSWORD_KEYWORDS = ['current-password'];

const findInputByName = function (nameKeywords: string[]): HTMLElement | void {
	for (const userKeyword of nameKeywords) {
		for (const element of Array.from(document.getElementsByName(userKeyword))) {
			if (element.tagName && element.tagName.toLowerCase() === 'input') {
				return element;
			}
		}
	}
};

const findInputByAutocompleteAttribute = function (
	attributeKeywords: string[]
): HTMLInputElement | void {
	for (const attributeKeyword of attributeKeywords) {
		for (const element of Array.from(document.getElementsByTagName('input'))) {
			const attribute: string | null = element.getAttribute('autocomplete');
			if (attribute && attribute.toLowerCase() === attributeKeyword) {
				return element;
			}
		}
	}
};

const findCurrentPasswordField = function () {
	let passwordElement = findInputByAutocompleteAttribute(
		ATTRIBUTE_CURRENT_PASSWORD_KEYWORDS
	);
	if (passwordElement === undefined) {
		passwordElement = findInputByName(PASSWORD_KEYWORDS) as HTMLInputElement;
	}
	return passwordElement;
};

const findUsernameField = function () {
	let usernameElement = findInputByAutocompleteAttribute(
		ATTRIBUTE_USER_KEYWORDS
	);

	if (usernameElement === undefined) {
		usernameElement = findInputByName(USER_KEYWORDS) as HTMLInputElement;
	}

	return usernameElement;
};

setTimeout(() => {
	const passwordField = findCurrentPasswordField();

	if (passwordField) {
		const message: LoginRequest = {
			location: location.hostname,
			uuid: generateUuid(),
		};
		chrome.runtime.sendMessage(message, function (response: LoginResponse) {
			console.log(response);
			const usernameField = findUsernameField();
			if (usernameField && response.username !== undefined) {
				usernameField.value = response.username;
			}

			if (response.password !== undefined) {
				passwordField.value = response.password;
			}
		});
	}
}, 500);
