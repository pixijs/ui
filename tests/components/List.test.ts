import { List } from '../../src/List';
import { cleanup, createTestItems, testStateChange } from '../utils/components';

describe('List Component', () =>
{
    afterEach(() =>
    {
        cleanup();
    });

    describe('List Creation and Basic Properties', () =>
    {
        it('should create List with vertical type without errors', () =>
        {
            // Test basic vertical List creation
            expect(() =>
            {
                const list = new List({ type: 'vertical', elementsMargin: 10 });

                expect(list.type).toBe('vertical');
                expect(list.elementsMargin).toBe(10);
            }).not.toThrow();
        });

        it('should create List with horizontal type without errors', () =>
        {
            // Test basic horizontal List creation
            expect(() =>
            {
                const list = new List({ type: 'horizontal', elementsMargin: 10 });

                expect(list.type).toBe('horizontal');
                expect(list.elementsMargin).toBe(10);
            }).not.toThrow();
        });

        it('should create List with bidirectional type without errors', () =>
        {
            // Test basic bidirectional List creation
            expect(() =>
            {
                const list = new List({ type: 'bidirectional', elementsMargin: 5 });

                expect(list.type).toBe('bidirectional');
                expect(list.elementsMargin).toBe(5);
            }).not.toThrow();
        });

        it('should create List without options', () =>
        {
            // Test List with no options (default behavior)
            expect(() =>
            {
                const list = new List();

                expect(list.children).toBeDefined();
                expect(list.children.length).toBe(0);
            }).not.toThrow();
        });

        it('should create List with minimal options', () =>
        {
            // Test List with minimal configuration
            const minimalOptions = {
                elementsMargin: 0,
            };

            expect(() =>
            {
                const list = new List(minimalOptions);

                expect(list.elementsMargin).toBe(0);
            }).not.toThrow();
        });
    });

    describe('List Type Management', () =>
    {
        let list: List;

        beforeEach(() =>
        {
            list = new List({ type: 'vertical', elementsMargin: 5 });
        });

        it('should handle type changes', () =>
        {
            // Test type property getter/setter
            testStateChange(list, 'type', 'vertical', 'horizontal');
            testStateChange(list, 'type', 'horizontal', 'bidirectional');
        });

        it('should maintain type consistency', () =>
        {
            // Test type persistence
            list.type = 'horizontal';
            expect(list.type).toBe('horizontal');

            list.type = 'bidirectional';
            expect(list.type).toBe('bidirectional');

            list.type = 'vertical';
            expect(list.type).toBe('vertical');
        });

        it('should handle all valid list types', () =>
        {
            // Test all supported list types
            const types = ['vertical', 'horizontal', 'bidirectional'] as const;

            types.forEach((type) =>
            {
                list.type = type;
                expect(list.type).toBe(type);
            });
        });
    });

    describe('List Margin Management', () =>
    {
        let list: List;

        beforeEach(() =>
        {
            list = new List({ type: 'vertical', elementsMargin: 10 });
        });

        it('should handle elementsMargin changes', () =>
        {
            // Test elementsMargin property getter/setter
            testStateChange(list, 'elementsMargin', 10, 20);
            testStateChange(list, 'elementsMargin', 20, 0);
        });

        it('should handle different margin values', () =>
        {
            // Test various margin values
            const margins = [0, 5, 10, 15, 20, 50];

            margins.forEach((margin) =>
            {
                list.elementsMargin = margin;
                expect(list.elementsMargin).toBe(margin);
            });
        });

        it('should handle zero margin', () =>
        {
            // Test zero margin specifically
            list.elementsMargin = 0;
            expect(list.elementsMargin).toBe(0);
        });

        it('should handle negative margins', () =>
        {
            // Test negative margin values
            list.elementsMargin = -5;
            expect(list.elementsMargin).toBe(-5);
        });
    });

    describe('List Padding Management', () =>
    {
        let list: List;

        beforeEach(() =>
        {
            list = new List({ type: 'vertical', elementsMargin: 5 });
        });

        it('should handle padding changes', () =>
        {
            // Test padding property getter/setter
            testStateChange(list, 'padding', 0, 10);
            testStateChange(list, 'padding', 10, 20);
        });

        it('should handle vertical padding changes', () =>
        {
            // Test vertPadding property getter/setter
            testStateChange(list, 'vertPadding', 0, 15);
            testStateChange(list, 'vertPadding', 15, 5);
        });

        it('should handle horizontal padding changes', () =>
        {
            // Test horPadding property getter/setter
            testStateChange(list, 'horPadding', 0, 12);
            testStateChange(list, 'horPadding', 12, 8);
        });

        it('should handle individual padding changes', () =>
        {
            // Test individual padding properties
            testStateChange(list, 'leftPadding', 0, 5);
            testStateChange(list, 'rightPadding', 0, 7);
            testStateChange(list, 'topPadding', 0, 3);
            testStateChange(list, 'bottomPadding', 0, 9);
        });

        it('should maintain padding consistency', () =>
        {
            // Test that padding affects all individual paddings
            list.padding = 10;

            expect(list.padding).toBe(10);
            expect(list.leftPadding).toBe(10);
            expect(list.rightPadding).toBe(10);
            expect(list.topPadding).toBe(10);
            expect(list.bottomPadding).toBe(10);
        });

        it('should maintain vertical padding consistency', () =>
        {
            // Test that vertical padding affects top and bottom
            list.vertPadding = 15;

            expect(list.vertPadding).toBe(15);
            expect(list.topPadding).toBe(15);
            expect(list.bottomPadding).toBe(15);
        });

        it('should maintain horizontal padding consistency', () =>
        {
            // Test that horizontal padding affects left and right
            list.horPadding = 12;

            expect(list.horPadding).toBe(12);
            expect(list.leftPadding).toBe(12);
            expect(list.rightPadding).toBe(12);
        });

        it('should handle zero and negative padding values', () =>
        {
            // Test edge case padding values
            const paddingValues = [0, -5, -10];

            paddingValues.forEach((padding) =>
            {
                list.padding = padding;
                expect(list.padding).toBe(padding);

                list.vertPadding = padding;
                expect(list.vertPadding).toBe(padding);

                list.horPadding = padding;
                expect(list.horPadding).toBe(padding);
            });
        });
    });

    describe('List Item Management', () =>
    {
        let list: List;

        beforeEach(() =>
        {
            list = new List({ type: 'vertical', elementsMargin: 5 });
        });

        it('should handle adding items during creation', () =>
        {
            // Test items option during creation
            const items = createTestItems(3);
            const options = {
                type: 'vertical' as const,
                items,
            };

            expect(() =>
            {
                const listWithItems = new List(options);

                expect(listWithItems.children.length).toBe(3);
            }).not.toThrow();
        });

        it('should handle adding items after creation', () =>
        {
            // Test adding items using addChild
            const items = createTestItems(2);

            expect(() =>
            {
                items.forEach((item) => list.addChild(item));
                expect(list.children.length).toBe(2);
            }).not.toThrow();
        });

        it('should handle removing items', () =>
        {
            // Test removing items using removeItem
            const items = createTestItems(5);

            items.forEach((item) => list.addChild(item));
            expect(list.children.length).toBe(5);

            expect(() =>
            {
                list.removeItem(2); // Remove third item
                expect(list.children.length).toBe(4);

                list.removeItem(0); // Remove first item
                expect(list.children.length).toBe(3);
            }).not.toThrow();
        });

        it('should handle removing non-existent items', () =>
        {
            // Test removing items that don't exist
            const items = createTestItems(2);

            items.forEach((item) => list.addChild(item));

            expect(() =>
            {
                list.removeItem(5); // Index out of range
                expect(list.children.length).toBe(2); // Should remain unchanged

                list.removeItem(-1); // Negative index
                expect(list.children.length).toBe(2); // Should remain unchanged
            }).not.toThrow();
        });

        it('should handle children option during creation', () =>
        {
            // Test children option during creation
            const children = createTestItems(4);
            const options = {
                type: 'horizontal' as const,
                children,
            };

            expect(() =>
            {
                const listWithChildren = new List(options);

                expect(listWithChildren.children.length).toBe(4);
            }).not.toThrow();
        });

        it('should handle empty item arrays', () =>
        {
            // Test with empty items array
            const options = {
                type: 'vertical' as const,
                items: [],
            };

            expect(() =>
            {
                const emptyList = new List(options);

                expect(emptyList.children.length).toBe(0);
            }).not.toThrow();
        });

        it('should handle large numbers of items', () =>
        {
            // Test performance with many items
            const items = createTestItems(50);

            expect(() =>
            {
                items.forEach((item) => list.addChild(item));
                expect(list.children.length).toBe(50);
            }).not.toThrow();
        });
    });

    describe('List maxWidth Management', () =>
    {
        let list: List;

        beforeEach(() =>
        {
            list = new List({ type: 'bidirectional', elementsMargin: 5 });
        });

        it('should handle maxWidth changes', () =>
        {
            // Test maxWidth property getter/setter
            testStateChange(list, 'maxWidth', undefined, 300);
            testStateChange(list, 'maxWidth', 300, 500);
        });

        it('should handle different maxWidth values', () =>
        {
            // Test various maxWidth values
            const widths = [100, 200, 300, 500, 1000];

            widths.forEach((width) =>
            {
                list.maxWidth = width;
                expect(list.maxWidth).toBe(width);
            });
        });

        it('should handle maxWidth during creation', () =>
        {
            // Test maxWidth option during creation
            const options = {
                type: 'bidirectional' as const,
                maxWidth: 400,
            };

            expect(() =>
            {
                const listWithMaxWidth = new List(options);

                expect(listWithMaxWidth.maxWidth).toBe(400);
            }).not.toThrow();
        });
    });

    describe('List Arrangement Functionality', () =>
    {
        it('should handle vertical arrangement', () =>
        {
            // Test vertical arrangement of items
            const items = createTestItems(3, 30); // 3 items, 30px height each
            const list = new List({
                type: 'vertical',
                elementsMargin: 10,
                items,
            });

            expect(() =>
            {
                list.arrangeChildren();
                expect(list.children.length).toBe(3);
            }).not.toThrow();
        });

        it('should handle horizontal arrangement', () =>
        {
            // Test horizontal arrangement of items
            const items = createTestItems(3, 40); // 3 items, 40px height each
            const list = new List({
                type: 'horizontal',
                elementsMargin: 5,
                items,
            });

            expect(() =>
            {
                list.arrangeChildren();
                expect(list.children.length).toBe(3);
            }).not.toThrow();
        });

        it('should handle bidirectional arrangement', () =>
        {
            // Test bidirectional arrangement of items
            const items = createTestItems(6, 25); // 6 items, 25px height each
            const list = new List({
                type: 'bidirectional',
                elementsMargin: 3,
                maxWidth: 250,
                items,
            });

            expect(() =>
            {
                list.arrangeChildren();
                expect(list.children.length).toBe(6);
            }).not.toThrow();
        });

        it('should handle arrangement with padding', () =>
        {
            // Test arrangement with various padding configurations
            const items = createTestItems(4, 35); // 4 items, 35px height each
            const list = new List({
                type: 'vertical',
                elementsMargin: 8,
                padding: 15,
                items,
            });

            expect(() =>
            {
                list.arrangeChildren();
                expect(list.children.length).toBe(4);
                expect(list.padding).toBe(15);
            }).not.toThrow();
        });

        it('should rearrange when properties change', () =>
        {
            // Test that arrangement updates when properties change
            const items = createTestItems(3, 20);
            const list = new List({
                type: 'horizontal',
                elementsMargin: 5,
                items,
            });

            expect(() =>
            {
                list.type = 'vertical'; // Should trigger rearrangement
                list.elementsMargin = 15; // Should trigger rearrangement
                list.padding = 10; // Should trigger rearrangement
            }).not.toThrow();
        });
    });

    describe('List Configuration Options', () =>
    {
        it('should handle different type configurations', () =>
        {
            // Test all type configurations with various options
            const types = ['vertical', 'horizontal', 'bidirectional'] as const;

            types.forEach((type) =>
            {
                const options = {
                    type,
                    elementsMargin: 5,
                    padding: 10,
                    items: createTestItems(3),
                };

                expect(() =>
                {
                    const list = new List(options);

                    expect(list.type).toBe(type);
                    expect(list.children.length).toBe(3);
                }).not.toThrow();
            });
        });

        it('should handle mixed padding configurations', () =>
        {
            // Test different padding combinations
            const paddingConfigurations = [
                {
                    padding: 10,
                },
                {
                    vertPadding: 8,
                    horPadding: 12,
                },
                {
                    topPadding: 5,
                    bottomPadding: 7,
                    leftPadding: 6,
                    rightPadding: 9,
                },
            ];

            paddingConfigurations.forEach((paddingConfig) =>
            {
                const options = {
                    type: 'vertical' as const,
                    elementsMargin: 3,
                    ...paddingConfig,
                };

                expect(() =>
                {
                    new List(options); // eslint-disable-line no-new
                }).not.toThrow();
            });
        });
    });

    describe('List Advanced Features', () =>
    {
        it('should handle error states gracefully', () =>
        {
            // Test error handling for uninitialized list
            const uninitializedList = new List();

            expect(() =>
            {
                uninitializedList.elementsMargin = 10;
            }).toThrow('List has not been initiated!');

            expect(() =>
            {
                uninitializedList.padding = 5;
            }).toThrow('List has not been initiated!');
        });

        it('should handle event-driven arrangement', () =>
        {
            // Test that arrangement is triggered by events
            const list = new List({
                type: 'vertical',
                elementsMargin: 5,
            });

            expect(() =>
            {
                const item = createTestItems(1)[0];

                list.addChild(item); // Should trigger arrangeChildren via 'childAdded' event
                expect(list.children.length).toBe(1);
            }).not.toThrow();
        });

        it('should handle edge case configurations', () =>
        {
            // Test edge cases
            const edgeCases = [
                {
                    type: 'vertical' as const,
                    elementsMargin: 0,
                    padding: 0,
                    items: [], // Empty items
                },
                {
                    type: 'horizontal' as const,
                    elementsMargin: -5, // Negative margin
                    padding: -2, // Negative padding
                    items: createTestItems(1), // Single item
                },
                {
                    type: 'bidirectional' as const,
                    elementsMargin: 100, // Large margin
                    maxWidth: 50, // Small max width
                    items: createTestItems(10, 20), // Many items
                },
            ];

            edgeCases.forEach((options, index) =>
            {
                expect(() =>
                {
                    const list = new List(options);

                    expect(list).toBeInstanceOf(List);
                }).not.toThrow(`Edge case ${index} should not throw`);
            });
        });

        it('should handle comprehensive option combinations', () =>
        {
            // Test complex option combinations
            const comprehensiveOptions = {
                type: 'bidirectional' as const,
                elementsMargin: 8,
                maxWidth: 300,
                padding: 12,
                vertPadding: 15,
                horPadding: 10,
                topPadding: 18,
                bottomPadding: 20,
                leftPadding: 14,
                rightPadding: 16,
                items: createTestItems(12, 25),
            };

            expect(() =>
            {
                const list = new List(comprehensiveOptions);

                expect(list.type).toBe('bidirectional');
                expect(list.elementsMargin).toBe(8);
                expect(list.maxWidth).toBe(300);
                expect(list.children.length).toBe(12);
                expect(list.topPadding).toBe(18);
                expect(list.bottomPadding).toBe(20);
                expect(list.leftPadding).toBe(14);
                expect(list.rightPadding).toBe(16);
            }).not.toThrow();
        });
    });
});
