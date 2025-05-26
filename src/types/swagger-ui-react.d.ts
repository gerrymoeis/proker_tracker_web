declare module 'swagger-ui-react' {
  import React from 'react';
  
  interface SwaggerUIProps {
    spec?: object;
    url?: string;
    layout?: string;
    docExpansion?: 'list' | 'full' | 'none';
    deepLinking?: boolean;
    defaultModelExpandDepth?: number;
    defaultModelRendering?: 'example' | 'model';
    displayOperationId?: boolean;
    displayRequestDuration?: boolean;
    filter?: boolean | string;
    maxDisplayedTags?: number;
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
    tagSorter?: (a: string, b: string) => number;
    operationsSorter?: (a: object, b: object) => number;
  }
  
  const SwaggerUI: React.FC<SwaggerUIProps>;
  
  export default SwaggerUI;
}
