import { Link } from 'react-router-dom';
import { GraduationCap, Phone, MapPin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="block text-lg font-bold text-white leading-tight">STUDY VISION</span>
                <span className="block text-xs text-slate-400 leading-tight">COACHING CENTRE</span>
              </div>
            </div>
            <p className="text-sm italic text-slate-400">"Where Learning Meets Success."</p>
            <p className="mt-2 text-sm text-slate-400">Classes 1st to 12th | All Subjects & Streams</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
              <li><Link to="/faculty" className="hover:text-white transition-colors">Faculty</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Portal Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:9354024459" className="hover:text-white transition-colors">9354024459</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Study Vision Coaching Centre</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 flex-shrink-0" />
                <span>@studyvisioncoaching</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Study Vision Coaching Centre. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
