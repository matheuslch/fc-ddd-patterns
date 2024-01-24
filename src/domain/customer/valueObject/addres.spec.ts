import Address from "./address";

describe("Address unit tests", () => {
    it("should throw error when street is empty", () => {
        expect(() => {
            new Address("", 300, "13770000", "Caconde, SP");
        }).toThrow("Street is required");
    });

    it("should throw error when number is less than or equal to 0", () => {
        expect(() => {
            new Address("Direita", -1, "13770000", "Caconde, SP");
        }).toThrow("Number is required");
    });

    it("should throw error when city is empty", () => {
        expect(() => {
            new Address("Direita", 300, "", "Caconde, SP");
        }).toThrow("Zip is required");
    });

    it("should throw error when city is empty", () => {
        expect(() => {
            new Address("Direita", 300, "13770000", "");
        }).toThrow("City is required");
    });

    it("should return a string in the expected format", () => {
        const address = new Address("Direita", 300, "13770000", "Caconde, SP");
        expect(address.toString()).toBe("Direita, 300, 13770000 Caconde, SP");
    });
});