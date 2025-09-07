import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-neutral-90 border-t border-neutral-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Club Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/images/logo-no-text.png"
                alt="Princeton Quantitative Traders Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <h3 className="text-neutral-05 text-lg font-semibold">Princeton Quantitative Traders</h3>
            </div>
            <p className="text-neutral-60 text-sm">
              Fostering a community of mutually interested students in quantitative finance and applied mathematics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-neutral-05 text-base font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-neutral-60 hover:text-bright transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="text-neutral-60 hover:text-bright transition-colors text-sm">
                  Sponsors
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-neutral-60 hover:text-bright transition-colors text-sm">
                  Join Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-neutral-05 text-base font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-neutral-60">
              <p>Email: pqt@princeton.edu</p>
              <p>Discord: Princeton Quantitative Traders</p>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-80 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-neutral-60 text-sm">
              © 2025 Princeton Quantitative Traders. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-neutral-60 hover:text-bright transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-neutral-60 hover:text-bright transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
