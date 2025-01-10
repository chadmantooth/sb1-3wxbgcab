import React from 'react';
import { cn } from '@/lib/utils';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailsModal({ isOpen, onClose }: EventDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="absolute right-4 top-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-2xl font-semibold leading-6 text-gray-900 mb-8">
                Emerging Technology Briefing - Upwind Security
              </h3>

              <div className="mt-4 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Wednesday, December 18, 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>11:00 AM - 12:00 PM (EST)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Virtual - Web Conference</span>
                  </div>
                </div>

                <div className="prose prose-blue max-w-none">
                  <p>
                    Our first emerging technology briefing will be with Upwind Security, founded in 2022 by the team behind Spot.io—which was acquired by NetApp for $450 million. They specialize in cloud security solutions.
                  </p>

                  <p>
                    They are an Israeli cybersecurity company that helps organizations secure their cloud environments. Upwind's platform consolidates various security functions into one offering, including Cloud Security Posture Management (CSPM), Cloud Workload Protection (CWPP), and vulnerability management. Upwind's founders include Amiram Shachar, Liran Polak, Lavi Ferdman, and Tal Zuri.
                  </p>

                  <p>
                    The company has rapidly gained traction, securing $80 million in funding within its first year and attracting investment from prominent firms such as Greylock, Cyberstarts, Leaders Fund, Craft Ventures, Cerca Partners, Sheva VC, and Penny Jar Capital.
                  </p>

                  <h4 className="text-lg font-semibold mt-6 mb-4">Platform Overview</h4>
                  <p>
                    Upwind's flagship offering is a next-generation Cloud Native Application Protection Platform (CNAPP) that integrates cloud security posture management with runtime context and real-time protection. This platform enables security teams to accurately prioritize risks and respond swiftly to critical threats.
                  </p>

                  <h4 className="text-lg font-semibold mt-6 mb-4">Key Features</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Vulnerability Management:</strong> Identifying and prioritizing vulnerabilities across virtual machines, containers, and serverless environments.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Container Security:</strong> Providing comprehensive protection for containers and Kubernetes throughout the development lifecycle.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Cloud Detection and Response (CDR):</strong> Offering real-time threat detection and response capabilities.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>API Security:</strong> Discovering, cataloging, and securing APIs with unified runtime protection.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Identity Security:</strong> Managing human and non-human identities across cloud environments.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={() => window.open('https://example.com/register', '_blank', 'noopener,noreferrer')}
              className={cn(
                "inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm",
                "hover:bg-blue-500 sm:ml-3 sm:w-auto"
              )}
            >
              Register Now
            </button>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900",
                "ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              )}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}