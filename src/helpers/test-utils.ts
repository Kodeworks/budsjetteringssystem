import {render, RenderOptions} from '@testing-library/react';
import GlobalWrapper from './GlobalWrapper';

const customRender = (
  ui: React.ReactElement<any>,
  options?: Omit<RenderOptions, 'queries'>,
  ) =>
  render(ui, {wrapper: GlobalWrapper, ...options});

// re-export everything
export * from '@testing-library/react';

// override render method
export {customRender as render};
