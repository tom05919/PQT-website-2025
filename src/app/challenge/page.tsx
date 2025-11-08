export default function ChallengePage() {
  return (
    <main className="min-h-screen bg-[#d2c3b3] text-[#2e2b28] font-sans antialiased">
      {/* Hero */}
      <section className="py-28 px-6 sm:px-10 lg:px-16 border-b border-[#c0ae9f]/50">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6">
            Challenge
          </h1>
          <p className="text-lg md:text-xl text-[#463f3a] max-w-3xl mx-auto leading-relaxed">
            Download the latest dataset as a CSV, solve the problems, and submit your solutions via the form.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <a
              href="/api/challenge-csv"
              className="inline-block bg-[#d26b2c] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#bb5e27] transition-colors"
            >
              Download Latest Dataset (CSV)
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdTuEi3kXaYaedsIz4khmFrBH-P4i2BQFw5_fVaUhL60H7mwA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-[#d26b2c] text-[#d26b2c] px-8 py-4 rounded-full text-lg font-medium hover:bg-[#d26b2c] hover:text-white transition-colors"
            >
              Submit Your Solutions
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="bg-[#e9e1d9] rounded-2xl p-8 shadow-sm">
            <h2 className="text-3xl font-serif font-semibold mb-3">How It Works</h2>
            <ul className="space-y-3 text-[#463f3a]">
              <li className="flex items-start">
                <span className="text-[#b46b35] mr-3 text-lg">•</span>
                Click “Download Latest Dataset (CSV)” to get the newest challenge data.
              </li>
              <li className="flex items-start">
                <span className="text-[#b46b35] mr-3 text-lg">•</span>
                Run your analysis and prepare your answers.
              </li>
              <li className="flex items-start">
                <span className="text-[#b46b35] mr-3 text-lg">•</span>
                Submit responses using the linked Google form.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl p-8 border border-[#c0ae9f]/60">
            <h3 className="text-2xl font-serif font-semibold mb-3">Dataset Generation</h3>
            <p className="text-[#463f3a] leading-relaxed">
              The CSV is generated on-demand by a Python script you’ll add to the repository.
              When you click the button, our server route runs the script and streams the CSV
              back to your browser for download.
            </p>
            <div className="mt-4 text-sm text-[#5b514c]">
              <p>Script path (expected): <code>scripts/generate_challenge_csv.py</code></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
