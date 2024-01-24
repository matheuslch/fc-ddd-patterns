import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "./customerCreated.event";
import SendConsoleLog1Handler from "./handler/sendConsoleLog1.handler";
import SendConsoleLog2Handler from "./handler/sendConsoleLog2.handler";
import Customer from "../entity/customer";
import Address from "../valueObject/address";

describe("Customer created event tests", () => {
    it("should notify the event handlers of the creation of a customer", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new SendConsoleLog1Handler();
        const eventHandler2 = new SendConsoleLog2Handler();

        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandler1);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        ).toMatchObject(eventHandler2);

        const customer = new Customer("1", "Matheus Chiacchio")
        const address = new Address("Rua 1", 123, "13770000", "Caconde");
        customer.Address = address;

        const customerCreatedEvent = new CustomerCreatedEvent(customer);

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });
});
