import React from 'react';
import { Mail, Phone, Clock, Globe } from 'lucide-react';

const ContactUsParent = () => {
  return (
    <div className="min-h-screen pt-20 px-4 pb-8 bg-[#F6F7F9]">
      <div className="max-w-4xl mx-auto bg-white border border-[#E3E7ED] rounded-xl shadow-sm overflow-hidden">
        <div className="bg-white border-b border-[#E3E7ED] p-4 flex items-center space-x-3">
          <Mail className="w-6 h-6 text-[#3A7CA5]" />
          <h2 className="text-lg font-semibold text-[#1F2933]">Contact Us</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1F2933] mb-4 text-center">Get in Touch</h3>

              <div className="bg-[#F6F7F9] border border-[#E3E7ED] p-4 rounded-lg space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#3A7CA5] flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#1F2933]">Email Support</p>
                    <p className="text-sm text-[#52616B]">support@pratiyogitagyan.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#3A7CA5] flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#1F2933]">Phone</p>
                    <p className="text-sm text-[#52616B]">+91 9876543210</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-[#3A7CA5] flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#1F2933]">Support Hours</p>
                    <p className="text-sm text-[#52616B]">Mon-Fri: 9 AM - 6 PM IST</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-[#3A7CA5] flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#1F2933]">Website</p>
                    <p className="text-sm text-[#52616B]">www.pratiyogitagyan.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-[#1F2933] mb-4 text-center">Quick Help</h3>

              <div className="bg-[#edf4f8] border border-[#cfe0eb] p-4 rounded-lg">
                <ul className="space-y-3 text-[#52616B] text-sm">
                  <li className="flex items-center space-x-3"><span>💬</span><span>Use the chatbot for instant study help</span></li>
                  <li className="flex items-center space-x-3"><span>📧</span><span>Email us for technical support</span></li>
                  <li className="flex items-center space-x-3"><span>📞</span><span>Call for urgent queries</span></li>
                  <li className="flex items-center space-x-3"><span>🕒</span><span>Response time: Within 24 hours</span></li>
                </ul>
              </div>

              <div className="bg-[#f3f6f9] border border-[#E3E7ED] p-4 rounded-lg">
                <p className="text-center text-[#52616B] font-medium text-sm">
                  "We're here to support your learning journey!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsParent;
