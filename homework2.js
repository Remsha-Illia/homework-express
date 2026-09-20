import express from 'express'

const app = express();
app.use(express.json());

app.get('/timestamp', (req, res) => {
  res.json({ timestamp: new Date().toISOString() })
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/stats', (req, res) => {
  res.json({
    uptime: Math.floor(process.uptime()),
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});

let products = [
  { id: 1, name: 'gutar', price: 10000, category: 'Electronics', image: '' }
];

app.post('/products', async (req, res) => {
  try {
    const { name, price, category, image } = req.body;
    const { fail } = req.query;

    if (
      !name || typeof name !== 'string' || name.trim() === '' ||
      typeof price !== 'number' || price <= 0 ||
      !category || typeof category !== 'string' || category.trim() === ''
    ) {
      return res.status(422).json({ message: 'Invalid product data' });
    }

    const existingProduct = products.find(
      (p) => p.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (existingProduct) {
      return res.status(409).json({ message: 'Conflict: product name already exists' });
    }

    const productData = {
      name: name.trim(),
      price,
      category: category.trim(),
      image: image ? image.trim() : ''
    };
    const savedProduct = await addProduct(productData, fail);
    return res.status(201).json(savedProduct);

  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

function addProduct(newProduct, fail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail === 'true' || fail === true) {
        return reject(new Error('Database error during product save'));
      }

      const createdProduct = {
        id: Date.now(),
        ...newProduct
      };

      products.push(createdProduct);
      resolve(createdProduct);
    }, 200);
  });
}

app.get('/products', (req, res) => {
  res.json(products);
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})