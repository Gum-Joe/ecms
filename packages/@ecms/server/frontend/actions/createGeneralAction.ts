/**
 * Create an action using a specific payload
 * 
 * From https://medium.com/hackernoon/finally-the-typescript-redux-hooks-events-blog-you-were-looking-for-c4663d823b01
 * @returns The action, with a type field and a payload field, the latter of which has the action data itself
 */

export function createGeneralAction<Obj extends Record<string, any>>() {
	return function <Key extends keyof Obj>(name: Key, ...args: Obj[Key] extends undefined ? [] : [Obj[Key]]): { type: Key, payload: Obj[Key] extends undefined ? undefined : Obj[Key] } {
		if (args.length > 0 && args[0]) {
			return {
				type: name,
				payload: args[0]
			};
		}
		// @ts-expect-error: I don't know how to fix it
		return {
			type: name,
		};
	};
}