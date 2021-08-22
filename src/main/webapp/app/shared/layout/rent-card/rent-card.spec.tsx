import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import initStore from 'app/config/store';
import RentCard from 'app/shared/layout/rent-card/rent-card';

describe('Rent Card', () => {
  let mountedWrapper;

  const rentCardProps = {
    product: {
      finalDate: '2021-08-23T01:25:37.812+00:00',
      id: 'c336ddc4-aad9-428e-84e5-4ea7eab01bb7',
      initialDate: '2021-08-22T01:25:37.812+00:00',
      paymentType: 'Credit Card',
      priceBase: '500',
      priceCurrency: 'BRL',
      priceType: 'DAY',
      priceTypeDescription: 'Por dia',
      productImageUrl:
        'https://gmedia.playstation.com/is/image/SIEPDC/co-op-games-duslsense-controllers-image-block-02-en-28jan21?$1600px--t$',
      productId: '5d5ae1bc-875a-46d1-9c74-dbd4f47ff44a',
      status: 'REQUESTED',
      userOwnerId: 'user-1',
      userRentId: 'user-2',
    },
  };

  const manageRentCardProps = {
    allowManage: true,
    product: {
      finalDate: '2021-08-23T01:25:37.812+00:00',
      id: 'c336ddc4-aad9-428e-84e5-4ea7eab01bb7',
      initialDate: '2021-08-22T01:25:37.812+00:00',
      paymentType: 'Credit Card',
      priceBase: '500',
      priceCurrency: 'BRL',
      priceType: 'DAY',
      priceTypeDescription: 'Por dia',
      productImageUrl:
        'https://gmedia.playstation.com/is/image/SIEPDC/co-op-games-duslsense-controllers-image-block-02-en-28jan21?$1600px--t$',
      productId: '5d5ae1bc-875a-46d1-9c74-dbd4f47ff44a',
      status: 'REQUESTED',
      userOwnerId: 'user-1',
      userRentId: 'user-2',
    },
  };

  const wrapper = (props = rentCardProps) => {
    if (!mountedWrapper) {
      const store = initStore();
      const history = createMemoryHistory();
      const { container } = render(
        <Provider store={store}>
          <Router history={history}>
            <RentCard {...props} />
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

  it('Should render CardMedia', () => {
    const html = wrapper();
    expect(html).toContain('CardMedia');
  });

  it('Should render CardContent', () => {
    const html = wrapper();
    expect(html).toContain('CardContent');
  });

  it('Should render product image', () => {
    const html = wrapper();
    expect(html).not.toContain('no-image.png');
  });

  it('Should render default image if product has no image', () => {
    const productWithoutImageProps = rentCardProps;
    productWithoutImageProps.product.productImageUrl = null;
    const html = wrapper(productWithoutImageProps);
    expect(html).toContain('no-image.png');
  });

  it('Should show manage buttons for status=REQUESTED', () => {
    const html = wrapper(manageRentCardProps);
    expect(html).toContain('Aceitar');
    expect(html).toContain('Recusar');
  });

  it('Should show manage buttons for status=CONFIRMED', () => {
    const confirmedProduct = manageRentCardProps;
    confirmedProduct.product.status = 'CONFIRMED';
    const html = wrapper(manageRentCardProps);
    expect(html).toContain('Finalizar');
  });
});
