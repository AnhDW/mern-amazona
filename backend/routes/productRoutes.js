import express from "express";
import Product from "../models/productModel.js";
const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
    const products = await Product.find()
    res.send(products)
})

productRouter.get('/slug/:slug', async (req, res) => {
    const slug = req.params.slug
    const product = await Product.findOne({slug: slug})
    if(product) {
        res.send(product);
    }else{
        res.status(404).send({message:"Product not found"});
    }

})

productRouter.get('/:id', async (req, res) => {
    const _id = req.params.id
    const product = await Product.findById(_id)
    if(product) {
        res.send(product);
    }else{
        res.status(404).send({message:"Product not found"});
    }

})
export default productRouter;