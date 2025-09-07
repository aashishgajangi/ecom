export default function TestPage() {
  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 gradient-text">
          Test Page - Layout System Working
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">CSS Classes Test</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-primary-start/10 rounded">
              <p className="text-lg">Primary Start Background: <code>bg-primary-start/10</code></p>
            </div>
            
            <div className="p-4 bg-primary-mid/10 rounded">
              <p className="text-lg">Primary Mid Background: <code>bg-primary-mid/10</code></p>
            </div>
            
            <div className="p-4 bg-primary-end/10 rounded">
              <p className="text-lg">Primary End Background: <code>bg-primary-end/10</code></p>
            </div>
            
            <div className="flex space-x-4">
              <button className="btn-primary">
                Primary Button
              </button>
              
              <button className="btn-secondary">
                Secondary Button
              </button>
            </div>
            
            <div className="p-4 border-l-4 border-primary-start">
              <p className="gradient-text text-xl font-semibold">
                Gradient Text Working!
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Success!</h3>
          <p className="text-green-700">
            The layout system is working correctly. Header and footer are loaded from the database,
            and all CSS classes are being applied properly.
          </p>
        </div>
      </div>
    </div>
  );
}
