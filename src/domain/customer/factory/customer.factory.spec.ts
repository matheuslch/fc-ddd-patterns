import CustomerFactory from "./customer.factory";
import Address from "../valueObject/address";

describe("Customer factory unit test", () => {
    it("should create a customer", () => {
        let customer = CustomerFactory.create("Matheus");

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Matheus");
        expect(customer.Address).toBeUndefined();
    });

    it("should create a customer with an address", () => {
        const address = new Address("Rua 1", 1, "13770000", "Caconde");

        let customer = CustomerFactory.createWithAddress("Matheus", address);

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Matheus");
        expect(customer.Address).toBe(address);
    });
});