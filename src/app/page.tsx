export default function Home() {
  return (
    <div className="container-custom py-12">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
          Welcome to Nisargalahari
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Pure, nature-friendly products that harness the power of nature
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-start/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌿</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Natural Ingredients</h3>
            <p className="text-gray-600">Made with pure, organic ingredients sourced from nature</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-mid/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-gray-600">Highest quality standards for all our natural products</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-end/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌎</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
            <p className="text-gray-600">Sustainable practices that respect our environment</p>
          </div>
        </div>
        
        <div className="mt-12">
          <button className="btn-primary mr-4">
            Explore Products
          </button>
          <button className="btn-secondary">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
