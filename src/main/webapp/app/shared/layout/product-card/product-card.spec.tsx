import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import initStore from 'app/config/store';
import ProductCard from 'app/shared/layout/product-card/product-card';

describe('Header', () => {
  let mountedWrapper;

  const productCardProps = {
    product: {
      category: 'Videogame',
      description: 'Controle em perfeito estado de funcionamento, apenas com 3 meses de uso.',
      id: '2fdd667c-9f12-47a8-a3cf-880147897431',
      imageUrl: 'https://gmedia.playstation.com/is/image/SIEPDC/co-op-games-duslsense-controllers-image-block-02-en-28jan21?$1600px--t$',
      name: 'Controle DualSense - Branco PS5',
      priceBase: '300',
      priceCurrency: 'BRL',
      priceType: 'Hourly price',
    },
  };

  const wrapper = (props = productCardProps) => {
    if (!mountedWrapper) {
      const store = initStore();
      const history = createMemoryHistory();
      const { container } = render(
        <Provider store={store}>
          <Router history={history}>
            <ProductCard {...props} />
          </Router>
        </Provider>
      );
      mountedWrapper = container.innerHTML;
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('Should render Card', () => {
    const html = wrapper();
    expect(html).toContain('Card');
  });

  it('Should render product image', () => {
    const html = wrapper();
    expect(html).not.toContain('no-image.png');
  });

  it('Should render default image if product has no image', () => {
    const productWithoutImageProps = productCardProps;
    productWithoutImageProps.product.imageUrl = null;
    const html = wrapper(productWithoutImageProps);
    expect(html).toContain('no-image.png');
  });
});
