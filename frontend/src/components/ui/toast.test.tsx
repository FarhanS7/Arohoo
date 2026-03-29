import { ToastProvider } from '@/components/providers/ToastProvider';
import { useToast } from '@/features/common/hooks/useToast';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';

const TestComponent = () => {
  const toast = useToast();
  return (
    <div>
      <button onClick={() => toast.success('Success Message')}>Success</button>
      <button onClick={() => toast.error('Error Message')}>Error</button>
    </div>
  );
};

describe('Toast System', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders a success toast when triggered', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Success'));

    expect(await screen.findByText(/SUCCESS MESSAGE/i)).toBeInTheDocument();
    // Verify premium styles (monochrome black for success)
    const toastElement = screen.getByText(/SUCCESS MESSAGE/i).closest('div');
    expect(toastElement?.parentElement).toHaveClass('bg-black');
  });

  it('renders an error toast when triggered', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Error'));

    expect(await screen.findByText(/ERROR MESSAGE/i)).toBeInTheDocument();
    const toastElement = screen.getByText(/ERROR MESSAGE/i).closest('div');
    expect(toastElement?.parentElement).toHaveClass('text-red-600');
  });

  it('auto-dismisses after duration', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Success'));
    expect(await screen.findByText(/SUCCESS MESSAGE/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5100);
    });

    expect(screen.queryByText(/SUCCESS MESSAGE/i)).not.toBeInTheDocument();
  });

  it('can be manually closed', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Success'));
    expect(await screen.findByText(/SUCCESS MESSAGE/i)).toBeInTheDocument();

    const closeBtn = screen.getByText(/Close/i);
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/SUCCESS MESSAGE/i)).not.toBeInTheDocument();
  });
});
