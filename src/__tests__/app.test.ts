function add(a: number, b: number): number {
	return a + b;
}

describe("add", () => {
	it("should return the sum of two numbers", () => {
		expect(add(1, 2)).toBe(3);
	});

	it("should handle negative numbers", () => {
		expect(add(-1, -2)).toBe(-3);
	});
});
