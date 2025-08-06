import { Request, Response } from 'express';
import { db } from '../db/index';
import { productsTable } from '../db/productsSchema';
import { eq } from 'drizzle-orm';

export async function listProducts(req: Request, res: Response) {
  try {
    const products = await db.select().from(productsTable);
    res.json(products);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
    return;
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));

    if (!product) {
      res.status(404).send({ message: 'Product not found' });
      return;
    } else {
      res.json(product);
      return;
    }
  } catch (e) {
    res.status(500).send(e);
    return;
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    console.log(req.userId);

    const productData = req.cleanBody as {
      name: string;
      price: number;
      id?: string;
      description?: string | null;
      image?: string;
    };
    const [product] = await db.insert(productsTable).values(productData).returning();
    res.status(201).json(product);
    return;
  } catch (e) {
    res.status(500).send(e);
    return;
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const updatedFields = req.cleanBody as Partial<{
      name?: string;
      price?: number;
      id?: string;
      description?: string | null;
      image?: string;
    }>;

    const [product] = await db
      .update(productsTable)
      .set(updatedFields)
      .where(eq(productsTable.id, id))
      .returning();

    if (product) {
      res.json(product);
      return;
    } else {
      res.status(404).send({ message: 'Product was not found' });
      return;
    }
  } catch (e) {
    res.status(500).send(e);
    return;
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();
    if (deletedProduct) {
      res.status(204).send();
      return;
    } else {
      res.status(404).send({ message: 'Product was not found' });
      return;
    }
  } catch (e) {
    res.status(500).send(e);
    return;
  }
}
