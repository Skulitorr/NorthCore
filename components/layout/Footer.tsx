import React from 'react';
import Icons from '../common/Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16 no-print">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">VaktAI</h3>
            <p className="text-sm text-gray-400">
              Þróað með ❤️ af íslenskum hugbúnaðarsérfræðingum
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Flýtileiðir</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Hjálp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Leiðbeiningar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API skjölun</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Stuðningur</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center">
                <Icons.Phone className="w-4 h-4 mr-2" />
                +354 555 0000
              </li>
              <li className="flex items-center">
                <Icons.Mail className="w-4 h-4 mr-2" />
                support@vaktai.is
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Lagalegur fyrirvari</h4>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} VaktAI. Öll réttindi áskilin. 
              Persónuverndarstefna og skilmálar gilda.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
