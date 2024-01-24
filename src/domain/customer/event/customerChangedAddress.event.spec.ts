import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerChangedAddressEvent from "./customerChangedAddress.event";
import SendConsoleLogAddressHandler from "./handler/sendConsoleLogAddress.handler";
import Customer from "../entity/customer";
import Address from "../valueObject/address";

describe("Customer changed of address event tests", () => {
	it("should notify the event handlers of the change of address of a customer", () => {
		const eventDispatcher = new EventDispatcher();
		const eventHandler = new SendConsoleLogAddressHandler();
		const spyEventHandler = jest.spyOn(eventHandler, "handle");

		eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

        expect(
            eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
        ).toMatchObject(eventHandler);

		const customer = new Customer("1", "Matheus Chiacchio")
        const address = new Address("Rua 1", 123, "13770000", "Caconde");
        customer.Address = address;

		const customerCreatedEvent = new CustomerChangedAddressEvent(customer);

		eventDispatcher.notify(customerCreatedEvent);

		expect(spyEventHandler).toHaveBeenCalled();
	});
});