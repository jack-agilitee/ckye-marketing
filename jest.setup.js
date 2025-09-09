import '@testing-library/jest-dom'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // Filter out Next.js specific props that shouldn't be passed to img
    const { fill, priority, ...imgProps } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...imgProps} />
  },
}))

// Mock SCSS modules
const mockStyles = {
  featureSection: 'featureSection',
  'image-left': 'image-left',
  'image-right': 'image-right',
  container: 'container',
  imageWrapper: 'imageWrapper',
  content: 'content',
  heading: 'heading',
  bodyText: 'bodyText',
  image: 'image'
};

jest.mock('./src/components/organisms/FeatureSection/FeatureSection.module.scss', () => mockStyles, { virtual: true });
jest.mock('*.module.scss', () => mockStyles);
jest.mock('*.module.css', () => ({}))

// Global test utilities
global.matchMedia = global.matchMedia || function () {
  return {
    matches: false,
    addListener: function () {},
    removeListener: function () {}
  }
}

// Mock HTMLCanvasElement for axe-core color contrast checks
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => ({ data: new Array(4) })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => ({ data: new Array(4) })),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    transform: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
  }))
});