import Order from "../../../../domain/order/entity/order";
import OrderItem from "../../../../domain/order/entity/order_item";
import OrderItemModel from "../../model/sequelize/order-item.model";
import OrderModel from "../../model/sequelize/order.model";
import OrderRepositoryInterface from "../../../../domain/order/repository/order-repository.interface";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    unitPrice: item.unitPrice,
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            }
        );
    }

    async update(entity: Order): Promise<void> {
        const itemsOrder = entity.items.map((item) => ({
            id: item.id,
            name: item.name,
            unitPrice: item.unitPrice,
            product_id: item.productId,
            quantity: item.quantity,
        }));

        const itemsDb = await OrderItemModel.findAll({ where: { order_id: entity.id } });

        for (const itemDb of itemsDb) {
            const itemExistsOrder = itemsOrder.find((itemOrder) => itemOrder.id === itemDb.id);

            if (!itemExistsOrder) {
                await OrderItemModel.destroy({ where: { id: itemDb.id } });
            }
        }        

        for (const itemOrder of itemsOrder) {
            const itemExistsDb = itemsDb.find((itemDb) => itemDb.id === itemOrder.id);

            if (!itemExistsDb) {
                await OrderItemModel.create({ ...itemOrder, order_id: entity.id });
            }
        }

        await OrderModel.update({ total: entity.total() }, { where: { id: entity.id } });
    }

    async find(id: string): Promise<Order> {
        let orderModel;
        try {
            orderModel = await OrderModel.findOne({
                where: {
                    id,
                },
                include: [{ model: OrderItemModel }],
                rejectOnEmpty: true,
            });
        } catch (error) {
            throw new Error("Order not found");
        }

        const items = orderModel.items.map((item) => new OrderItem(item.id, item.name, item.unitPrice, item.product_id, item.quantity));
        const order = new Order(id, orderModel.customer_id, items);
        return order;
    }

    async findAll(): Promise<Order[]> {
        const orderModel = await OrderModel.findAll({ include: [{ model: OrderItemModel }] });

        const orders = orderModel.map((orderModel) => {
            const items = orderModel.items.map((item) => new OrderItem(item.id, item.name, item.unitPrice, item.product_id, item.quantity));
            const order = new Order(orderModel.id, orderModel.customer_id, items);

            return order;
        });

        return orders;
    }
}