import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/order/entity/order";
import OrderItem from "../../../../domain/order/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/valueObject/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/model/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/model/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "../../model/sequelize/order-item.model";
import OrderModel from "../../model/sequelize/order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
	let sequelize: Sequelize;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: "sqlite",
			storage: ":memory:",
			logging: false,
			sync: { force: true },
		});

		await sequelize.addModels([
			CustomerModel,
			OrderModel,
			OrderItemModel,
			ProductModel,
		]);

		await sequelize.sync();
	});

	afterEach(async () => {
		await sequelize.close();
	});

	it("should create a new order", async () => {
		const customerRepository = new CustomerRepository();
		const productRepository = new ProductRepository();
		const orderRepository = new OrderRepository();

		const customer = new Customer("123", "Customer 1");
		const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
		customer.changeAddress(address);
		await customerRepository.create(customer);

		const product = new Product("123", "Product 1", 10);
		await productRepository.create(product);

		const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
		const order = new Order("123", "123", [orderItem]);
		await orderRepository.create(order);

		const orderModel = await OrderModel.findOne({
			where: { id: order.id },
			include: ["items"],
		});

		expect(orderModel.toJSON()).toStrictEqual({
			id: "123",
			customer_id: "123",
			total: order.total(),
			items: [
				{
					id: orderItem.id,
					name: orderItem.name,
					unitPrice: orderItem.unitPrice,
					quantity: orderItem.quantity,
					order_id: "123",
					product_id: "123",
				},
			],
		});
	});

	it("should update a order", async () => {
		const customerRepository = new CustomerRepository();
		const productRepository = new ProductRepository();
		const orderRepository = new OrderRepository();

		const customer = new Customer("123", "Customer 1");
		const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
		customer.changeAddress(address);
		await customerRepository.create(customer);

		const product1 = new Product("111", "Product 1", 10);
		const product2 = new Product("222", "Product 2", 20);
		await productRepository.create(product1);
		await productRepository.create(product2);

		const orderItem1 = new OrderItem("1", product1.name, product1.price, product1.id, 2);
		const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 2);

		const order = new Order("123", "123", [orderItem1, orderItem2]);
		await orderRepository.create(order);

		const orderModelCreate = await OrderModel.findOne({
			where: { id: order.id },
			include: ["items"],
		});

		expect(orderModelCreate?.items).toHaveLength(2);
		expect(orderModelCreate?.total).toBe(order.total());

		const product3 = new Product("333", "Product 3", 30);
		await productRepository.create(product3);
		const orderItem3 = new OrderItem("3", product3.name, product3.price, product3.id, 2);

		order.addItem(orderItem3);

		await orderRepository.update(order);

		const orderModelUpdate = await OrderModel.findOne({
			where: { id: order.id },
			include: ["items"],
		});

		expect(orderModelUpdate.items).toHaveLength(3);
		expect(orderModelUpdate.total).toBe(order.total());

		order.removeItem(orderItem1.id);
		order.removeItem(orderItem2.id);

		await orderRepository.update(order);

		const orderModelRemove = await OrderModel.findOne({
			where: { id: order.id },
			include: ["items"],
		});

		expect(orderModelRemove.items).toHaveLength(1);
		expect(orderModelRemove.total).toBe(order.total());
	});

	it("should find a order", async () => {
		const customerRepository = new CustomerRepository();
		const productRepository = new ProductRepository();
		const orderRepository = new OrderRepository();

		const customer = new Customer("123", "Customer 1");
		const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
		customer.changeAddress(address);
		await customerRepository.create(customer);

		const product = new Product("123", "Product 1", 10);
		await productRepository.create(product);

		const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
		const order = new Order("123", "123", [orderItem]);
		await orderRepository.create(order);

		const orderFound = await orderRepository.find(order.id);

		expect(orderFound).toEqual(order);
	});

	it("should throw an error when order is not found", async () => {
		const orderRepository = new OrderRepository();

		expect(async () => {
			await orderRepository.find("123");
		}).rejects.toThrow("Order not found");
	});

	it("should find all orders", async () => {
		const customerRepository = new CustomerRepository();
		const productRepository = new ProductRepository();
		const orderRepository = new OrderRepository();

		const customer = new Customer("123", "Customer 1");
		const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
		customer.changeAddress(address);
		await customerRepository.create(customer);

		const product = new Product("123", "Product 1", 10);
		await productRepository.create(product);

		const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
		const order1 = new Order("123", "123", [orderItem]);
		await orderRepository.create(order1);


		const product2 = new Product("789", "Product 1", 10);
		await productRepository.create(product2);

		const orderItem2 = new OrderItem("2", product.name, product.price, product.id, 2);
		const order2 = new Order("456", "123", [orderItem2]);
		await orderRepository.create(order2);

		const orders = await orderRepository.findAll();

		expect(orders).toHaveLength(2);
		expect(orders).toContainEqual(order1);
		expect(orders).toContainEqual(order2);
	});
});