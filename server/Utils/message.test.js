var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var message = generateMessage('Jani', 'Hello');

        expect(message.from).toBe('Jani');
        expect(message.text).toBe('Hello');
        expect(message.createdAt).toBeA('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location message object', () => {
        var message = generateLocationMessage('Jani', '1', '1');

        expect(message.from).toBe('Jani');
        expect(message.url).toBe('https://www.google.com/maps?q=1,1');
        expect(message.createdAt).toBeA('number');
    });
});