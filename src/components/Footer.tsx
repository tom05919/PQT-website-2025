import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#4a3b32] border-t border-[#3c2e26] text-[#e9e2db]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
              <h3 className="text-[#fff7f0] text-lg font-serif font-semibold">
                Princeton Quantitative Traders
              </h3>
            </div>
            <p className="text-[#d3c6bc] text-sm leading-relaxed">
              Fostering a community of students passionate about quantitative
              finance, research, and applied mathematics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#fff7f0] text-base font-serif font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-[#d3c6bc] hover:text-[#d26b2c] transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/sponsors"
                  className="text-[#d3c6bc] hover:text-[#d26b2c] transition-colors text-sm"
                >
                  Sponsors
                </Link>
              </li>
              <li>
                <Link
                  href="/join"
                  className="text-[#d3c6bc] hover:text-[#d26b2c] transition-colors text-sm"
                >
                  Join Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#fff7f0] text-base font-serif font-semibold mb-4">
              Contact
            </h4>
            <div className="space-y-2 text-sm text-[#d3c6bc]">
              <p>Email: pqt@princeton.edu</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
