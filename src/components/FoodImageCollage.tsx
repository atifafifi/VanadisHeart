import React, { useEffect, useState } from 'react';

interface CollageImage {
  id: string;
  url: string;
  style: {
    top: string;
    left: string;
    transform: string;
    width: string;
    height: string;
  };
  shape: string;
}

const shapes = [
  'shape-circle',
  'shape-hexagon',
  'shape-triangle',
  'shape-diamond',
  'shape-pentagon',
  'shape-parallelogram'
];

const FoodImageCollage: React.FC = () => {
  const [images, setImages] = useState<CollageImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const UNSPLASH_ACCESS_KEY = '53oH6r_tvuuUFuRWsQMdaBZqVmh9HhXjeIBl306hICw';

  const generateRandomPosition = () => {
    // Random position between 5% and 75% of container
    const top = Math.random() * 70 + 5;
    const left = Math.random() * 70 + 5;
    // Random size between 150px and 250px
    const size = Math.random() * 100 + 150;
    // Random rotation between -15 and 15 degrees
    const rotation = Math.random() * 30 - 15;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `rotate(${rotation}deg)`,
      width: `${size}px`,
      height: `${size}px`
    };
  };

  const generateRandomImage = async (query: string): Promise<CollageImage> => {
    const foodQueries = [
      'italian food', 'asian cuisine', 'dessert',
      'healthy food', 'breakfast', 'dinner plate'
    ];
    
    const selectedQuery = query || foodQueries[Math.floor(Math.random() * foodQueries.length)];
    
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${selectedQuery}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();

      // Get random position and shape
      const style = generateRandomPosition();
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      return {
        id: data.id,
        url: data.urls.regular,
        style,
        shape
      };
    } catch (error) {
      console.error(`Error fetching image for ${selectedQuery}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      try {
        const foodQueries = [
          'italian food',
          'asian cuisine',
          'dessert',
          'healthy food',
          'breakfast',
          'dinner plate'
        ];

        const imagePromises = foodQueries.map(query => generateRandomImage(query));
        const fetchedImages = await Promise.all(imagePromises);
        setImages(fetchedImages);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  if (isLoading) {
    return (
      <div className="food-collage loading">
        {Array(6).fill(null).map((_, index) => (
          <div key={index} className={`collage-item collage-item-${index + 1} skeleton`} />
        ))}
      </div>
    );
  }

  return (
    <div className="food-collage">
      {images.map((image) => (
        <div
          key={image.id}
          className={`collage-item ${image.shape}`}
          style={image.style}
        >
          <img 
            src={image.url} 
            alt="Food collection"
            className="collage-image"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default FoodImageCollage;