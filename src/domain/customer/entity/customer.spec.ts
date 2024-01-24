import Customer from "./customer";
import Address from "../valueObject/address";

describe("Customer unit tests", () => {

    it("Should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "Matheus")
        }).toThrow("Customer id is required");
    });

    it("Should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("123", "")
        }).toThrow("Customer name is required");
    });

    it("Should change name", () => {
        //Arrange
        const customer = new Customer("123", "Matheus")
        //Act
        customer.changeName("Luiz");
        //Assert
        expect(customer.name).toBe("Luiz");
    });

    it("Should activate customer", () => {
        const customer = new Customer("1", "Customer 1")
        const address = new Address("Rua 1", 123, "13573-162", "São Carlos");
        customer.Address = address;

        customer.activate();

        expect(customer.isActive()).toBe(true);
    });

    it("Should throw error when address is undefined when you activate a customer", () => {
        expect(() => {
            const customer = new Customer("1", "Customer 1")
            customer.activate();
        }).toThrow("Address is mandatory to activate a customer");
    });

    it("Should deactivate customer", () => {
        const customer = new Customer("1", "Customer 1")

        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    });

    it("should add reward points", () => {
        const customer = new Customer("1", "Customer 1");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });
});
