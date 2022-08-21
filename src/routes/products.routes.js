import express from "express";
const routerProduct = express.Router();

// <------ Container ------>

// import Product from "../containers/product.js";
// const product = new Product("products.json");

// <------ Mongodb ------>

import { productsModel } from "../models/products.schema.js";
import ProductMongoDB from "../dao/productMongoDB.js";
const product = new ProductMongoDB(productsModel);

// <------ Firebase ------>

// import ProductFirebase from "../dao/productFirebase.js";
// const product = new ProductFirebase("products");

// <------ Controllers ------>

import controller from "../controllers/admin.controller.js";

// <------ Queries ------>

routerProduct.use(express.json());
routerProduct.use(express.urlencoded({ extended: true }));

routerProduct.get("/:id?", (req, res) => {
	const { id } = req.params;
	if (id) {
		res.json(product.get(Number(id)));
	} else {
		res.json(product.getAll());
	}
});

routerProduct.post("/", controller.admin, (req, res) => {
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
				"Uno ó varios de los campos ha quedado vacio. Verifique que tenga todos los datos solicitados: nombre, precio, imagen(url o link), descripcion, stock",
		});
	} else {
		const response = product.save({
			nombre: nombre,
			precio: Number(precio),
			imagen: imagen,
			descripcion: descripcion,
			stock: Number(stock),
		});
		res.json({
			success: "Producto agregado correctamente.",
			add: response,
		});
	}
});

routerProduct.put("/:id", controller.admin, (req, res) => {
	const { nombre, precio, imagen, descripcion, stock } = req.body;
	const { id } = req.params;
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
		const response = product.update(Number(id), {
			nombre: nombre,
			precio: Number(precio),
			imagen: imagen,
			descripcion: descripcion,
			stock: Number(stock),
		});
		res.json({
			response: response,
		});
	}
});

routerProduct.delete("/:id", controller.admin, (req, res) => {
	const { id } = req.params;
	const response = product.delete(Number(id));

	res.json({
		response: response,
	});
});

export default routerProduct;