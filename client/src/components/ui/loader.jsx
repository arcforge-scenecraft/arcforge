import { ArrowPathIcon } from "@heroicons/react/24/outline";

export const Loader = ({ text = "Loading..." }) => (
  <article className="flex flex-col items-center justify-center" style={{ textAlign: 'center', padding: '2rem' }}>
    <ArrowPathIcon 
      className="spinner" 
      style={{ width: '48px', height: '48px', color: '#6200ee', marginBottom: '1rem' }} 
    />
    <small>{text}</small>
  </article>
);