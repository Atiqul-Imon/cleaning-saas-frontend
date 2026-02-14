interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export default function ErrorMessage({ 
  message, 
  onRetry,
  retryText = 'Try Again'
}: ErrorMessageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-red-900 mb-4 font-bold text-xl">Error</div>
        <div className="text-gray-950 font-medium mb-8">{message}</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-indigo-700 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-indigo-800 shadow-md hover:shadow-lg transition-all duration-200"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
}





