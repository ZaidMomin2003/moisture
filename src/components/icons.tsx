import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20" />
      <path d="M19 4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4" />
      <path d="M19 12a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4" />
      <path d="M19 20a4 4 0 0 1-4-4H9a4 4 0 0 1-4-4" />
    </svg>
  );
}

export function WheatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 22s2-2 2-4V6c0-2.5-2-4-2-4" />
      <path d="M22 22s-2-2-2-4V6c0-2.5 2-4 2-4" />
      <path d="M12 22V2" />
      <path d="m5 4 2.5 2.5" />
      <path d="m19 4-2.5 2.5" />
      <path d="m5 9 2.5 2.5" />
      <path d="m19 9-2.5 2.5" />
      <path d="m5 14 2.5 2.5" />
      <path d="m19 14-2.5 2.5" />
    </svg>
  );
}

export function RiceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2c-2.5 3-2.5 5 0 8" />
      <path d="M12 10c2.5-3 2.5-5 0-8" />
      <path d="M10 22c-3.5-1-4-4.5-4-9 0-3.5 2-5 4-5" />
      <path d="M14 22c3.5-1 4-4.5 4-9 0-3.5-2-5-4-5" />
      <path d="M12 2v20" />
    </svg>
  );
}

export function MaizeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M12 10v4" />
      <path d="M14.5 12a2.5 2.5 0 0 0-5 0" />
      <path d="M17 12a5 5 0 0 0-10 0" />
      <path d="M19.5 12a7.5 7.5 0 0 0-15 0" />
    </svg>
  );
}

export function LoadingSpinner(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
