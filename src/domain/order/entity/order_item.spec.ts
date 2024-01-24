import OrderItem from "./order_item";

describe("Order Item unit tests", () => {
	it("should throw error when id is empty", () => {
		expect(() => {
			new OrderItem("", "Item 1", 100, "p1", 2);
		}).toThrow("Id is required");
	});

	it("should throw error when name is empty", () => {
		expect(() => {
			new OrderItem("i1", "", 100, "p1", 2);
		}).toThrow("Name is required");
	});

	it("should throw error if the unit price is less than or equal to 0", () => {
		expect(() => {
			new OrderItem("i1", "Item 1", -1, "p1", 2);
		}).toThrow("Unit price must be greater than 0");
	});

	it("should throw error when productId is empty", () => {
		expect(() => {
			new OrderItem("i1", "Item 1", 100, "", 2);
		}).toThrow("ProductId is required");
	});

	it("should throw error if the quantity is less than or equal to 0", () => {
		expect(() => {
			new OrderItem("i1", "Item 1", 100, "p1", -2);
		}).toThrow("Quantity must be greater than 0");
	});
});