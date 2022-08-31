// describe permet de grouper des tests dans un scenario
describe('Math test', () => {
    // it ==> alias de test
    it('should calc sum', () => {
        const a = 2 + 2;
        expect(a).toEqual(4);
    });
    it('should substract num', () => {
        const a = 2 - 2;
        expect(a).toBe(0);
    });
    it('should fail substract num', () => {
        const a = 2 - 2;
        expect(a === 4).toBeFalsy();
    });
});
