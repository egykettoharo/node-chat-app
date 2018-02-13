var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var message = generateMessage('Jani', 'Hello');

        expect(message.from).toBe('Jani');
        expect(message.text).toBe('Hello');
        expect(message.createdAt).toBeA('number');
    });
});