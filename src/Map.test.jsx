import { render } from '@testing-library/react';
import Map from './Map';

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
}));

test('Map component renders without crashing', () => {
  render(<Map />);
});
