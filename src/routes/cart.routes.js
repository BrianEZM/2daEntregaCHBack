import express from "express";
const routerCart = express.Router();

// <------ Container ------>

// import Cart from "../cart.js";
// const cart = new Cart("carts.json");

// <------ Mongodb ------>

import { cartsModel } from "../models/carts.schema.js";
import CartMongoDB from "../dao/cartMongoDB.js";
const cart = new CartMongoDB(cartsModel);

// <------ Queries ------>

routerCart.use(express.json());
routerCart.use(express.urlencoded({ extended: true }));

routerCart.get("/", (req, res) => {
	res.json(cart.getAll());
});

routerCart.get("/:id/productos", (req, res) => {
	const { id } = req.params;
	const response = cart.getProducts(Number(id));
	if (response.error) {
		res.json({ error: response.error });
	} else if (response.length === 0) {
		res.json({ message: "Este carrito no contiene productos" });
	} else {
		res.json(response);
	}
});

routerCart.post("/", (req, res) => {
	const { nombre } = req.body;
	if (nombre === undefined) {
		res.json(cart.new());
	} else {
		res.json(cart.new(nombre));
	}
});

routerCart.post("/:id/productos", (req, res) => {
	const { id } = req.params;
	const { nombre, precio, imagen, descripcion, stock } = req.body;

	if (
		nombre === undefined ||
		precio === undefined ||
		imagen === undefined ||
		descripcion === undefined ||
		stock === undefined
	) {
		res.json({
			error:
				"Uno ó varios de los campos ha quedado vacio. Verifique que tenga todos los datos solicitados: nombre, precio, imagen, descripcion, stock",
		});
	} else {
		const product = {
			nombre: nombre,
			precio: Number(precio),
			imagen: imagen,
			descripcion: descripcion,
			stock: Number(stock),
		};
		res.json(cart.addProduct(Number(id), product));
	}
});

routerCart.delete("/:id", (req, res) => {
	const { id } = req.params;
	res.json(cart.delete(Number(id)));
});

routerCart.delete("/:id/productos/:id_prod", (req, res) => {
	const { id, id_prod } = req.params;
	res.json(cart.deleteProductInCart(Number(id), Number(id_prod)));
});

export default routerCart;
