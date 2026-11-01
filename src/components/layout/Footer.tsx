import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-[#EFEAE0] border-t border-[#D8D1C5] mt-6 md:mt-10 pt-10 md:pt-14 pb-10">
      <div className="w-full px-[21px] lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-[#D8D1C5]">
          {/* Col 1: Brand & Publication Details */}
          <div className="space-y-4 md:col-span-1">
            <h2 className="font-serif-editorial text-3xl tracking-[0.2em] text-[#25221F] uppercase">
              KAFTAN
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-[#77716A]">
              The World of Women&apos;s Fashion
            </p>
            <p className="text-xs text-[#77716A] leading-relaxed max-w-xs">
              Australia&apos;s premier fashion editorial publication covering runway stories,
              visionary designers, resort lifestyle, travel, and thoughtful style.
            </p>
          </div>

          {/* Col 2: Editorial Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#25221F]">
              Editorial
            </h3>
            <ul className="space-y-2 text-xs uppercase tracking-[0.15em] text-[#77716A]">
              <li>
                <Link href="/latest" className="hover:text-[#25221F]">The Latest</Link>
              </li>
              <li>
                <Link href="/trends" className="hover:text-[#25221F]">Trends</Link>
              </li>
              <li>
                <Link href="/style" className="hover:text-[#25221F]">Style Guides</Link>
              </li>
              <li>
                <Link href="/designers" className="hover:text-[#25221F]">Designers</Link>
              </li>
              <li>
                <Link href="/travel" className="hover:text-[#25221F]">Travel &amp; Ateliers</Link>
              </li>
              <li>
                <Link href="/lifestyle" className="hover:text-[#25221F]">Lifestyle</Link>
              </li>
              <li>
                <Link href="/sale" className="text-[#B44238] font-semibold hover:text-[#8f322a]">Clearance Sale</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: About & Partnerships */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#25221F]">
              Publication
            </h3>
            <ul className="space-y-2 text-xs uppercase tracking-[0.15em] text-[#77716A]">
              <li>
                <span className="cursor-default">About KAFTAN</span>
              </li>
              <li>
                <span className="cursor-default">Masthead &amp; Contributors</span>
              </li>
              <li>
                <span className="cursor-default">Sponsorship &amp; Partnerships</span>
              </li>
              <li>
                <span className="cursor-default">Advertising Inquiries</span>
              </li>
              <li>
                <span className="cursor-default">Careers</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Region & Editions */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#25221F]">
              Edition
            </h3>
            <div className="text-xs text-[#77716A] space-y-1">
              <p className="font-semibold text-[#25221F] uppercase tracking-wider">
                Australia (National)
              </p>
              <p>Sydney • Melbourne • Brisbane • Perth</p>
              <p className="pt-2 text-[11px] leading-relaxed">
                Published digitally and updated continuously with original fashion journalism and photography.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#77716A] space-y-4 sm:space-y-0">
          <p>© 2026 KAFTAN Publication. All rights reserved.</p>
          <div className="flex space-x-6 uppercase tracking-wider text-[10px]">
            <span className="hover:text-[#25221F] cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#25221F] cursor-pointer">Terms of Use</span>
            <span>•</span>
            <span className="hover:text-[#25221F] cursor-pointer">Editorial Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
