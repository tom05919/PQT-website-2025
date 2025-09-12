'use client';

import { useState } from 'react';

export default function ChallengePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-05 mb-6">
            Challenge
          </h1>
          <p className="text-xl text-neutral-60 max-w-3xl mx-auto mb-8">
            Test your quantitative skills with our challenge questions. 
            View the PDF below and submit your solutions through the Google form.
          </p>
          
          {/* Google Form Link */}
          <div className="mb-12">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdTuEi3kXaYaedsIz4khmFrBH-P4i2BQFw5_fVaUhL60H7mwA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-bright text-neutral-100 font-semibold rounded-lg hover:bg-bright/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Submit Your Solutions
            </a>
          </div>
        </div>
      </section>

      {/* PDF Viewer Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-neutral-90 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-neutral-05 mb-6 text-center">
              PQT Questions
            </h2>
            
            {/* PDF Viewer */}
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                
                
                {hasError ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="text-red-500 mb-2">Failed to load PDF</div>
                    <div className="text-neutral-60 text-sm mb-4">
                      Please make sure the PDF file exists and is accessible.
                    </div>
                    <a
                      href="/PQT_questions.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bright hover:text-bright/80 underline"
                    >
                      Click here to download the PDF instead
                    </a>
                  </div>
                ) : (
                  <div className="border border-neutral-70 rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src="/PQT_questions.pdf#toolbar=1&navpanes=0&scrollbar=1&view=FitH"
                      width="100%"
                      height="800"
                      className="w-full"
                      onLoad={() => setIsLoading(false)}
                      onError={() => {
                        setIsLoading(false);
                        setHasError(true);
                      }}
                      title="PQT Questions PDF"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-6 bg-neutral-85 rounded-lg">
              <h3 className="text-lg font-semibold text-neutral-05 mb-3">Instructions:</h3>
              <ul className="space-y-2 text-neutral-60">
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Read through all the questions in the PDF above
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Use the browser's built-in PDF controls to navigate and zoom
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  If the PDF doesn't load, click the download link to view it directly
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Click "Submit Your Solutions" to access the Google form
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
