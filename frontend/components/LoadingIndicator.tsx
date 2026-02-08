'use client';

/**
 * LoadingIndicator Component
 * Reusable animated loading spinner/dots component
 * T026: Add animated loading indicators
 *
 * Features:
 * - Smooth 60fps animations using CSS keyframes
 * - Multiple variants: spinner, dots, pulse
 * - Configurable size and color
 * - Accessibility: aria-live for screen readers
 */

interface LoadingIndicatorProps {
  /** Size variant: sm (12px), md (16px), lg (24px) */
  size?: 'sm' | 'md' | 'lg';

  /** Color variant: primary (blue), secondary (gray), success (green) */
  color?: 'primary' | 'secondary' | 'success' | 'error';

  /** Display variant: spinner, dots, pulse */
  variant?: 'spinner' | 'dots' | 'pulse';

  /** Custom label for accessibility */
  label?: string;

  /** Optional CSS class for wrapper */
  className?: string;
}

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-12 w-12',
} as const;

const COLORS = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  success: 'text-green-600',
  error: 'text-red-600',
} as const;

const DOT_COLORS = {
  primary: 'bg-blue-600',
  secondary: 'bg-gray-600',
  success: 'bg-green-600',
  error: 'bg-red-600',
} as const;

/**
 * Spinner variant - rotating circle with border
 */
const SpinnerVariant = ({
  size = 'md',
  color = 'primary',
}: {
  size: 'sm' | 'md' | 'lg';
  color: 'primary' | 'secondary' | 'success' | 'error';
}) => (
  <svg
    className={`${SIZES[size]} ${COLORS[color]} animate-spin`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/**
 * Dots variant - three bouncing dots
 */
const DotsVariant = ({
  size = 'md',
  color = 'primary',
}: {
  size: 'sm' | 'md' | 'lg';
  color: 'primary' | 'secondary' | 'success' | 'error';
}) => {
  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  }[size];

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${dotSize} ${DOT_COLORS[color]} rounded-full animate-bounce`}
          style={{
            animationDelay: `${i * 200}ms`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Pulse variant - pulsing single element
 */
const PulseVariant = ({
  size = 'md',
  color = 'primary',
}: {
  size: 'sm' | 'md' | 'lg';
  color: 'primary' | 'secondary' | 'success' | 'error';
}) => {
  const bgColor = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    error: 'bg-red-600',
  }[color];

  return (
    <div className={`${SIZES[size]} ${bgColor} rounded-full animate-pulse`} />
  );
};

/**
 * LoadingIndicator Component
 * Renders animated loading indicator with accessibility support
 * Performance: 60fps CSS animations (no JS animation frames)
 */
export const LoadingIndicator = ({
  size = 'md',
  color = 'primary',
  variant = 'spinner',
  label = 'Loading',
  className = '',
}: LoadingIndicatorProps) => {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {variant === 'spinner' && (
        <SpinnerVariant size={size} color={color} />
      )}
      {variant === 'dots' && <DotsVariant size={size} color={color} />}
      {variant === 'pulse' && <PulseVariant size={size} color={color} />}
    </div>
  );
};

/**
 * Inline loading indicator - for use within text or inline elements
 */
export const InlineLoadingIndicator = ({
  label = 'Loading',
}: {
  label?: string;
}) => (
  <span
    className="inline-flex items-center gap-1"
    role="status"
    aria-label={label}
  >
    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-100" />
    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-200" />
  </span>
);
