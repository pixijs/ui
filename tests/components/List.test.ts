import { List } from '../../src/List';

describe('List Component', () => {
    it('should create List with vertical type without errors', () => {
        expect(() => {
            new List({ type: 'vertical', elementsMargin: 10 });
        }).not.toThrow();
    });

    it('should create List with horizontal type without errors', () => {
        expect(() => {
            new List({ type: 'horizontal', elementsMargin: 10 });
        }).not.toThrow();
    });

    it('should handle different margin values', () => {
        expect(() => {
            new List({ type: 'vertical', elementsMargin: 20 });
        }).not.toThrow();
    });

    it('should handle zero margin', () => {
        expect(() => {
            new List({ type: 'vertical', elementsMargin: 0 });
        }).not.toThrow();
    });

    it('should create List without options', () => {
        expect(() => {
            new List();
        }).not.toThrow();
    });
});