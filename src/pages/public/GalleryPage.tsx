import { useState } from 'react';
import { Camera } from 'lucide-react';

const categories = [
  'All',
  'Classroom Activities',
  'Teaching Sessions',
  'Test & Examination',
  'Student Activities',
  'Results & Achievements',
  'Special Events',
];

const galleryImages = [
  { url: 'https://images.pexels.com/photos/31155018/pexels-photo-31155018.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Students taking a test', category: 'Test & Examination' },
  { url: 'https://images.pexels.com/photos/8978622/pexels-photo-8978622.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Teacher and students in classroom', category: 'Teaching Sessions' },
  { url: 'https://images.pexels.com/photos/34162713/pexels-photo-34162713.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Students engaged in classroom', category: 'Classroom Activities' },
  { url: 'https://images.pexels.com/photos/37811262/pexels-photo-37811262.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Students focused on studies', category: 'Student Activities' },
  { url: 'https://images.pexels.com/photos/37812834/pexels-photo-37812834.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Students writing notes', category: 'Classroom Activities' },
  { url: 'https://images.pexels.com/photos/37811241/pexels-photo-37811241.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Group of students studying', category: 'Student Activities' },
  { url: 'https://images.pexels.com/photos/34162714/pexels-photo-34162714.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Students concentrating on studies', category: 'Classroom Activities' },
  { url: 'https://images.pexels.com/photos/37852096/pexels-photo-37852096.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Students in classroom', category: 'Teaching Sessions' },
  { url: 'https://images.pexels.com/photos/37812750/pexels-photo-37812750.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: 'Students writing in classroom', category: 'Test & Examination' },
];

export function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredImages = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-slate-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-blue-300 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-blue-500/30 px-4 py-1.5 text-sm font-medium text-blue-50 backdrop-blur-sm ring-1 ring-white/20">
              Gallery
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight">
              Moments at Study Vision
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-blue-100 leading-relaxed">
              A glimpse into our classrooms, teaching sessions, events and the achievements of our students.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl shadow-sm ring-1 ring-slate-200"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    <Camera className="h-3 w-3" />
                    {image.category}
                  </span>
                  <p className="mt-2 text-sm text-white">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Camera className="h-12 w-12 text-slate-300" />
            <p className="mt-4 text-sm text-slate-500">No images in this category yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
