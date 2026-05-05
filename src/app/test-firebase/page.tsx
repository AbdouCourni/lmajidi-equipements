import { getAllProducts } from '../../../lib/firebase/products';

export default async function TestFirebasePage() {
  try {
    const products = await getAllProducts();

    return (
      <div className="container-custom py-8">
        <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
        <div className="p-4 rounded-lg mb-4 bg-green-100 text-green-700">
          <p className="font-semibold">
            Status: Connected. Found {products.length} products.
          </p>
        </div>

        {products.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Products found:</h2>
            <ul className="list-disc pl-5 space-y-1">
              {products.slice(0, 5).map((product) => (
                <li key={product.id} className="text-gray-700">
                  <strong>{product.name}</strong> - {product.brand || 'No brand'} -{' '}
                  {product.price ? `${product.price} MAD` : 'Price on request'}
                </li>
              ))}
            </ul>
            {products.length > 5 && (
              <p className="text-gray-500 mt-2">
                ... and {products.length - 5} more products
              </p>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to connect';

    return (
      <div className="container-custom py-8">
        <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
        <div className="p-4 rounded-lg mb-4 bg-red-100 text-red-700">
          <p className="font-semibold">Status: Error: {message}</p>
        </div>
      </div>
    );
  }
}
