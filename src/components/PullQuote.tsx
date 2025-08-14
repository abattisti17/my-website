import React from 'react';

interface PullQuoteProps {
  /** Small header text above the quote */
  header?: string;
  /** Main quote text - can be a string or JSX for formatted content */
  quote?: string | React.ReactNode;
  /** Body text below the quote */
  body?: string | React.ReactNode;
  /** Attribution for the quote (author, source, etc.) */
  attribution?: string | React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Children for custom content structure */
  children?: React.ReactNode;
}

/**
 * PullQuote component for testimonials, callouts, and highlighted content
 * 
 * Can be used in two ways:
 * 1. With props for structured content
 * 2. With children for custom content structure
 */
const PullQuote: React.FC<PullQuoteProps> = ({
  header,
  quote,
  body,
  attribution,
  className = '',
  children
}) => {
  return (
    <div className={`quote ${className}`}>
      {children ? (
        children
      ) : (
        <>
          {header && <p><b>{header}</b></p>}
          {quote && (
            typeof quote === 'string' ? (
              <h2 className="quote-title">"{quote}"</h2>
            ) : (
              <div className="quote-title">{quote}</div>
            )
          )}
          {body && (
            <div className="quote-body">
              {typeof body === 'string' ? <p>{body}</p> : body}
            </div>
          )}
          {attribution && (
            <div className="quote-attribution">
              {typeof attribution === 'string' ? <p>{attribution}</p> : attribution}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PullQuote;
