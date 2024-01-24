import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangedAddressEvent from "../customerChangedAddress.event";

export default class SendConsoleLogAddressHandler
	implements EventHandlerInterface<CustomerChangedAddressEvent> {
	handle(event: CustomerChangedAddressEvent): void {
		const eventData = event.eventData;
		console.log(`Endereço do cliente: ${eventData.id}, ${eventData.name} alterado para: ${eventData.Address.toString()}`);
	}
}